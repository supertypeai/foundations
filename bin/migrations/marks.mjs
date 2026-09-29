import { BLOCKS, PKG, apply, bindingOf, importEdits, listRemovals, migrate } from "./source.mjs";

/**
 * 0.4: a glyph beside words goes in their `mark`. Three passes, each on the
 * source the last one left, and every one a no-op on code already migrated:
 *
 *   role     a glyph first or last inside a text role becomes its `mark` or `markEnd`
 *   sibling  a glyph beside a text role in a flex row becomes that role's `mark`
 *   inline   a glyph nudged into words with `align-middle` or a top margin becomes `<Mark>`
 *
 * A file no pass edits is not written. Anything irregular is reported, not guessed at.
 */

/* The roles and glyphs src/eslint.ts names. A migration retires in a release or
 * two, so it keeps a copy rather than reaching into the built lint. */
const ROLES = "Typography(?:P|Muted|Prose|Caption|Small|Label|Eyebrow|H[1-4])|CardTitle";
const GLYPHS = "Icons\\.\\w+|\\w*Icon";
const ROLE = new RegExp(`^(?:${ROLES})$`);
const GLYPH = new RegExp(`^(?:${GLYPHS})$`);
const isGlyph = (name) => GLYPH.test(name);

/** Source written for 0.3 or earlier, found cheaply enough for `doctor` to ask. */
const STALE = [
  /\b(ON_FIRST_LINE|ON_BASELINE)\b/,
  /\bicon-inline\b/,
  /className="[^"]*\binline\b(?!-)[^"]*\balign-middle\b|className="[^"]*\balign-middle\b[^"]*\binline\b(?!-)/,
  new RegExp(`<(?:${ROLES})\\b[^>]*>\\s*<(?:${GLYPHS})\\b`),
];

/* What a glyph carried only to size or nudge itself. The slot does both now. */
const GLYPH_DROP = /^(-?m[lrxt]-[\d.]+|size-[\d.]+|[hw]-[\d.]+|shrink-0|inline|inline-block|align-(middle|baseline|text-top|text-bottom)|-?translate-y-[^ ]+)$/;
/* What a row carried only to line a glyph up. */
const ROW_ALIGN = /^(flex|items-(center|start|baseline))$/;
const ROW_LAYOUT = /^(flex|inline-flex|items-(center|start|baseline)|gap-(x-)?[\d.]+)$/;

const tokens = (text) => text.split(/\s+/).filter(Boolean);

