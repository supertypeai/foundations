import { PKG, migrate } from "./source.mjs";

/**
 * 0.4: two roles that only pinned a prop are gone, and the prop says it instead.
 * Only a name imported from the package is renamed, so an app's own component
 * of the same name is left alone.
 */
const RENAMED = {
  TypographySmall: { to: "TypographyCaption", prop: 'as="p"' },
  TypographyProseList: { to: "TypographyList", prop: 'variant="prose"' },
};

const STALE = new RegExp(`\\b(${Object.keys(RENAMED).join("|")})\\b`);

/** One pass: the import and every element, per renamed name the file imports. */
const step = (ts) => (src, sf, { where, note }) => {
  const edits = [];
  const imports = sf.statements.filter(
    (st) => ts.isImportDeclaration(st) && st.moduleSpecifier.text === PKG &&
      st.importClause?.namedBindings && ts.isNamedImports(st.importClause.namedBindings),
  );
  const specifiers = imports.flatMap((st) => st.importClause.namedBindings.elements.map((el) => ({ st, el })));
  const bound = new Set(specifiers.map(({ el }) => el.name.text));

  const renamed = new Map();
  for (const { st, el } of specifiers) {
    const from = (el.propertyName ?? el.name).text;
    const rename = RENAMED[from];
    if (!rename) continue;
    if (el.propertyName) {
      note(`${where(el)}  ${from} is imported as ${el.name.text}: rename it by hand to ${rename.to} ${rename.prop}`);
      continue;
    }
    renamed.set(from, rename);
    const list = st.importClause.namedBindings.elements;
    if (!bound.has(rename.to)) {
      edits.push([el.getStart(sf), el.getEnd(), rename.to]);
      bound.add(rename.to);
    } else if (list.length === 1) {
      edits.push([st.getFullStart(), st.getEnd(), ""]);
    } else {
      // The name is already imported: the specifier goes, with the comma that joined it.
      const i = list.indexOf(el);
      edits.push(i < list.length - 1 ? [el.getStart(sf), list[i + 1].getStart(sf), ""] : [list[i - 1].getEnd(), el.getEnd(), ""]);
    }
  }
  if (!renamed.size) return edits;

  const visit = (node) => {
    const open = ts.isJsxElement(node) ? node.openingElement : ts.isJsxSelfClosingElement(node) ? node : null;
    const rename = open && ts.isIdentifier(open.tagName) && renamed.get(open.tagName.text);
    if (rename) {
      edits.push([open.tagName.getStart(sf), open.tagName.getEnd(), `${rename.to} ${rename.prop}`]);
      if (ts.isJsxElement(node)) edits.push([node.closingElement.tagName.getStart(sf), node.closingElement.tagName.getEnd(), rename.to]);
      note(`${where(node)}  ${open.tagName.text} → ${rename.to} ${rename.prop}`, true);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return edits;
};

export default {
  version: "0.4.0",
  title: "`TypographySmall` and `TypographyProseList` are the props they pinned",
  stale: (src) => STALE.test(src),
  run: ({ files, ts, write }) => migrate({ files, ts, write, steps: [step(ts)] }),
};
