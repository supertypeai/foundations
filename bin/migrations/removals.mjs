import { BLOCKS, PKG, bindingOf, importEdits, listRemovals, migrate } from "./source.mjs";

/**
 * 0.4: every second way to do one thing is gone, and each becomes the one way
 * that stays. Only names imported from the package are touched, so an app's own
 * component of the same name is left alone; a shape too irregular to move is
 * reported, never guessed at.
 *
 *   roles   TypographySmall → TypographyCaption as="p", TypographyProseList → TypographyList variant="prose"
 *   accordion  Accordion and its parts → DisclosureGroup and Disclosure
 *   tabs    Tabs and its parts, written out literally → TabGroup
 *   ink     INK_ON_CARD, _POPOVER, _SIDEBAR in a className → style={inkOnSurfaceStyle(…)}
 *   imports the removed names out of the import, the new ones in
 */

const ROLES = {
  TypographySmall: { to: "TypographyCaption", prop: 'as="p"' },
  TypographyProseList: { to: "TypographyList", prop: 'variant="prose"' },
};
const INKS = {
  INK_ON_CARD: "--card-foreground",
  INK_ON_POPOVER: "--popover-foreground",
  INK_ON_SIDEBAR: "--sidebar-foreground",
};
const ACCORDION = ["Accordion", "AccordionItem", "AccordionTrigger", "AccordionContent"];
const TABS = ["Tabs", "TabsList", "TabsTrigger", "TabsContent"];

/** Each removed name, and the module it was imported from. */
const REMOVED = {
  ...Object.fromEntries([...Object.keys(ROLES), ...Object.keys(INKS)].map((n) => [n, PKG])),
  ...Object.fromEntries([...ACCORDION, ...TABS, "DISCLOSURE"].map((n) => [n, BLOCKS])),
};
/** Each name a step writes, and the module it comes from. */
const ADDED = {
  TypographyCaption: PKG,
  TypographyList: PKG,
  inkOnSurfaceStyle: PKG,
  DisclosureGroup: BLOCKS,
  Disclosure: BLOCKS,
  TabGroup: BLOCKS,
};

/* An import of a removed name, found cheaply enough for `doctor` to ask. */
const STALE = new RegExp(
  `import\\s*(?:type\\s*)?\\{[^}]*\\b(?:${Object.keys(REMOVED).join("|")})\\b[^}]*\\}\\s*from\\s*["']@supertype\\.ai/foundations`,
);