/** The passes, reading source with the app's own TypeScript. */
function passes(ts) {
  const meaningful = (kids) => kids.filter((k) => !(ts.isJsxText(k) && k.getText().trim() === ""));
  const tagOf = (el, sf) => (ts.isJsxElement(el) ? el.openingElement : el).tagName.getText(sf);
  const attrs = (open) => open.attributes.properties;
  const classAttr = (open) => attrs(open).find((p) => ts.isJsxAttribute(p) && p.name.getText() === "className");
  /** A text role of the package's: the name, imported from it. An app's own `CardTitle` is not one. */
  const isRole = (el, sf) => {
    const name = tagOf(el, sf);
    return ROLE.test(name) && [PKG, BLOCKS].includes(bindingOf(ts, sf, name));
  };
  const hasMark = (open) => attrs(open).some((p) => ts.isJsxAttribute(p) && /^mark(End)?$/.test(p.name.getText()));

  /** Every string literal in a className, plain or inside `cn(…)`; null for one it cannot read. */
  const literals = (attr) => {
    const init = attr?.initializer;
    if (!init) return [];
    if (ts.isStringLiteral(init)) return [init];
    if (!ts.isJsxExpression(init) || !init.expression) return null;
    const out = [];
    const visit = (n) => {
      if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) out.push(n);
      ts.forEachChild(n, visit);
    };
    visit(init.expression);
    return out;
  };

  const retext = (lit, sf, text) => {
    const q = lit.getText(sf)[0];
    return [lit.getStart(sf), lit.getEnd(), q + text + q];
  };

  /**
   * `fn` over every literal of a className, as edits. A class it empties says
   * nothing, so it goes: a plain string takes the attribute with it, and an
   * argument to `cn(…)` takes its comma, or the attribute when it was the last.
   */
  const classEdits = (attr, sf, fn) => {
    const lits = literals(attr);
    if (lits === null) return null;
    const next = new Map(lits.map((l) => [l, fn(l.text)]));
    const drop = [attr.getFullStart(), attr.getEnd(), ""];
    if (lits.length === 1 && lits[0] === attr.initializer) return [next.get(lits[0]) ? retext(lits[0], sf, next.get(lits[0])) : drop];

    const empty = (n) => next.has(n) && !next.get(n);
    const calls = new Set(lits.filter((l) => empty(l) && ts.isCallExpression(l.parent)).map((l) => l.parent));
    const edits = lits.filter((l) => !(empty(l) && calls.has(l.parent))).map((l) => retext(l, sf, next.get(l)));
    for (const call of calls) {
      const args = [...call.arguments];
      const removals = listRemovals(args, empty, sf);
      if (removals) edits.push(...removals);
      // Nothing left to call with: the whole class, when the call was all of it.
      else if (call === attr.initializer.expression) return [drop];
      else edits.push(...args.map((a) => retext(a, sf, "")));
    }
    return edits;
  };

  /**
   * Edits pulling the lines inside an unwrapped element left by the indent the
   * element added. A line another edit already takes, or one inside a template
   * literal, whose whitespace is its content, is left alone.
   */
  const dedent = (node, src, sf, taken) => {
    const indentOf = (at) => /^[ \t]*/.exec(src.slice(src.lastIndexOf("\n", at - 1) + 1))[0];
    const outer = indentOf(node.getStart(sf));
    const first = node.openingElement.getEnd() + src.slice(node.openingElement.getEnd()).search(/\S/);
    const inner = indentOf(first);
    if (inner.length <= outer.length || !inner.startsWith(outer)) return [];
    const templates = [];
    const visit = (n) => {
      if (ts.isTemplateExpression(n) || ts.isNoSubstitutionTemplateLiteral(n)) templates.push([n.getStart(sf), n.getEnd()]);
      else ts.forEachChild(n, visit);
    };
    visit(node);
    const within = (at) => [...taken, ...templates].some(([s, e]) => s <= at && at < e);
    const edits = [];
    const end = node.closingElement.getStart(sf);
    for (let nl = src.indexOf("\n", node.openingElement.getEnd()); nl !== -1 && nl + 1 < end; nl = src.indexOf("\n", nl + 1)) {
      const line = nl + 1;
      if (!within(line) && src.startsWith(inner, line)) edits.push([line + outer.length, line + inner.length, ""]);
    }
    return edits;
  };

  /** The glyph's source with its size and nudges gone, or null if its class cannot be read. */
  const cleanGlyph = (glyph, sf) => {
    const attr = classAttr(glyph);
    const edits = attr ? classEdits(attr, sf, (t) => tokens(t).filter((x) => !GLYPH_DROP.test(x)).join(" ")) : [];
    if (!edits) return null;
    const at = glyph.getStart(sf);
    const text = apply(glyph.getText(sf), edits.map(([s, e, r]) => [s - at, e - at, r]));
    return text.replace(/\s+size=\{\d+\}/, "").replace(/\s+/g, " ").replace(/\s*\/>$/, " />");
  };

  /** Remove a node, and its whole line when it stood alone on one. */
  const removal = (node, src, sf, side) => {
    const s = node.getStart(sf), e = node.getEnd();
    let ls = s; while (src[ls - 1] === " " || src[ls - 1] === "\t") ls--;
    let le = e; while (src[le] === " " || src[le] === "\t") le++;
    if (src[ls - 1] === "\n" && src[le] === "\n") return [ls, le + 1, ""];
    return side === "end" ? [ls, e, ""] : [s, le, ""];
  };

  /** A glyph held by a child: `<Icon />` or `{cond && <Icon />}`. */
  const glyphChild = (child, sf) => {
    if (ts.isJsxSelfClosingElement(child) && isGlyph(child.tagName.getText(sf))) return { node: child, glyph: child };
    const e = ts.isJsxExpression(child) && child.expression;
    if (e && ts.isBinaryExpression(e) && e.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken &&
        ts.isJsxSelfClosingElement(e.right) && isGlyph(e.right.tagName.getText(sf))) {
      return { node: child, glyph: e.right, cond: e.left.getText(sf) };
    }
    return null;
  };

  /** A glyph first or last inside a text role becomes its `mark` or `markEnd`. */
  function role(src, sf, { where, note }) {
    const edits = [];
    const visit = (node) => {
      if (ts.isJsxElement(node) && isRole(node, sf) && !hasMark(node.openingElement)) {
        const kids = meaningful(node.children);
        const first = kids.length > 1 ? glyphChild(kids[0], sf) : null;
        const last = kids.length > (first ? 2 : 1) ? glyphChild(kids[kids.length - 1], sf) : null;
        if (first || last) {
          const open = node.openingElement;
          const row = classAttr(open);
          const rowText = row ? row.getText(sf) : "";
          const words = kids.filter((k) => k !== first?.node && k !== last?.node);
          const elements = words.filter((k) => ts.isJsxElement(k) || ts.isJsxSelfClosingElement(k)).length;
          const reason = /flex-col|flex-wrap|justify-between/.test(rowText) ? "row lays out more than a glyph"
            : /\bflex\b/.test(rowText) && elements ? "flex row holding other elements: move the glyph by hand and keep the spaces"
            : null;
          if (reason) { note(`${where(node)}  ${reason}`); return ts.forEachChild(node, visit); }
          const props = [];
          const local = [];
          for (const [name, hit] of [["mark", first], ["markEnd", last]]) {
            if (!hit) continue;
            const glyph = cleanGlyph(hit.glyph, sf);
            if (!glyph) { note(`${where(node)}  glyph class not readable`); return ts.forEachChild(node, visit); }
            props.push(`${name}={${hit.cond ? `${hit.cond} && ${glyph}` : glyph}}`);
            local.push(removal(hit.node, src, sf, name === "mark" ? "start" : "end"));
          }
          if (row) {
            const rewrite = classEdits(row, sf, (t) => {
              let out = tokens(t).filter((x) => !ROW_ALIGN.test(x));
              if (!out.some((x) => x.startsWith("gap-x-"))) out = out.map((x) => (/^gap-[\d.]+$/.test(x) ? x.replace("gap-", "gap-x-") : x));
              return out.filter((x) => !/^gap-y-/.test(x)).join(" ");
            });
            if (!rewrite) { note(`${where(node)}  row class not readable`); return ts.forEachChild(node, visit); }
            local.push(...rewrite);
          }
          const at = open.attributes.getEnd();
          local.push([at, at, " " + props.join(" ")]);
          edits.push(...local);
          note(`${where(node)}  ${props.map((p) => p.split("=")[0]).join(" + ")}`, true);
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
    return edits;
  }

  /**
   * A flex row of [glyph, text role, …]: the glyph becomes the role's `mark`. A
   * row left holding only the role, with nothing else to say, is unwrapped.
   */
  function sibling(src, sf, { where, note }) {
    const edits = [];
    const visit = (node) => {
      if (ts.isJsxElement(node) && /^(div|span|li|p)$/.test(tagOf(node, sf))) {
        const open = node.openingElement;
        const row = classAttr(open);
        const lits = row ? literals(row) : null;
        const rowText = lits?.[0]?.text ?? "";
        const kids = meaningful(node.children);
        const [glyph, role] = kids;
        if (/\bflex\b/.test(rowText) && !/flex-col/.test(rowText) && glyph && role &&
            ts.isJsxSelfClosingElement(glyph) && isGlyph(glyph.tagName.getText(sf)) &&
            ts.isJsxElement(role) && isRole(role, sf) && !hasMark(role.openingElement)) {
          const clean = cleanGlyph(glyph, sf);
          const roleLits = literals(classAttr(role.openingElement));
          if (!clean || roleLits === null) { note(`${where(node)}  class not readable`); return ts.forEachChild(node, visit); }
          const gap = (rowText.match(/(?:^| )gap-(?:x-)?([\d.]+)(?= |$)/) || [])[1];
          const truncate = /(^| )truncate( |$)/.test(roleLits[0]?.text ?? "");
          const next = (t) => {
            let out = tokens(t).filter((x) => x !== "truncate");
            if (gap && !out.some((x) => x.startsWith("gap-x-"))) out.unshift(`gap-x-${gap}`);
            if (truncate && !out.includes("min-w-0")) out.unshift("min-w-0");
            return out.join(" ");
          };
          const local = [];
          if (roleLits[0]) local.push(retext(roleLits[0], sf, next(roleLits[0].text)));
          const cls = roleLits[0] || !next("") ? "" : ` className="${next("")}"`;
          const at = role.openingElement.attributes.getEnd();
          local.push([at, at, `${cls} mark={${clean}}${truncate ? " truncate" : ""}`]);
          local.push(removal(glyph, src, sf, "start"));
          if (kids.length === 2) {
            const left = tokens(rowText).filter((x) => !ROW_LAYOUT.test(x));
            const alone = attrs(open).length === 1 && lits.length === 1 && lits[0] === row.initializer;
            if (!left.length && alone && /^(div|span)$/.test(tagOf(node, sf))) {
              local.push(removal(open, src, sf, "start"), removal(node.closingElement, src, sf, "end"));
              local.push(...dedent(node, src, sf, local));
            } else {
              local.push(...classEdits(row, sf, (t) => tokens(t).filter((x) => !ROW_LAYOUT.test(x)).join(" ")));
            }
          }
          edits.push(...local);
          note(`${where(node)}  sibling glyph into mark: check its colour, which it no longer inherits from the row`, "check");
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
    return edits;
  }

  /**
   * A glyph nudged into a run of words becomes `<Mark>`; its side margins stay on
   * the slot. The file imports `Mark` when this used it.
   */
  function inline(src, sf, { where, note }) {
    const bound = bindingOf(ts, sf, "Mark");
    const taken = bound && bound !== PKG ? (bound === "a declaration" ? bound : `an import from ${bound}`) : null;
    const edits = [];
    const visit = (node) => {
      if (ts.isJsxSelfClosingElement(node)) {
        const attr = classAttr(node);
        const lit = attr?.initializer && ts.isStringLiteral(attr.initializer) ? attr.initializer : null;
        if (lit && /(^| )inline( |$)/.test(lit.text) && /(^| )(align-middle|-?mt-[\d.]+)( |$)/.test(lit.text)) {
          if (taken) { note(`${where(node)}  inline glyph, but \`Mark\` already names ${taken} here: wrap it by hand`); return; }
          const glyph = isGlyph(node.tagName.getText(sf));
          const all = tokens(lit.text);
          const space = all.filter((t) => /^-?m[lrx]-[\d.]+$/.test(t));
          // Only a glyph is sized by the slot; an image keeps its own size.
          const drop = glyph ? GLYPH_DROP : /^(inline|inline-block|align-middle|-?mt-[\d.]+|-?m[lrx]-[\d.]+)$/;
          const keep = all.filter((t) => !drop.test(t) && !space.includes(t));
          const at = node.getStart(sf);
          const edit = keep.length ? retext(lit, sf, keep.join(" ")) : [attr.getFullStart(), attr.getEnd(), ""];
          const text = apply(node.getText(sf), [[edit[0] - at, edit[1] - at, edit[2]]])
            .replace(/\s+size=\{\d+\}/, "").replace(/\s+/g, " ").replace(/\s*\/>$/, " />");
          edits.push([at, node.getEnd(), `<Mark${space.length ? ` className="${space.join(" ")}"` : ""}>${text}</Mark>`]);
          note(`${where(node)}  inline glyph into <Mark>`, true);
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
    return edits.length ? [...edits, ...importEdits(ts, src, sf, ["Mark"], PKG)] : edits;
  }

  return [role, sibling, inline];
}

export default {
  version: "0.4.0",
  title: "a glyph beside words goes in their `mark`",
  stale: (src) => STALE.some((re) => re.test(src)),
  run: ({ files, ts, write }) => migrate({ files, ts, write, steps: passes(ts) }),
};
