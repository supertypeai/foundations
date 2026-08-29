#!/usr/bin/env node
/**
 * The consumer-side CLI: `foundations doctor` and `foundations init`.
 *
 * Everything this package needs from an app fails quietly when it is missing. A
 * missing `@source` line purges every class the package ships, so the
 * components render unstyled. A skipped `theme.css` leaves the marker tones and
 * the accordion keyframes undefined. A font bound with `.className` instead of
 * `.variable` renders one typeface on <html> and another on every utility that
 * asks for a role. None of them throw an error, and all of them are easy enough
 * to check mechanically, which is what this file does.
 *
 *   npx foundations doctor          check this app against the contract
 *   npx foundations init            write the CSS block, print the font binding
 *   npx foundations init --dry-run  show the patch without writing it
 *   npx foundations doctor --cwd ../other-app
 *
 * The checks read what to expect from the installed package instead of
 * hardcoding it: CSS entry points come from `exports` in package.json, font
 * variables from type.css, peer ranges from peerDependencies. That way a rule
 * that changes in the package changes here on the next release.
 */
import { existsSync, lstatSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const PKG_NAME = "@supertype/foundations";

/** The installed copy of this package — where `import.meta.url` already is. */
const pkgRoot = fileURLToPath(new URL("..", import.meta.url));
const pkgJson = JSON.parse(readFileSync(join(pkgRoot, "package.json"), "utf8"));

/* ------------------------------------------------------------------ output */

const color = process.stdout.isTTY && !process.env.NO_COLOR;
const paint = (code, s) => (color ? `\x1b[${code}m${s}\x1b[0m` : s);
const dim = (s) => paint(2, s);
const bold = (s) => paint(1, s);

const LEVELS = {
  ok: { mark: () => paint(32, "✔"), rank: 0 },
  info: { mark: () => dim("·"), rank: 1 },
  warn: { mark: () => paint(33, "!"), rank: 2 },
  error: { mark: () => paint(31, "✖"), rank: 3 },
};

/** One finding. `fix` is the line you can act on without leaving the terminal. */
const finding = (level, title, detail, fix) => ({ level, title, detail, fix });

const report = (sections) => {
  for (const [heading, findings] of sections) {
    if (!findings.length) continue;
    console.log(`\n${bold(heading)}`);
    for (const f of findings) {
      console.log(`  ${LEVELS[f.level].mark()} ${f.title}`);
      if (f.detail) console.log(`    ${dim(f.detail)}`);
      if (f.fix) console.log(`    ${dim("→")} ${f.fix}`);
    }
  }
};

/* ------------------------------------------------------------- small utils */

const read = (file) => {
  try {
    return readFileSync(file, "utf8");
  } catch {
    return null;
  }
};

const readJson = (file) => {
  const raw = read(file);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

/** Files under `dir` with one of `exts`, depth-limited and blind to build output. */
const walk = (dir, exts, depth = 4, out = []) => {
  if (depth < 0 || !existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, exts, depth - 1, out);
    else if (exts.some((ext) => entry.name.endsWith(ext))) out.push(full);
  }
  return out;
};

/** Leading numeric triple of a version or a range: ">=19" and "^19.1.0" both give 19.0.0. */
const versionParts = (spec) => {
  const m = /(\d+)(?:\.(\d+))?(?:\.(\d+))?/.exec(spec ?? "");
  return m ? [Number(m[1]), Number(m[2] ?? 0), Number(m[3] ?? 0)] : null;
};

const satisfiesMin = (installed, range) => {
  const have = versionParts(installed);
  const want = versionParts(range);
  if (!have || !want) return true; // Unparseable: not our place to fail the run.
  for (let i = 0; i < 3; i += 1) {
    if (have[i] > want[i]) return true;
    if (have[i] < want[i]) return false;
  }
  return true;
};

/** Nearest ancestor of `from` holding a package.json — the consumer's root. */
const findAppRoot = (from) => {
  let dir = resolve(from);
  for (;;) {
    if (existsSync(join(dir, "package.json"))) return dir;
    const up = dirname(dir);
    if (up === dir) return null;
    dir = up;
  }
};

/* -------------------------------------------------- what the package wants */

/**
 * The CSS entry points, in the order they have to be imported: tokens, then
 * theme, then type. `exports` is already in that order, which is also the order
 * the README documents.
 */
const cssEntries = Object.keys(pkgJson.exports)
  .filter((key) => key.endsWith(".css"))
  .map((key) => `${PKG_NAME}/${key.slice(2)}`);

/** Only needed if the app renders code fences. */
const OPTIONAL_CSS = new Set([`${PKG_NAME}/shiki.css`]);
/** Optional in the sense that it imports fine without it, and quietly lossy. */
const SOFT_CSS = new Set([`${PKG_NAME}/theme.css`]);

/**
 * The font variables the app has to supply. In type.css, a `var(--font-x,
 * fallback)` is a typeface the package expects from next/font; a
 * `var(--font-sans)` with no fallback is a role the package defines itself.
 */
const fontVars = (() => {
  const css = read(join(pkgRoot, "src/type.css")) ?? "";
  const found = new Set();
  for (const [, name, tail] of css.matchAll(/var\(\s*(--font-[\w-]+)\s*(,[^)]*)?\)/g)) {
    if (tail) found.add(name);
  }
  // `--font-average` only carries the `.editorial` heading role.
  return [...found].map((name) => ({ name, editorialOnly: name.includes("average") }));
})();

