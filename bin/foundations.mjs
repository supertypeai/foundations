#!/usr/bin/env node
/**
 * The consumer-side CLI: `foundations doctor` and `foundations init`.
 *
 * Everything this package needs from an app fails quietly when it is missing. A
 * missing `@source` line purges every class the package ships, so the
 * components render unstyled. A skipped `theme.css` leaves every colour role
 * unpainted, so `bg-background` resolves to nothing. A font bound with
 * `.className` instead of
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
import { basename, dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const PKG_NAME = "@supertype.ai/foundations";

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

/**
 * Directories that never hold an app's own source: dependencies, and the build
 * output that mirrors it. Walking from the app root rather than a list of
 * blessed directories means these have to be named, but naming what is not
 * source is a much shorter and much more stable list than guessing what is.
 */
const NOT_SOURCE = new Set(["node_modules", "dist", "build", "out", "coverage", "public", "vendor", "target"]);

/** Files under `dir` with one of `exts`, depth-limited and blind to build output. */
const walk = (dir, exts, depth = 4, out = []) => {
  if (depth < 0 || !existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || NOT_SOURCE.has(entry.name)) continue;
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

/**
 * `name` as Node would resolve it from `dir`: the first `node_modules` on the
 * way up that actually holds it. A workspace hoists dependencies to the repo
 * root, so the copy an app runs against is routinely nowhere near its own
 * package.json, and assuming otherwise is how a check ends up reporting a
 * missing peer that is installed and an `@source` path that points at nothing.
 */
const resolveDep = (dir, name) => {
  const segments = name.split("/");
  let at = resolve(dir);
  for (;;) {
    const candidate = join(at, "node_modules", ...segments);
    if (existsSync(candidate)) return candidate;
    const up = dirname(at);
    if (up === at) return null;
    at = up;
  }
};

/**
 * The installed Tailwind's major version, or null when it is not installed yet
 * — which is the normal case for `npx … init` run before the first install, and
 * not something to fail on.
 *
 * This is read from the installed package rather than inferred from which
 * directives the app's CSS uses, because the two questions are genuinely
 * separate: `@tailwind utilities;` is still legal in v4, and a v3 app being
 * upgraded passes through states where its CSS and its lockfile disagree.
 */
const tailwindMajor = (appRoot) => {
  const at = resolveDep(appRoot, "tailwindcss");
  const meta = at ? readJson(join(at, "package.json")) : null;
  return meta ? (versionParts(meta.version)?.[0] ?? null) : null;
};

/**
 * The dialect a stylesheet is written in, for when the installed copy cannot
 * answer — an app running `npx … init` before its first install. v4 imports the
 * framework; v3 uses `@tailwind base`/`components`, which v4 removed.
 * `@tailwind utilities` is deliberately not listed: it is still legal in v4, so
 * it is not evidence of anything.
 */
const dialectOf = (css) => {
  if (/@import\s+["']tailwindcss(?:\/[\w./-]+)?["']/.test(css)) return 4;
  if (/@tailwind\s+(?:base|components)\b/.test(css)) return 3;
  return null;
};

/**
 * Which Tailwind this app is on, best evidence first: the installed copy, then
 * the dialect of its entry stylesheet. Null when neither can say, which is a
 * normal state and not a failure — a fresh app has no CSS and no install yet.
 */
const tailwindOf = (appRoot, cssFile) =>
  tailwindMajor(appRoot) ?? (cssFile ? dialectOf(stripComments(read(cssFile) ?? "")) : null);

/** Everything the style layer does is v4 syntax, so this is the one way out. */
const TAILWIND_UPGRADE =
  "Upgrade first: `npx @tailwindcss/upgrade` — https://tailwindcss.com/docs/upgrade-guide";

/** Why v4 is not negotiable, said the same way wherever it comes up. */
const TAILWIND_WHY =
  "tokens.css declares @custom-variant and @theme inline, and the @source line is v4-only syntax.";

/* -------------------------------------------------- what the package wants */

/**
 * The one import that carries the whole style layer. index.css registers the
 * package's own `@source` and imports its own files in the one order the
 * cascade accepts, so an app taking this single line cannot get the order, the
 * path, or the completeness wrong — there is nothing left for it to get wrong.
 */
const BUNDLE = PKG_NAME;

/** Either spelling: the bare specifier, or the file named outright. */
const isBundle = (spec) => spec === PKG_NAME || spec === `${PKG_NAME}/index.css`;

/**
 * The granular entry points, in the order they have to be imported: tokens,
 * then theme, then type. `exports` is already in that order, which is also the
 * order the README documented before the bundle existed.
 *
 * They remain exported, and remain supported, for the app that paints every
 * colour role itself and wants tokens.css without theme.css. index.css is not
 * one of them: it is the whole, not a part.
 */
const cssEntries = Object.keys(pkgJson.exports)
  .filter((key) => key.endsWith(".css") && key !== "./index.css")
  .map((key) => `${PKG_NAME}/${key.slice(2)}`);

/** Only needed if the app renders code fences. */
const OPTIONAL_CSS = new Set([`${PKG_NAME}/shiki.css`]);

/**
 * Skippable only by an app that paints the roles itself. tokens.css registers
 * them and theme.css is the palette; with neither, every colour utility
 * generates and resolves to nothing.
 */
const PALETTE_CSS = `${PKG_NAME}/theme.css`;

/** The roles tokens.css registers, which something has to give a value to. */
const roles = (() => {
  const css = read(join(pkgRoot, "src/tokens.css")) ?? "";
  return [...css.matchAll(/--color-[a-z0-9-]+:\s*var\((--[a-z0-9-]+)\)/gi)].map((m) => m[1]);
})();

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

/** What Tailwind is processed from. v4 drops the preprocessors; v3 apps use them. */
const STYLE_EXTS = [".css", ".pcss", ".postcss", ".scss"];

/**
 * A file that starts a Tailwind cascade, in either dialect: v4 pulls the
 * framework in with `@import` (including the layered form, where the three
 * layers are imported separately), v3 with `@tailwind`. Both name the same
 * file — the one the app's styles begin at — so finding it does not depend on
 * which version is installed, and must not, or an app on the wrong version
 * gets told it has no stylesheet at all.
 */
const TAILWIND_ENTRY =
  /@import\s+["']tailwindcss(?:\/[\w./-]+)?["']|@tailwind\s+(?:base|components|utilities)\b/;

/** Conventional entry names, best first. Only ever used to break a tie. */
const ENTRY_NAMES = ["globals", "global", "index", "main", "app", "styles", "tailwind"];

/**
 * The CSS file that starts the cascade. Searched from the app root rather than
 * a list of blessed directories, because `app/`, `src/` and `styles/` are three
 * of the places it lives and not the only three.
 *
 * More than one file can import Tailwind — an embed, a Storybook preview, an
 * email template. The real entry is the shallowest, and among equals the one
 * named the way the scaffolds name it.
 */
const findCssEntry = (appRoot) => {
  const candidates = walk(appRoot, STYLE_EXTS, 6).filter((file) =>
    TAILWIND_ENTRY.test(stripComments(read(file) ?? "")),
  );
  const rank = (file) => {
    const rel = relative(appRoot, file);
    const at = ENTRY_NAMES.indexOf(basename(rel).replace(/\.[^.]+$/, ""));
    return [rel.split(sep).length, at === -1 ? ENTRY_NAMES.length : at, rel];
  };
  return (
    candidates
      .map((file) => [rank(file), file])
      .sort(([a], [b]) => (a[0] - b[0]) || (a[1] - b[1]) || (a[2] < b[2] ? -1 : 1))
      .map(([, file]) => file)[0] ?? null
  );
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

/**
 * An import of the framework itself. v4's layered form names three files rather
 * than one, and the block has to land after the last of them, so anywhere the
 * code asks "is this Tailwind coming in here" has to accept both spellings.
 */
const isTailwindImport = (spec) => spec === "tailwindcss" || spec.startsWith("tailwindcss/");

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
  // Where it actually is, which in a workspace is the repo root rather than
  // this app. The conventional path is the fallback for an app that has not
  // installed the package yet, where there is nothing to resolve.
  const installed =
    resolveDep(appRoot, PKG_NAME) ?? join(appRoot, "node_modules", ...PKG_NAME.split("/"));
  let path = relative(dirname(cssFile), join(installed, "dist"));
  path = path.split(sep).join("/");
  if (!path.startsWith(".")) path = `./${path}`;
  return `${path}/**/*.js`;
};

/* -------------------------------------------------------------- the checks */

/**
 * A git dependency, as opposed to a registry range. Only the former can move
 * under a consumer: `#main` and untagged specs re-resolve on a fresh install,
 * while `^0.1.23` is pinned by the lockfile. The check below only has something
 * to say about the first kind.
 */
const isGitSpec = (spec) =>
  /^(git\+|git:|git@)/.test(spec) || /github\.com|gitlab\.com|bitbucket\.org/.test(spec);

const checkInstall = (appRoot) => {
  const out = [];
  const appPkg = readJson(join(appRoot, "package.json"));
  const installed = resolveDep(appRoot, PKG_NAME);

  const spec = appPkg?.dependencies?.[PKG_NAME] ?? appPkg?.devDependencies?.[PKG_NAME] ?? null;

  if (!spec) {
    out.push(
      finding(
        "error",
        `${PKG_NAME} is not a dependency of this app`,
        `checked ${join(appRoot, "package.json")}`,
        `yarn add ${PKG_NAME}`,
      ),
    );
  } else if (!isGitSpec(spec)) {
    // A registry range is resolved once and recorded in the lockfile, so it
    // does not have the re-resolution problem a git spec has. Nothing to say.
    out.push(finding("ok", `${PKG_NAME}@${pkgJson.version}`, spec));
  } else if (/#main\b/.test(spec) || !spec.includes("#")) {
    out.push(
      finding(
        "warn",
        "the dependency is not pinned to a tag",
        spec,
        `pin it: ...foundations.git#v${pkgJson.version}, or install from the registry: yarn add ${PKG_NAME}. An unpinned git dependency re-resolves to a different commit on any fresh install.`,
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

  if (installed) {
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
    const at = resolveDep(appRoot, peer);
    const meta = at ? readJson(join(at, "package.json")) : null;
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

const checkStyles = (appRoot, major) => {
  const out = [];
  const cssFile = findCssEntry(appRoot);
  if (!cssFile) {
    out.push(
      finding(
        "error",
        "no CSS entry importing Tailwind",
        `looked for a ${STYLE_EXTS.join(", ")} file under ${appRoot}`,
        "Create one (app/globals.css), then run `foundations init`.",
      ),
    );
    return out;
  }

  const css = stripComments(read(cssFile) ?? "");
  const rel = relative(appRoot, cssFile);

  // Every check below reads a v4 cascade. Running them against a v3 stylesheet
  // reports four separate failures that are all one cause, and buries it.
  if (major !== null && major < 4) {
    out.push(
      finding(
        "error",
        `${rel} is a Tailwind v${major} stylesheet, and the package needs v4`,
        TAILWIND_WHY,
        TAILWIND_UPGRADE,
      ),
    );
    return out;
  }
  const order = importsOf(css);
  const tailwindAt = order.reduce((at, spec, i) => (isTailwindImport(spec) ? i : at), -1);

  // Applies to either shape, so it is asked before they diverge.
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

  // The bundle carries the @source line and fixes the order inside the package,
  // so the only thing an app can still get wrong is putting it before Tailwind.
  const bundleAt = order.findIndex(isBundle);
  if (bundleAt !== -1) {
    out.push(
      bundleAt < tailwindAt
        ? finding(
            "error",
            `${BUNDLE} is imported before Tailwind`,
            rel,
            "It re-points variables Tailwind defines, so it has to come after.",
          )
        : finding("ok", "the style layer is complete", `${rel} → ${BUNDLE}`),
    );
    if (!order.some((spec) => OPTIONAL_CSS.has(spec))) {
      out.push(
        finding("info", `${[...OPTIONAL_CSS][0]} is not imported`, "only needed if you render code fences", "Add it when you add Shiki."),
      );
    }
    return out;
  }

  const seen = new Map(order.map((spec, i) => [spec, i]));

  const missing = [];
  /** Set when theme.css is absent but the app declares every role itself. */
  let selfPainted = false;
  let last = tailwindAt;
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
    } else if (entry === PALETTE_CSS) {
      // The app's own files, package imports left out — the question is whether
      // it paints the roles itself, and its palette may live a file away.
      const own = stripComments(expandImports(cssFile, { includePackage: false }));
      const unpainted = roles.filter((role) => !new RegExp(`\\${role}\\s*:`).test(own));
      selfPainted = !unpainted.length;
      out.push(
        unpainted.length
          ? finding(
              "error",
              `${entry} is not imported, and ${unpainted.length} role${unpainted.length === 1 ? " has" : "s have"} no value`,
              rel,
              `Add @import "${entry}"; to ${rel}, or declare the roles yourself. Unpainted: ${unpainted.join(", ")}.`,
            )
          : finding("ok", `${entry} is not imported`, `${rel} paints all ${roles.length} roles itself`),
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

  const required = missing.filter(
    (entry) => !OPTIONAL_CSS.has(entry) && !(entry === PALETTE_CSS && selfPainted),
  );
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

/**
 * One CSS file with its `@import`s expanded in place, so a check reads the
 * cascade the browser sees rather than one file of it. A palette split into a
 * neighbouring file is a normal layout, and dropping it would make an app look
 * like it declared nothing. Bare specifiers other than this package's are left
 * out: Tailwind and a component library declare no root palette worth measuring.
 */
const expandImports = (file, { includePackage }, seen = new Set()) => {
  if (seen.has(file)) return "";
  seen.add(file);
  return (read(file) ?? "").replace(/@import\s+["']([^"']+)["'];?/g, (_line, spec) => {
    // The bundle is ours too, and it pulls the rest in relatively — so it has to
    // be followed rather than read. Reading it would yield four @import lines
    // and no palette, and every role would measure as unpainted.
    const ours = isBundle(spec)
      ? "index.css"
      : spec.startsWith(`${PKG_NAME}/`)
        ? spec.slice(PKG_NAME.length + 1)
        : null;
    if (ours !== null)
      return includePackage ? expandImports(join(pkgRoot, "src", ours), { includePackage }, seen) : "";
    if (spec.startsWith(".")) return expandImports(resolve(dirname(file), spec), { includePackage }, seen);
    return "";
  });
};

/**
 * The one check that reads colour rather than wiring. Structural inks are an
 * error: a page whose body text does not clear its own background is broken,
 * not badly styled. Fills and tinted inks are a warning — they are a palette
 * decision, and the app owns its palette.
 */
const checkContrast = async (appRoot) => {
  const out = [];
  const cssFile = findCssEntry(appRoot);
  if (!cssFile) return out;

  let checkLegibility, checkSignals, checkHairlines, formatFailures;
  try {
    ({ checkLegibility, checkSignals, checkHairlines, formatFailures } = await import(
      join(pkgRoot, "dist/contrast.js")
    ));
  } catch {
    // An install without dist/ has louder problems, already reported above.
    return out;
  }

  const css = expandImports(cssFile, { includePackage: true });
  const rel = relative(appRoot, cssFile);
  const groups = [
    ["error", "structural ink below 4.5:1", checkLegibility(css)],
    ["warn", "mark or tinted ink below its bar", checkSignals(css)],
    // A rule owes no WCAG bar, so this can never be an error. It is here because
    // an app that retints --border almost always retints one theme.
    ["warn", "hairline too faint to read as a rule", checkHairlines(css)],
  ];

  for (const [level, title, failures] of groups) {
    if (!failures.length) continue;
    out.push(
      finding(level, `${failures.length} ${title}`, rel, formatFailures(failures).split("\n").join("; ")),
    );
  }

  if (!out.length) out.push(finding("ok", "every ink clears its surface in both themes", rel));
  return out;
};

/* ---------------------------------------------------------------- commands */

const fontSnippet = () => `import { Ubuntu_Sans, Ubuntu_Sans_Mono, Average } from "next/font/google";

const sans = Ubuntu_Sans({ variable: "--font-ubuntu-sans", subsets: ["latin"] });
const mono = Ubuntu_Sans_Mono({ variable: "--font-ubuntu-sans-mono", subsets: ["latin"] });
const serif = Average({ variable: "--font-average", weight: "400", subsets: ["latin"] });

// .variable, never .className
<html className={\`\${sans.variable} \${mono.variable} \${serif.variable} font-sans\`}>`;

const doctor = async (appRoot) => {
  // Asked once, because it decides what the rest of the report can mean.
  const major = tailwindOf(appRoot, findCssEntry(appRoot));
  const install = checkInstall(appRoot);
  const styles = checkStyles(appRoot, major);
  const fonts = checkFonts(appRoot);
  // On v3 the cascade never assembles, so measuring the colours it did not
  // produce would fill the report with failures that all have one cause.
  const contrast = major !== null && major < 4 ? [] : await checkContrast(appRoot);
  const all = [...install, ...styles, ...fonts, ...contrast];

  console.log(`\n${bold(PKG_NAME)} ${dim(`doctor · ${appRoot}`)}`);
  report([
    ["Install", install],
    ["Styles", styles],
    ["Fonts", fonts],
    ["Contrast", contrast],
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
  const major = tailwindOf(appRoot, cssFile);

  // Patching a v3 stylesheet would trade a working build for a pile of parse
  // errors, so this stops at the diagnosis instead. Nothing is written.
  if (major !== null && major < 4) {
    console.log(`\n${paint(31, "✖")} this app is on ${bold(`Tailwind v${major}`)}, and the package needs v4.`);
    if (cssFile) console.log(`  ${dim(`${relative(appRoot, cssFile)} is the entry, and it is in the v3 dialect.`)}`);
    console.log(`  ${dim(TAILWIND_WHY)} ${dim("On v3 they are parse errors.")}`);
    console.log(`\n  ${dim("→")} ${TAILWIND_UPGRADE}`);
    console.log(`\nThen run ${bold("foundations init")} again.\n`);
    return 1;
  }

  if (!cssFile) {
    // Named where the scaffolds actually put it, so the instruction matches the
    // file the reader is about to create.
    const target = existsSync(join(appRoot, "src/app")) ? "src/app/globals.css" : "app/globals.css";
    console.log(`\nNo CSS entry importing Tailwind under ${appRoot}.`);
    console.log(dim(`Looked for a ${STYLE_EXTS.join(", ")} file that imports it.`));
    console.log(`\nCreate ${bold(target)} with:\n`);
    console.log(`@import "tailwindcss";\n@import "${BUNDLE}";`);
    console.log();
    return 1;
  }

  const before = read(cssFile) ?? "";
  const live = stripComments(before);
  const rel = relative(appRoot, cssFile);
  const lines = before.split("\n");
  const present = new Set(importsOf(live));

  /** After Tailwind itself: everything the package ships re-points its variables. */
  const anchorIn = (from) =>
    from.reduce((at, line, i) => (importsOf(stripComments(line)).some(isTailwindImport) ? i : at), -1);

  if ([...present].some(isBundle)) {
    console.log(`\n${rel} already imports the style layer.`);
  } else if (!cssEntries.some((entry) => present.has(entry))) {
    // Nothing of ours in the file yet, so it gets the single import. There is
    // no order to arrange and no @source to compute: the package does both.
    const line = `@import "${BUNDLE}";`;
    lines.splice(anchorIn(lines) + 1, 0, line);
    if (dryRun) {
      console.log(`\n${bold(rel)} ${dim("(dry run — nothing written)")}`);
    } else {
      writeFileSync(cssFile, lines.join("\n"));
      console.log(`\n${paint(32, "✔")} patched ${bold(rel)}`);
    }
    console.log(`  ${paint(32, "+")} ${line}`);
  } else {
    legacy(appRoot, cssFile, { before, live, rel, lines, present, anchorIn, dryRun });
  }

  console.log(`\n${bold("Bind the fonts")} in your root layout. The package cannot load them for you:\n`);
  console.log(fontSnippet());
  console.log(`\n${bold("If you use a coding agent")}, point it at the API summary:\n`);
  console.log(`  ${dim("# CLAUDE.md, AGENTS.md, or your agent's equivalent")}`);
  console.log(`  @node_modules/${PKG_NAME}/llms.txt`);
  console.log(`\nThen: ${bold("foundations doctor")}\n`);
  return 0;
};

/**
 * The old shape: the four entry points written out by the consumer, plus an
 * `@source` line it had to path itself. Still supported, and still repaired —
 * an app on it is not broken, and rewriting a file someone else wrote is not
 * this command's call. `init` only offers the one-line form.
 *
 * Lift the package's own @import lines out, then lay them back down in the
 * one order the cascade accepts. Lifting the whole LINE keeps a trailing
 * comment attached to the import a consumer wrote it against, and makes a file
 * that is merely out of order repairable rather than only diagnosable.
 */
const legacy = (appRoot, cssFile, { live, rel, lines, present, anchorIn, dryRun }) => {
  const existing = new Map();
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
    kept.splice(anchorIn(kept) + 1, 0, ...block);

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

  console.log(
    `\n${dim(`These ${cssEntries.filter((e) => !OPTIONAL_CSS.has(e)).length} lines and the @source can now be one: @import "${BUNDLE}";`)}`,
  );
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
/** Flags that take a value, so the value is not mistaken for the command. */
const VALUED = new Set(["--cwd"]);
const command = args.find((a, i) => !a.startsWith("--") && !VALUED.has(args[i - 1])) ?? "help";
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
    process.exit(await doctor(appRoot));
  case "init":
    process.exit(init(appRoot, { dryRun: flag("dry-run") }));
  default:
    console.error(`unknown command: ${command}`);
    usage();
    process.exit(1);
}
