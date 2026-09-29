import { readFileSync, writeFileSync } from "node:fs";

export const PKG = "@supertype.ai/foundations";

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
 * a move, `note(line)` a thing left for a person. A file no step edits is not
 * written. Returns both lists as `file:line  what` strings.
 */
export function migrate({ files, ts, write, steps }) {
  const moved = [];
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
      const note = (line, done) => (done ? moved : left).push(line);
      const edits = step(src, sf, { where, note });
      if (!edits.length) continue;
      src = apply(src, edits);
      back.push(before(edits));
    }
    if (write && src !== original) writeFileSync(file, src);
  }
  return { moved, left };
}