/* -------------------------------------------------------- consumer probing */

/** The CSS file that starts the cascade, i.e. the one importing Tailwind. */
const findCssEntry = (appRoot) => {
  const roots = ["app", "src", "styles"].map((d) => join(appRoot, d));
  const files = roots.flatMap((dir) => walk(dir, [".css"]));
  return files.find((file) => /@import\s+["']tailwindcss["']/.test(read(file) ?? "")) ?? null;
};

const LAYOUTS = ["app/layout.tsx", "src/app/layout.tsx", "app/layout.jsx", "src/app/layout.jsx"];
const findLayout = (appRoot) => LAYOUTS.map((rel) => join(appRoot, rel)).find((f) => existsSync(f)) ?? null;

/**
 * CSS with its comments removed. The checks below ask whether a directive is
 * present, and a commented-out import or a mention of `@custom-variant` in a
 * comment is neither present nor a mistake. Without this, the doctor warns
 * about the comment explaining why it should not warn.
 */
const stripComments = (css) => {
  let out = "";
  let quote = null;
  for (let i = 0; i < css.length; ) {
    const c = css[i];
    if (quote) {
      // Inside a string, `/**/` is part of a glob rather than an empty comment.
      if (c === "\\") {
        out += c + (css[i + 1] ?? "");
        i += 2;
        continue;
      }
      if (c === quote) quote = null;
      out += c;
      i += 1;
    } else if (c === '"' || c === "'") {
      quote = c;
      out += c;
      i += 1;
    } else if (c === "/" && css[i + 1] === "*") {
      const end = css.indexOf("*/", i + 2);
      i = end === -1 ? css.length : end + 2;
    } else {
      out += c;
      i += 1;
    }
  }
  return out;
};

/** `@import` targets in source order, so one parse gives presence and ordering. */
const importsOf = (css) => [...css.matchAll(/@import\s+["']([^"']+)["']/g)].map((m) => m[1]);

const sourceDirectives = (css) => [...css.matchAll(/@source\s+["']([^"']+)["']/g)].map((m) => m[1]);

/** Consts assigned from a next/font call, so we can check how they are used. */
const fontConsts = (src) => {
  const fns = new Set();
  for (const [, names] of src.matchAll(/import\s*\{([^}]+)\}\s*from\s*["']next\/font\/[^"']+["']/g)) {
    for (const part of names.split(",")) fns.add(part.trim().split(/\s+as\s+/).pop());
  }
  for (const [, name] of src.matchAll(/import\s+(\w+)\s+from\s*["']next\/font\/local["']/g)) fns.add(name);

  const consts = [];
  for (const [, name, fn] of src.matchAll(/const\s+(\w+)\s*=\s*(\w+)\s*\(/g)) {
    if (fns.has(fn)) consts.push(name);
  }
  return consts;
};

/* ---------------------------------------------------------- the @source line */

/** The @source line for this app, relative to the CSS file wherever yarn put us. */
const sourceGlob = (appRoot, cssFile) => {
  const installed = join(appRoot, "node_modules", ...PKG_NAME.split("/"));
  let path = relative(dirname(cssFile), join(installed, "dist"));
  path = path.split(sep).join("/");
  if (!path.startsWith(".")) path = `./${path}`;
  return `${path}/**/*.js`;
};

/* -------------------------------------------------------------- the checks */

const checkInstall = (appRoot) => {
  const out = [];
  const appPkg = readJson(join(appRoot, "package.json"));
  const installed = join(appRoot, "node_modules", ...PKG_NAME.split("/"));

  const spec = appPkg?.dependencies?.[PKG_NAME] ?? appPkg?.devDependencies?.[PKG_NAME] ?? null;

  if (!spec) {
    out.push(
      finding(
        "error",
        `${PKG_NAME} is not a dependency of this app`,
        `checked ${join(appRoot, "package.json")}`,
        `yarn add "${PKG_NAME}@https://github.com/supertypeai/foundations.git#v${pkgJson.version}"`,
      ),
    );
  } else if (/#main\b/.test(spec) || !spec.includes("#")) {
    out.push(
      finding(
        "warn",
        "the dependency is not pinned to a tag",
        spec,
        `pin it: ...foundations.git#v${pkgJson.version}. An unpinned git dependency re-resolves to a different commit on any fresh install.`,
      ),
    );
  } else {
    const tag = versionParts(spec.split("#").pop());
    const here = versionParts(pkgJson.version);
    if (tag && here && tag.join(".") !== here.join(".")) {
      out.push(
        finding(
          "warn",
          "the installed copy does not match the pinned tag",
          `package.json asks for v${tag.join(".")}, node_modules holds ${pkgJson.version}`,
          "Expected after a `yarn sync`, and fine while you iterate. Run `yarn install` to restore the tag before you ship.",
        ),
      );
    } else {
      out.push(finding("ok", `${PKG_NAME}@${pkgJson.version}`, spec));
    }
  }

  if (existsSync(installed)) {
    if (lstatSync(installed).isSymbolicLink()) {
      out.push(
        finding(
          "error",
          "the installed package is a symlink",
          "yarn link, or a linked workspace",
          "Unlink it and install the tag. Turbopack resolves the symlink to a path outside the project root and fails on the CSS import, and you end up with two copies of React, which shows up as an invalid hook call.",
        ),
      );
    }
    if (!existsSync(join(installed, "dist/index.js"))) {
      out.push(
        finding("error", "the installed copy has no dist/", "dist/index.js is missing", "Reinstall. The package ships built, so there is no compile step that could have failed."),
      );
    }
    if (existsSync(join(installed, "node_modules/react"))) {
      out.push(
        finding(
          "error",
          "a second React is nested inside the package",
          join(installed, "node_modules/react"),
          "Dedupe it. React is a peer dependency here, and two copies show up as an invalid hook call at runtime.",
        ),
      );
    }
  }

  for (const [peer, range] of Object.entries(pkgJson.peerDependencies ?? {})) {
    const soft = peer === "@base-ui/react"; // Only Accordion and Tabs need it.
    const meta = readJson(join(appRoot, "node_modules", ...peer.split("/"), "package.json"));
    if (!meta) {
      out.push(
        finding(
          soft ? "warn" : "error",
          `${peer} is not installed`,
          `peer range ${range}`,
          soft ? "Only Accordion and Tabs need it. Install it before you import either." : `yarn add ${peer}`,
        ),
      );
    } else if (!satisfiesMin(meta.version, range)) {
      out.push(finding("error", `${peer}@${meta.version} is below the peer range`, `wants ${range}`, `yarn add ${peer}@latest`));
    }
  }
  return out;
};

const checkStyles = (appRoot) => {
  const out = [];
  const cssFile = findCssEntry(appRoot);
  if (!cssFile) {
    out.push(
      finding("error", "no CSS entry importing tailwindcss", "looked under app/, src/, styles/", "Create one (app/global.css), then run `foundations init`."),
    );
    return out;
  }

  const css = stripComments(read(cssFile) ?? "");
  const rel = relative(appRoot, cssFile);
  const order = importsOf(css);
  const seen = new Map(order.map((spec, i) => [spec, i]));

  const missing = [];
  let last = seen.get("tailwindcss") ?? -1;
  for (const entry of cssEntries) {
    const at = seen.get(entry);
    if (at === undefined) {
      missing.push(entry);
      continue;
    }
    if (at < last) {
      out.push(
        finding(
          "error",
          `${entry} is imported out of order`,
          rel,
          `The order is ${["tailwindcss", ...cssEntries].join(" → ")}. Later files re-point variables the earlier ones define.`,
        ),
      );
    }
    last = at;
  }

  for (const entry of missing) {
    if (OPTIONAL_CSS.has(entry)) {
      out.push(finding("info", `${entry} is not imported`, "only needed if you render code fences", "Add it when you add Shiki."));
    } else if (SOFT_CSS.has(entry)) {
      out.push(
        finding(
          "warn",
          `${entry} is not imported`,
          rel,
          'It is the only file that defines --secondary-ink, --subtle-foreground, the four marker tones and the accordion keyframes. Without it, TypographyHighlight, TypographyLink tone="secondary" and Accordion all render wrong with no error.',
        ),
      );
    } else {
      out.push(finding("error", `${entry} is not imported`, rel, `Add @import "${entry}"; to ${rel}, in order.`));
    }
  }

  const ours = sourceDirectives(css).find((s) => s.includes(PKG_NAME));
  if (!ours) {
    out.push(
      finding(
        "error",
        "no @source line for the package",
        rel,
        "Tailwind does not scan node_modules by default, so without this line every class the package ships is purged and the components render with no styles.",
      ),
    );
  } else if (!existsSync(resolve(dirname(cssFile), ours.split("*")[0]))) {
    out.push(finding("error", "the @source path does not resolve", `${ours} — from ${rel}`, `expected ${sourceGlob(appRoot, cssFile)}`));
  } else {
    out.push(finding("ok", "@source scans the package", ours));
  }

  if (/@custom-variant\s+dark/.test(css)) {
    out.push(
      finding(
        "warn",
        "this app declares its own dark variant",
        rel,
        "tokens.css already binds dark: to the .dark class. With two declarations the later one wins, and nothing tells you which.",
      ),
    );
  }

  const required = missing.filter((entry) => !OPTIONAL_CSS.has(entry) && !SOFT_CSS.has(entry));
  if (!required.length && ours) out.push(finding("ok", "the style layer is complete", rel));
  return out;
};

const checkFonts = (appRoot) => {
  const out = [];
  const layout = findLayout(appRoot);
  if (!layout) {
    out.push(
      finding("warn", "no app/layout.tsx found", `looked for ${LAYOUTS.join(", ")}`, "The roles are bound wherever your root <html> lives. Check that file by hand."),
    );
    return out;
  }

  const src = read(layout) ?? "";
  const rel = relative(appRoot, layout);
  const editorial = ["app", "src"]
    .flatMap((dir) => walk(join(appRoot, dir), [".tsx", ".jsx", ".mdx"]))
    .some((file) => /\beditorial\b/.test(read(file) ?? ""));

  for (const { name, editorialOnly } of fontVars) {
    if (src.includes(name)) continue;
    out.push(
      finding(
        editorialOnly && !editorial ? "info" : "error",
        `${name} is not bound`,
        rel,
        editorialOnly
          ? "The .editorial heading face. Bind it when a surface goes editorial."
          : `Load the typeface with next/font and pass variable: "${name}".`,
      ),
    );
  }

  const consts = fontConsts(src);
  const misbound = consts.filter((name) => new RegExp(`\\b${name}\\.className\\b`).test(src));
  if (misbound.length) {
    out.push(
      finding(
        "error",
        `bound with .className: ${misbound.join(", ")}`,
        rel,
        "Use .variable. A className sets font-family on the element itself and leaves the roles unresolved, so the page renders one typeface while every font-sans and font-heading utility renders another.",
      ),
    );
  } else if (consts.length) {
    out.push(finding("ok", `${consts.length} font${consts.length > 1 ? "s" : ""} bound with .variable`, rel));
  }

  return out;
};

/* ---------------------------------------------------------------- commands */

const fontSnippet = () => `import { Ubuntu_Sans, Ubuntu_Sans_Mono, Average } from "next/font/google";

const sans = Ubuntu_Sans({ variable: "--font-ubuntu-sans", subsets: ["latin"] });
const mono = Ubuntu_Sans_Mono({ variable: "--font-ubuntu-sans-mono", subsets: ["latin"] });
const serif = Average({ variable: "--font-average", weight: "400", subsets: ["latin"] });

// .variable, never .className
<html className={\`\${sans.variable} \${mono.variable} \${serif.variable} font-sans\`}>`;

const doctor = (appRoot) => {
  const install = checkInstall(appRoot);
  const styles = checkStyles(appRoot);
  const fonts = checkFonts(appRoot);
  const all = [...install, ...styles, ...fonts];

  console.log(`\n${bold(PKG_NAME)} ${dim(`doctor · ${appRoot}`)}`);
  report([
    ["Install", install],
    ["Styles", styles],
    ["Fonts", fonts],
  ]);

  const errors = all.filter((f) => f.level === "error").length;
  const warnings = all.filter((f) => f.level === "warn").length;
  const tally = [
    errors ? `${errors} problem${errors > 1 ? "s" : ""}` : null,
    warnings ? `${warnings} warning${warnings > 1 ? "s" : ""}` : null,
  ].filter(Boolean);

  console.log(`\n${tally.length ? tally.join(", ") : "no problems"}${errors ? dim(". Run `foundations init` to write the CSS block.") : ""}\n`);
  return errors ? 1 : 0;
};

const init = (appRoot, { dryRun }) => {
  const cssFile = findCssEntry(appRoot);
  if (!cssFile) {
    console.log(`\nNo CSS entry importing tailwindcss under ${appRoot}.`);
    console.log("Create app/global.css with:\n");
    console.log(
      ['@import "tailwindcss";', ...cssEntries.map((e) => `@import "${e}";`), "", `@source '../node_modules/${PKG_NAME}/dist/**/*.js';`].join("\n"),
    );
    console.log();
    return 1;
  }

  const before = read(cssFile) ?? "";
  const live = stripComments(before);
  const rel = relative(appRoot, cssFile);
  const lines = before.split("\n");

  // Lift the package's own @import lines out, then lay them back down in the
  // one order the cascade accepts. Lifting the whole LINE keeps a trailing
  // comment attached to the import a consumer wrote it against, and makes a
  // file that is merely out of order repairable rather than only diagnosable.
  const existing = new Map();
  const present = new Set(importsOf(live));
  const kept = lines.filter((line) => {
    const [spec] = importsOf(stripComments(line));
    // `present` keeps a commented-out import where it is instead of reviving it.
    if (spec && cssEntries.includes(spec) && present.has(spec)) {
      existing.set(spec, line);
      return false;
    }
    return true;
  });

  const block = cssEntries
    .filter((entry) => existing.has(entry) || !OPTIONAL_CSS.has(entry))
    .map((entry) => existing.get(entry) ?? `@import "${entry}";`);

  // By spec, not by string: a commented-out import contains the same text.
  const added = block.filter((line) => {
    const [spec] = importsOf(line);
    return spec && !present.has(spec);
  });
  const reordered = !added.length && block.join("\n") !== [...existing.values()].join("\n");
  const needsSource = !sourceDirectives(live).some((s) => s.includes(PKG_NAME));
  if (needsSource) block.push("", `@source '${sourceGlob(appRoot, cssFile)}';`);

  if (!added.length && !reordered && !needsSource) {
    console.log(`\n${rel} already imports the style layer, in order, and scans the package.`);
  } else {
    // After Tailwind itself: the tokens re-point variables it defines.
    const anchor = kept.reduce((at, line, i) => (/@import\s+["']tailwindcss["']/.test(line) ? i : at), -1);
    kept.splice(anchor + 1, 0, ...block);

    if (dryRun) {
      console.log(`\n${bold(rel)} ${dim("(dry run — nothing written)")}`);
    } else {
      writeFileSync(cssFile, kept.join("\n"));
      console.log(`\n${paint(32, "✔")} patched ${bold(rel)}`);
    }
    for (const line of block.filter(Boolean)) {
      const mark = added.includes(line) || (needsSource && line.startsWith("@source")) ? paint(32, "+") : dim(" ");
      console.log(`  ${mark} ${line}`);
    }
    if (reordered) console.log(`  ${dim("reordered: later files re-point variables the earlier ones define")}`);
  }

  console.log(`\n${bold("Bind the fonts")} in your root layout. The package cannot load them for you:\n`);
  console.log(fontSnippet());

  // The package ships an llms.txt for whatever coding agent the app runs. It is
  // only useful if the agent is pointed at it, and that is one line in a file
  // this command should not edit on its own.
  console.log(`\n${bold("If you use a coding agent")}, point it at the API summary:\n`);
  console.log(`  ${dim("# CLAUDE.md, AGENTS.md, or your agent's equivalent")}`);
  console.log(`  @node_modules/${PKG_NAME}/llms.txt`);

  console.log(`\nThen: ${bold("foundations doctor")}\n`);
  return 0;
};

const usage = () => {
  console.log(`
${bold(PKG_NAME)} ${dim(`v${pkgJson.version}`)}

  ${bold("foundations doctor")}    check this app against the package's contract
  ${bold("foundations init")}      add and reorder the CSS imports, print the rest

Options
  --cwd <dir>    run against another app instead of the current directory
  --dry-run      init only: show the patch without writing it
`);
};

/* ------------------------------------------------------------------- entry */

const args = process.argv.slice(2);
const command = args.find((a) => !a.startsWith("--")) ?? "help";
const flag = (name) => args.includes(`--${name}`);
const value = (name) => {
  const at = args.indexOf(`--${name}`);
  return at === -1 ? null : args[at + 1];
};

if (command === "help" || flag("help")) {
  usage();
  process.exit(0);
}

const appRoot = findAppRoot(value("cwd") ?? process.cwd());
if (!appRoot) {
  console.error("No package.json found. Run this from inside your app.");
  process.exit(1);
}
if (resolve(appRoot) === resolve(pkgRoot)) {
  console.error(`This is ${PKG_NAME} itself. Run the CLI from an app that uses it, or pass --cwd.`);
  process.exit(1);
}

switch (command) {
  case "doctor":
    process.exit(doctor(appRoot));
  case "init":
    process.exit(init(appRoot, { dryRun: flag("dry-run") }));
  default:
    console.error(`unknown command: ${command}`);
    usage();
    process.exit(1);
}
