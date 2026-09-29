import { readFileSync, writeFileSync } from "node:fs";

export const PKG = "@supertype.ai/foundations";
export const BLOCKS = `${PKG}/blocks`;

/**
 * What every migration shares: edits as [start, end, replacement] against the
 * source they were read from, applied pass by pass, and a report that names
 * lines as the file had them before any pass ran.
 */

export const apply = (src, edits) => {
  let out = src;
  for (const [s, e, r] of [...edits].sort((a, b) => b[0] - a[0] || b[1] - a[1])) out = out.slice(0, s) + r + out.slice(e);
  return out;
};

/** Maps a position in the edited source back to the source the edits were made against. */
const before = (edits) => {
  const sorted = [...edits].sort((a, b) => a[0] - b[0]);
  return (at) => {
    let shift = 0;
    for (const [s, e, r] of sorted) {
      if (at < s + shift) break;
      if (at < s + shift + r.length) return s;
      shift += r.length - (e - s);
    }
    return at - shift;
  };
};

/**
 * Runs `steps` over `files`, each on the source the last left. A step takes
 * (src, sourceFile, { where, note }) and returns edits; `note(line, true)` counts
 * a move, `note(line, "check")` a move a person should look at, and `note(line)`
 * a thing left for a person. A file no step edits is not written. Returns the
 * three lists as `file:line  what` strings.
 */
export function migrate({ files, ts, write, steps }) {
  const moved = [];
  const checks = [];
  const left = [];
  const parse = (file, src) => ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  for (const file of files) {
    const original = readFileSync(file, "utf8");
    const originalSf = parse(file, original);
    const back = [];
    let src = original;
    for (const step of steps) {
      const sf = parse(file, src);
      const where = (n) => {
        const at = back.reduceRight((p, map) => map(p), n.getStart(sf));
        return `${file}:${originalSf.getLineAndCharacterOfPosition(at).line + 1}`;
      };
      const note = (line, done) => {
        if (done === "check") checks.push(line);
        (done ? moved : left).push(line);
      };
      const edits = step(src, sf, { where, note });
      if (!edits.length) continue;
      src = apply(src, edits);
      back.push(before(edits));
    }
    if (write && src !== original) writeFileSync(file, src);
  }
  return { moved, checks, left };
}

/**
 * Edits removing the items `drop` picks from a comma list (call arguments, import
 * specifiers), each with the comma that joined it. An item goes up to the next;
 * a trailing run goes from the last one kept. Null when nothing would be left.
 */
export const listRemovals = (list, drop, sf) => {
  const last = list.findLastIndex((n) => !drop(n));
  if (last === -1) return null;
  const edits = [];
  list.forEach((n, i) => i < last && drop(n) && edits.push([n.getStart(sf), list[i + 1].getStart(sf), ""]));
  if (last < list.length - 1) edits.push([list[last].getEnd(), list.at(-1).getEnd(), ""]);
  return edits;
};

/** What binds `name` at the top of the file: a module, "a declaration", or null. */
export function bindingOf(ts, sf, name) {
  for (const st of sf.statements) {
    if (ts.isImportDeclaration(st)) {
      const clause = st.importClause;
      const bindings = clause?.namedBindings;
      const named = bindings && ts.isNamedImports(bindings) ? bindings.elements.map((e) => e.name.text) : [];
      const whole = [clause?.name?.text, bindings && ts.isNamespaceImport(bindings) ? bindings.name.text : null];
      if ([...named, ...whole].includes(name)) return st.moduleSpecifier.text;
    } else if ((ts.isFunctionDeclaration(st) || ts.isClassDeclaration(st)) && st.name?.text === name) {
      return "a declaration";
    } else if (ts.isVariableStatement(st) && st.declarationList.declarations.some((d) => d.name.getText(sf) === name)) {
      return "a declaration";
    }
  }
  return null;
}

const namedImport = (ts) => (st) =>
  ts.isImportDeclaration(st) && !st.importClause?.isTypeOnly &&
  st.importClause?.namedBindings && ts.isNamedImports(st.importClause.namedBindings);

/**
 * Edits importing `names` from `module`, in the file's own style: into its
 * import from that module when it has one, otherwise after its last import, or
 * after its directives ("use client") when it has none.
 */
export function importEdits(ts, src, sf, names, module) {
  const imports = sf.statements.filter(ts.isImportDeclaration);
  const host = imports.find((st) => namedImport(ts)(st) && st.moduleSpecifier.text === module);
  const have = host ? host.importClause.namedBindings.elements.map((e) => e.name.text) : [];
  const want = names.filter((n) => !have.includes(n));
  if (!want.length) return [];
  if (host) {
    const bindings = host.importClause.namedBindings;
    const first = bindings.elements[0];
    if (!first) return [[bindings.getStart(sf), bindings.getEnd(), `{ ${want.join(", ")} }`]];
    const indent = src.slice(src.lastIndexOf("\n", first.getStart(sf)) + 1, first.getStart(sf));
    const text = /^\s*$/.test(indent) ? want.map((n) => `${n},\n${indent}`).join("") : `${want.join(", ")}, `;
    return [[first.getStart(sf), first.getStart(sf), text]];
  }
  const directives = [];
  for (const st of sf.statements) {
    if (!ts.isExpressionStatement(st) || !ts.isStringLiteral(st.expression)) break;
    directives.push(st);
  }
  const after = imports.at(-1) ?? directives.at(-1);
  // Quotes and semicolons as the file writes them: statements that end in one when it does.
  const q = (imports.at(-1)?.moduleSpecifier ?? directives.at(-1)?.expression)?.getText(sf)[0] ?? '"';
  const sample = sf.statements.find((st) => ts.isImportDeclaration(st) || ts.isExpressionStatement(st) || ts.isVariableStatement(st));
  const semi = !sample || sample.getText(sf).endsWith(";") ? ";" : "";
  const line = `import { ${want.join(", ")} } from ${q}${module}${q}${semi}`;
  return after ? [[after.getEnd(), after.getEnd(), `\n${line}`]] : [[0, 0, `${line}\n\n`]];
}