function steps(ts) {
  const meaningful = (kids) => kids.filter((k) => !(ts.isJsxText(k) && k.getText().trim() === ""));
  const tagOf = (el) => (ts.isJsxElement(el) ? el.openingElement : el).tagName.getText();
  const attrs = (open) => open.attributes.properties;
  const attr = (open, name) => attrs(open).find((a) => ts.isJsxAttribute(a) && a.name.getText() === name);
  /** Attribute names outside `allowed`, spreads included, or none. */
  const extra = (open, allowed) =>
    attrs(open).filter((a) => !ts.isJsxAttribute(a) || !allowed.includes(a.name.getText())).map((a) => a.getText());
  const inner = (el, src, sf) => src.slice(el.openingElement.getEnd(), el.closingElement.getStart(sf));
  const indentOf = (src, at) => /^[ \t]*/.exec(src.slice(src.lastIndexOf("\n", at - 1) + 1))[0];

  /** The names this file imports from the package under their own name, and any it renamed. */
  const imported = (sf) => {
    const own = new Set();
    const aliased = [];
    for (const st of sf.statements) {
      if (!ts.isImportDeclaration(st) || ![PKG, BLOCKS].includes(st.moduleSpecifier.text)) continue;
      const b = st.importClause?.namedBindings;
      for (const el of b && ts.isNamedImports(b) ? b.elements : []) {
        const from = (el.propertyName ?? el.name).text;
        if (!(from in REMOVED)) continue;
        if (el.propertyName) aliased.push({ el, from });
        else own.add(from);
      }
    }
    return { own, aliased };
  };

  /** A name a step writes is free when nothing binds it, or the package does. */
  const free = (sf, name) => [null, ADDED[name]].includes(bindingOf(ts, sf, name));

  /** Words as a prop value: `"text"`, `{expression}`, or a fragment of what was there. */
  const asProp = (el, src, sf) => {
    const kids = meaningful(el.children);
    if (kids.length === 1 && ts.isJsxText(kids[0]) && !/["{}<>]/.test(kids[0].getText())) return `"${kids[0].getText().trim()}"`;
    if (kids.length === 1 && ts.isJsxExpression(kids[0]) && kids[0].expression) return `{${kids[0].expression.getText(sf)}}`;
    if (kids.length === 1 && (ts.isJsxElement(kids[0]) || ts.isJsxSelfClosingElement(kids[0]))) return `{${kids[0].getText(sf)}}`;
    return `{<>${inner(el, src, sf)}</>}`;
  };
  /** The same words as an expression, for inside an object literal. */
  const asValue = (el, src, sf) => {
    const kids = meaningful(el.children);
    if (kids.length === 1 && ts.isJsxText(kids[0])) return JSON.stringify(kids[0].getText().trim());
    if (kids.length === 1 && ts.isJsxExpression(kids[0]) && kids[0].expression) return kids[0].expression.getText(sf);
    if (kids.length === 1 && (ts.isJsxElement(kids[0]) || ts.isJsxSelfClosingElement(kids[0]))) return kids[0].getText(sf);
    return `<>${inner(el, src, sf)}</>`;
  };
  /** A className the new component has no slot for, kept on a wrapper around what it styled. */
  const wrap = (cls, tag, body) => (cls ? `<${tag} ${cls.getText()}>${body}</${tag}>` : body);

  function roles(src, sf, { where, note }) {
    const { own, aliased } = imported(sf);
    for (const { el, from } of aliased) {
      if (ROLES[from]) note(`${where(el)}  ${from} is imported as ${el.name.text}: rename it by hand to ${ROLES[from].to} ${ROLES[from].prop}`);
    }
    const edits = [];
    const visit = (node) => {
      const open = ts.isJsxElement(node) ? node.openingElement : ts.isJsxSelfClosingElement(node) ? node : null;
      const name = open && ts.isIdentifier(open.tagName) && open.tagName.text;
      const rename = name && own.has(name) && ROLES[name];
      if (rename) {
        edits.push([open.tagName.getStart(sf), open.tagName.getEnd(), `${rename.to} ${rename.prop}`]);
        if (ts.isJsxElement(node)) edits.push([node.closingElement.tagName.getStart(sf), node.closingElement.tagName.getEnd(), rename.to]);
        note(`${where(node)}  ${name} → ${rename.to} ${rename.prop}`, true);
      } else if (ts.isIdentifier(node) && own.has(node.text) && ROLES[node.text] && !ts.isImportSpecifier(node.parent) &&
          !(ts.isJsxOpeningLikeElement(node.parent) || ts.isJsxClosingElement(node.parent))) {
        // `typeof TypographySmall` in a props type: the replacement's props cover the old ones.
        if (ts.isTypeQueryNode(node.parent)) {
          edits.push([node.getStart(sf), node.getEnd(), ROLES[node.text].to]);
          note(`${where(node)}  typeof ${node.text} → typeof ${ROLES[node.text].to}`, true);
        } else {
          note(`${where(node)}  ${node.text} used as a value: replace it with ${ROLES[node.text].to} and pass ${ROLES[node.text].prop} where it renders`);
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
    return edits;
  }

  /**
   * `<Accordion>` becomes `<DisclosureGroup>`, single-open unless it was
   * `multiple`, and an item of one trigger and one content becomes a
   * `<Disclosure title>`. A class on the content stays on a div around it; one on
   * the trigger stays on the title's words, since the row is the disclosure's own.
   * A literal `defaultValue` opens the items it names, as `open`.
   */
  function accordion(src, sf, { where, note }) {
    const { own } = imported(sf);
    if (!ACCORDION.some((n) => own.has(n))) return [];
    for (const n of ["DisclosureGroup", "Disclosure"]) {
      if (!free(sf, n)) {
        note(`${where(sf.statements[0])}  \`${n}\` already names ${bindingOf(ts, sf, n)} here: move the accordion by hand`);
        return [];
      }
    }
    const edits = [];
    // Each accordion's literal `defaultValue`, and the values its own items claimed.
    const opened = new Map();
    const literalValues = (a) => {
      const e = a?.initializer && ts.isJsxExpression(a.initializer) ? a.initializer.expression : null;
      return e && ts.isArrayLiteralExpression(e) && e.elements.every(ts.isStringLiteral) ? e.elements.map((x) => x.text) : null;
    };
    const itemValue = (open) => {
      const v = attr(open, "value")?.initializer;
      return v && ts.isStringLiteral(v) ? v.text : null;
    };
    const visit = (node) => {
      if (!ts.isJsxElement(node)) return ts.forEachChild(node, visit);
      const open = node.openingElement;
      const tag = tagOf(node);
      if (tag === "Accordion" && own.has(tag)) {
        const defaults = attr(open, "defaultValue");
        const values = literalValues(defaults);
        const odd = extra(open, ["className", "tone", "multiple", "key", ...(values ? ["defaultValue"] : [])]);
        const multiple = attr(open, "multiple");
        if (odd.length || (multiple?.initializer && multiple.initializer.getText(sf) !== "{true}")) {
          // Its items stay as they are too: their `value` is what the root's props name.
          note(`${where(node)}  Accordion with ${odd.join(" ") || multiple.getText(sf)}: move it and its items by hand (open state the app keeps is \`open\` and \`onToggle\` on each Disclosure)`);
          return;
        } else {
          edits.push([open.tagName.getStart(sf), open.tagName.getEnd(), multiple ? "DisclosureGroup" : 'DisclosureGroup type="single"']);
          if (multiple) edits.push([multiple.getFullStart(), multiple.getEnd(), ""]);
          edits.push([node.closingElement.tagName.getStart(sf), node.closingElement.tagName.getEnd(), "DisclosureGroup"]);
          if (defaults) {
            edits.push([defaults.getFullStart(), defaults.getEnd(), ""]);
            opened.set(node, { node, values: new Set(values), claimed: new Set() });
          }
          note(`${where(node)}  Accordion → DisclosureGroup`, true);
        }
      } else if (tag === "AccordionItem" && own.has(tag)) {
        const [trigger, content, ...rest] = meaningful(node.children);
        const shaped = ts.isJsxElement(trigger ?? node) && tagOf(trigger) === "AccordionTrigger" &&
          ts.isJsxElement(content ?? node) && tagOf(content) === "AccordionContent" && !rest.length;
        const odd = shaped
          ? [...extra(open, ["key", "value", "className"]), ...extra(trigger.openingElement, ["className"]), ...extra(content.openingElement, ["className"])]
          : [];
        if (!shaped || odd.length) {
          note(`${where(node)}  AccordionItem ${shaped ? `with ${odd.join(" ")}` : "not one trigger and one content"}: move it to a Disclosure by hand`);
          return;
        }
        const group = opened.get(ts.findAncestor(node.parent, (a) => opened.has(a)));
        const value = itemValue(open);
        const isOpen = group && value !== null && group.values.has(value);
        if (isOpen) group.claimed.add(value);
        const kept = [attr(open, "key"), attr(open, "className")].filter(Boolean).map((a) => ` ${a.getText(sf)}`).join("") + (isOpen ? " open" : "");
        const titleClass = attr(trigger.openingElement, "className");
        const title = titleClass ? `{${wrap(titleClass, "span", inner(trigger, src, sf).trim())}}` : asProp(trigger, src, sf);
        const body = wrap(attr(content.openingElement, "className"), "div", inner(content, src, sf));
        edits.push([node.getStart(sf), node.getEnd(), `<Disclosure${kept} title=${title}>${body}</Disclosure>`]);
        note(`${where(node)}  AccordionItem → Disclosure${titleClass ? " (the trigger's classes now style the title's words; the row is Disclosure's)" : ""}`, titleClass ? "check" : true);
        return;
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
    for (const { node, values, claimed } of opened.values()) {
      const lost = [...values].filter((v) => !claimed.has(v));
      if (lost.length) note(`${where(node)}  defaultValue names ${lost.map((v) => `"${v}"`).join(", ")}, an item outside this element: give its Disclosure \`open\` by hand`);
    }
    return edits;
  }

  /* The strip's classes a `size` says instead; any other class is a layout TabGroup does not take. */
  const LIST_SIZE = /^(h-7|h-8|mb-[\d.]+)$/;
  const TRIGGER_SIZE = /^(text-xs|px-2|px-3|gap-1\.5|md:text-sm)$/;
  /* A trigger's classes that set the words rather than the tab; they stay, on the label. */
  const LABEL = /^(tabular-nums|font-mono|uppercase|capitalize)$/;

  /** `{items.map((x) => <Tag …/>)}`: the array, the parameters and the element, or null. */
  const mapped = (child, sf, name) => {
    const call = ts.isJsxExpression(child) ? child.expression : null;
    if (!call || !ts.isCallExpression(call) || !ts.isPropertyAccessExpression(call.expression) || call.expression.name.text !== "map") return null;
    const fn = call.arguments[0];
    if (!fn || !(ts.isArrowFunction(fn) || ts.isFunctionExpression(fn))) return null;
    let body = fn.body;
    if (ts.isBlock(body)) body = body.statements.length === 1 && ts.isReturnStatement(body.statements[0]) ? body.statements[0].expression : null;
    while (body && ts.isParenthesizedExpression(body)) body = body.expression;
    if (!body || !ts.isJsxElement(body) || tagOf(body) !== name) return null;
    return { array: call.expression.expression.getText(sf), params: fn.parameters.map((p) => p.getText(sf)).join(", "), el: body };
  };

  /** `<Tag …/>` or `{cond && <Tag …/>}`: the element and its condition, or null. */
  const guarded = (child, name) => {
    if (ts.isJsxElement(child) && tagOf(child) === name) return { el: child, cond: null };
    const e = ts.isJsxExpression(child) ? child.expression : null;
    if (!e || !ts.isBinaryExpression(e) || e.operatorToken.kind !== ts.SyntaxKind.AmpersandAmpersandToken) return null;
    let right = e.right;
    while (ts.isParenthesizedExpression(right)) right = right.expression;
    return ts.isJsxElement(right) && tagOf(right) === name ? { el: right, cond: e.left.getText() } : null;
  };

  /**
   * `<Tabs>` becomes `<TabGroup>`: its triggers and panels written out, behind a
   * condition, or built with one `.map` each, or triggers alone for a picker. A compact strip's
   * classes become `size="sm"`, and a box around the list and panels goes around
   * the TabGroup instead. Anything else is reported.
   */
  function tabs(src, sf, { where, note }) {
    const { own } = imported(sf);
    if (!own.has("Tabs")) return [];
    if (!free(sf, "TabGroup")) {
      note(`${where(sf.statements[0])}  \`TabGroup\` already names ${bindingOf(ts, sf, "TabGroup")} here: move the tabs by hand`);
      return [];
    }
    const isEl = (n, name) => n && ts.isJsxElement(n) && tagOf(n) === name;
    const classes = (el) => {
      const c = attr(el.openingElement, "className")?.initializer;
      return !c ? [] : ts.isStringLiteral(c) ? c.text.split(/\s+/).filter(Boolean) : null;
    };
    const valueOf = (el) => {
      const v = attr(el.openingElement, "value")?.initializer;
      return v && (ts.isStringLiteral(v) ? v.getText(sf) : v.expression?.getText(sf));
    };

    /** The strip's parts, or the reasons it cannot move. */
    const read = (node) => {
      const odd = extra(node.openingElement, ["defaultValue", "value", "onValueChange", "className", "key", "orientation"]);
      const orientation = attr(node.openingElement, "orientation");
      if (orientation && orientation.initializer?.getText(sf) !== '"horizontal"') odd.push(orientation.getText(sf));
      let kids = meaningful(node.children);
      // A box around the list and panels, which goes around the TabGroup instead.
      const box = kids.length === 1 && ts.isJsxElement(kids[0]) && /^[a-z]/.test(tagOf(kids[0])) ? kids[0] : null;
      if (box) kids = meaningful(box.children);
      let [list, ...panels] = kids;
      // A div holding the strip and nothing else only laid the strip out.
      const holder = list && ts.isJsxElement(list) && /^[a-z]/.test(tagOf(list)) ? meaningful(list.children) : [];
      if (holder.length === 1 && isEl(holder[0], "TabsList") && !extra(list.openingElement, ["className"]).length) list = holder[0];
      if (!isEl(list, "TabsList")) return { odd: [...odd, "no TabsList first"] };
      odd.push(...extra(list.openingElement, ["variant", "tone", "className"]));

      // A set, since every trigger in a strip usually says the same thing.
      const cues = new Set();
      const listClasses = classes(list);
      if (listClasses === null || listClasses.some((c) => !LIST_SIZE.test(c))) odd.push(`TabsList ${attr(list.openingElement, "className").getText(sf)}`);
      let small = listClasses?.includes("h-7") ?? false;
      if (listClasses?.some((c) => c.startsWith("mb-"))) cues.add("the strip's bottom margin is now TabGroup's pt-2 above the panels");
      const labelClass = new Map();
      const trigger = (el) => {
        odd.push(...extra(el.openingElement, ["value", "key", "className"]));
        const cls = classes(el);
        if (cls === null || cls.some((c) => !TRIGGER_SIZE.test(c) && !LABEL.test(c))) odd.push(`TabsTrigger ${attr(el.openingElement, "className").getText(sf)}`);
        const words = cls?.filter((c) => LABEL.test(c)) ?? [];
        if (words.length) labelClass.set(el, `className="${words.join(" ")}"`);
        if (cls?.includes("md:text-sm")) cues.add("its triggers were text-xs below md, and TabGroup keeps one size");
        else if (cls?.includes("text-xs")) small = true;
      };
      const panel = (el) => odd.push(...extra(el.openingElement, ["value", "key", "className"]));

      const listKids = meaningful(list.children);
      const loop = listKids.length === 1 ? mapped(listKids[0], sf, "TabsTrigger") : null;
      const panelLoop = panels.length === 1 ? mapped(panels[0], sf, "TabsContent") : null;
      const content = (el) => wrap(attr(el.openingElement, "className"), "div", asValue(el, src, sf));
      const label = (el) => (labelClass.has(el) ? `<span ${labelClass.get(el)}>${inner(el, src, sf).trim()}</span>` : asValue(el, src, sf));
      let tabs;
      if (loop) {
        trigger(loop.el);
        if (panels.length && !(panelLoop && panelLoop.array === loop.array && panelLoop.params === loop.params && valueOf(panelLoop.el) === valueOf(loop.el))) {
          odd.push("panels that do not map over the triggers' array");
        } else {
          if (panelLoop) panel(panelLoop.el);
          const body = `value: ${valueOf(loop.el)}, label: ${label(loop.el)}${panelLoop ? `, content: ${content(panelLoop.el)}` : ""}`;
          tabs = `${loop.array}.map((${loop.params}) => ({ ${body} }))`;
        }
      } else {
        // Each trigger and panel, written out or behind a condition: `{cond && <TabsTrigger …/>}`.
        const triggers = listKids.map((t) => guarded(t, "TabsTrigger"));
        const shown = panels.map((p) => guarded(p, "TabsContent"));
        if (triggers.some((t) => !t)) odd.push("a trigger that is not a TabsTrigger");
        if (shown.some((p) => !p)) odd.push("a panel that is not a TabsContent");
        if (!odd.length) {
          triggers.forEach((t) => trigger(t.el));
          shown.forEach((p) => panel(p.el));
          const panelOf = new Map(shown.map((p) => [valueOf(p.el), p]));
          const values = triggers.map((t) => valueOf(t.el));
          if (shown.length && (values.some((v) => !v || !panelOf.has(v)) || panelOf.size !== values.length)) odd.push("triggers and panels that do not pair by value");
          tabs = triggers.map((t) => {
            const p = panelOf.get(valueOf(t.el));
            // A panel behind a condition shows nothing when it is false, as its absence did.
            const body = p ? `, content: ${p.cond ? `${p.cond} && ${content(p.el)}` : content(p.el)}` : "";
            const tab = `{ value: ${valueOf(t.el)}, label: ${label(t.el)}${body} }`;
            return t.cond ? `...(${t.cond} ? [${tab}] : [])` : tab;
          });
        }
      }
      return { odd, box, list, tabs, small, cues, picker: panels.length === 0 };
    };

    const edits = [];
    const visit = (node) => {
      if (!(ts.isJsxElement(node) && tagOf(node) === "Tabs")) return ts.forEachChild(node, visit);
      const strip = read(node);
      if (strip.odd.length) {
        note(`${where(node)}  Tabs with ${strip.odd.join(", ")}: move it to a TabGroup by hand`);
        return;
      }
      const pad = indentOf(src, node.getStart(sf)) + (strip.box ? "  " : "");
      const own = attrs(node.openingElement).filter((a) => a.name.getText() !== "orientation");
      const listAttrs = attrs(strip.list.openingElement).filter((a) => a.name.getText() !== "className");
      const props = [...own, ...listAttrs].map((a) => a.getText(sf));
      if (strip.small) props.push('size="sm"');
      const list = Array.isArray(strip.tabs)
        ? `[\n${strip.tabs.map((t) => `${pad}    ${t},\n`).join("")}${pad}  ]`
        : strip.tabs;
      let text = `<TabGroup\n${props.map((p) => `${pad}  ${p}\n`).join("")}${pad}  tabs={${list}}\n${pad}/>`;
      if (strip.box) {
        const open = strip.box.openingElement.getText(sf);
        text = `${open}\n${pad}${text}\n${pad.slice(2)}</${tagOf(strip.box)}>`;
      }
      edits.push([node.getStart(sf), node.getEnd(), text]);
      const cues = [
        ...(strip.picker ? [] : ["TabGroup sets pt-2 and muted ink on each panel: check the panel"]),
        ...strip.cues,
      ];
      note(`${where(node)}  Tabs → TabGroup${strip.picker ? " (a picker)" : ""}${cues.length ? `: ${cues.join("; ")}` : ""}`, cues.length ? "check" : true);
    };
    visit(sf);
    return edits;
  }

  /** An `INK_ON_*` in a className leaves it, and the element spreads the same ink into `style`. */
  function ink(src, sf, { where, note }) {
    const { own } = imported(sf);
    const names = Object.keys(INKS).filter((n) => own.has(n));
    if (!names.length) return [];
    if (!free(sf, "inkOnSurfaceStyle")) {
      note(`${where(sf.statements[0])}  \`inkOnSurfaceStyle\` already names ${bindingOf(ts, sf, "inkOnSurfaceStyle")} here: move the ink by hand`);
      return [];
    }
    const edits = [];
    const styled = new Set();
    const visit = (node) => {
      if (ts.isIdentifier(node) && names.includes(node.text) && !ts.isImportSpecifier(node.parent)) {
        const cls = ts.findAncestor(node, (a) => ts.isJsxAttribute(a) || ts.isJsxOpeningLikeElement(a) || ts.isFunctionLike(a));
        const element = cls && ts.isJsxAttribute(cls) && cls.name.getText() === "className" ? cls.parent.parent : null;
        const removal = element && inkRemoval(node, cls, src, sf);
        if (!removal || attr(element, "style") || styled.has(element)) {
          note(`${where(node)}  ${node.text} ${removal ? "on an element with a style of its own" : "outside a className"}: spread inkOnSurfaceStyle("${INKS[node.text]}") into its style by hand`);
        } else {
          styled.add(element);
          edits.push(...removal, [element.attributes.getEnd(), element.attributes.getEnd(), ` style={inkOnSurfaceStyle("${INKS[node.text]}")}`]);
          note(`${where(node)}  ${node.text} → style={inkOnSurfaceStyle("${INKS[node.text]}")}`, true);
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
    return edits;
  }

  /** Edits taking an ink constant out of its className: the whole attribute, an argument, or a `${…}`. */
  function inkRemoval(id, cls, src, sf) {
    const parent = id.parent;
    if (ts.isJsxExpression(parent) && parent.parent === cls) return [[cls.getFullStart(), cls.getEnd(), ""]];
    if (ts.isCallExpression(parent) && parent.arguments.includes(id)) {
      const removals = listRemovals([...parent.arguments], (a) => a === id, sf);
      if (removals) return removals;
      return parent === cls.initializer.expression ? [[cls.getFullStart(), cls.getEnd(), ""]] : null;
    }
    if (ts.isTemplateSpan(parent) && src.slice(id.getStart(sf) - 2, id.getStart(sf)) === "${" && src[id.getEnd()] === "}") {
      return [[id.getStart(sf) - 2, id.getEnd() + 1, ""]];
    }
    return null;
  }

  /** The removed names leave the import once nothing uses them; the new ones join it. */
  function imports(src, sf) {
    const used = new Set();
    const visit = (n) => {
      if (ts.isImportDeclaration(n)) return;
      if (ts.isIdentifier(n)) used.add(n.text);
      ts.forEachChild(n, visit);
    };
    visit(sf);
    const edits = [];
    for (const module of [PKG, BLOCKS]) {
      const adds = Object.keys(ADDED).filter((n) => ADDED[n] === module && used.has(n) && bindingOf(ts, sf, n) === null);
      const decls = sf.statements.filter((st) => ts.isImportDeclaration(st) && st.moduleSpecifier.text === module &&
        st.importClause?.namedBindings && ts.isNamedImports(st.importClause.namedBindings));
      // A new name takes a removed one's place, so a rename reads as one in the diff.
      let pending = adds;
      for (const st of decls) {
        const list = [...st.importClause.namedBindings.elements];
        const dropped = list.filter((el) => REMOVED[el.name.text] === module && !el.propertyName && !used.has(el.name.text));
        const swapped = dropped.slice(0, pending.length);
        swapped.forEach((el, i) => edits.push([el.getStart(sf), el.getEnd(), pending[i]]));
        pending = pending.slice(swapped.length);
        const gone = new Set(dropped.slice(swapped.length));
        if (!gone.size) continue;
        const removals = listRemovals(list, (el) => gone.has(el), sf);
        edits.push(...(removals ?? [[st.getFullStart(), st.getEnd(), ""]]));
      }
      if (pending.length) edits.push(...importEdits(ts, src, sf, pending, module));
    }
    return edits;
  }

  return [roles, accordion, tabs, ink, imports];
}

export default {
  version: "0.4.0",
  title: "each second way to do one thing becomes the one way",
  stale: (src) => STALE.test(src),
  run: ({ files, ts, write }) => migrate({ files, ts, write, steps: steps(ts) }),
};
