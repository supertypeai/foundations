import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, describe, expect, it } from "vitest";
import {
  makeApp,
  cleanupApps,
  repoPkg,
  DEFAULT_PEERS,
  DEFAULT_CSS,
  BUNDLE_CSS,
  CURRENT_TAG,
} from "./fixtures/app.js";

const CLI = fileURLToPath(new URL("../bin/foundations.mjs", import.meta.url));

/** Runs the CLI against a fixture and returns its output and exit code. */
const run = (args: string[], cwd: string) => {
  try {
    const stdout = execFileSync("node", [CLI, ...args, "--cwd", cwd], {
      encoding: "utf8",
      env: { ...process.env, NO_COLOR: "1" },
    });
    return { code: 0, out: stdout };
  } catch (err: any) {
    return { code: err.status as number, out: `${err.stdout ?? ""}${err.stderr ?? ""}` };
  }
};

const doctor = (cwd: string) => run(["doctor"], cwd);

afterAll(cleanupApps);

describe("doctor", () => {
  it("passes a correctly wired app", () => {
    const { code, out } = doctor(makeApp());
    expect(out).toContain("no problems");
    expect(code).toBe(0);
  });

  it("passes an app on the single import, with no @source of its own", () => {
    const { code, out } = doctor(makeApp({ css: BUNDLE_CSS }));
    expect(out).toContain("the style layer is complete");
    expect(out).not.toContain("no @source line");
    expect(code).toBe(0);
  });

  it("fails when the single import comes before Tailwind", () => {
    const app = makeApp({
      css: `@import "@supertype.ai/foundations";\n@import "tailwindcss";\n`,
    });
    const { code, out } = doctor(app);
    expect(out).toContain("is imported before Tailwind");
    expect(code).toBe(1);
  });

  // The bundle imports its own files relatively, so the contrast pass has to
  // follow it rather than read it — reading it would find four @import lines,
  // no palette, and report every role as unpainted.
  it("measures the palette through the single import", () => {
    const app = makeApp({ css: `${BUNDLE_CSS}\n:root { --muted-foreground: hsl(0 0% 88%); }\n` });
    const { code, out } = doctor(app);
    expect(out).toContain("structural ink below 4.5:1");
    expect(out).toContain("--muted-foreground");
    expect(code).toBe(1);
  });

  it("fails when the @source line is missing", () => {
    const app = makeApp({
      css: `@import "tailwindcss";
@import "@supertype.ai/foundations/tokens.css";
@import "@supertype.ai/foundations/theme.css";
@import "@supertype.ai/foundations/type.css";
@import "@supertype.ai/foundations/prose.css";
`,
    });
    const { code, out } = doctor(app);
    expect(out).toContain("no @source line for the package");
    expect(code).toBe(1);
  });

  it("fails when the CSS imports are out of order", () => {
    const app = makeApp({
      css: `@import "tailwindcss";
@import "@supertype.ai/foundations/type.css";
@import "@supertype.ai/foundations/tokens.css";
@import "@supertype.ai/foundations/theme.css";
@import "@supertype.ai/foundations/prose.css";

@source '../node_modules/@supertype.ai/foundations/dist/**/*.js';
`,
    });
    const { code, out } = doctor(app);
    expect(out).toContain("is imported out of order");
    expect(code).toBe(1);
  });

  it("fails when theme.css is absent and nothing else paints the roles", () => {
    const app = makeApp({
      css: `@import "tailwindcss";
@import "@supertype.ai/foundations/tokens.css";
@import "@supertype.ai/foundations/type.css";
@import "@supertype.ai/foundations/prose.css";

@source '../node_modules/@supertype.ai/foundations/dist/**/*.js';
`,
    });
    const { code, out } = doctor(app);
    expect(out).toContain("theme.css is not imported");
    expect(out).toContain("--background");
    expect(code).toBe(1);
  });

  it("passes when the app paints every role itself", () => {
    const roles = [
      ...readFileSync(
        fileURLToPath(new URL("../src/tokens.css", import.meta.url)),
        "utf8",
      ).matchAll(/--color-[a-z0-9-]+:\s*var\((--[a-z0-9-]+)\)/gi),
      // Inks dark, surfaces light: the point is coverage, but doctor now measures
      // contrast too, and a palette of one grey is unreadable by construction.
    ].map((m) => `  ${m[1]}: ${/foreground|ink|danger/.test(m[1]) ? "#111111" : "#ffffff"};`);

    const app = makeApp({
      css: `@import "tailwindcss";
@import "@supertype.ai/foundations/tokens.css";
@import "@supertype.ai/foundations/type.css";
@import "@supertype.ai/foundations/prose.css";

@source '../node_modules/@supertype.ai/foundations/dist/**/*.js';

:root {
${roles.join("\n")}
}
`,
    });
    const { code, out } = doctor(app);
    expect(out).toContain("paints all");
    expect(code).toBe(0);
  });

  it("fails when a font is bound with .className", () => {
    const app = makeApp({
      layout: `import { Ubuntu_Sans, Ubuntu_Sans_Mono, Average } from "next/font/google";

const sans = Ubuntu_Sans({ variable: "--font-ubuntu-sans", subsets: ["latin"] });
const mono = Ubuntu_Sans_Mono({ variable: "--font-ubuntu-sans-mono", subsets: ["latin"] });
const serif = Average({ variable: "--font-average", weight: "400", subsets: ["latin"] });

export default function RootLayout() {
  return <html className={sans.className} />;
}
`,
    });
    const { code, out } = doctor(app);
    expect(out).toContain("bound with .className: sans");
    expect(code).toBe(1);
  });

  it("fails when a required font role is unbound", () => {
    const app = makeApp({
      layout: `import { Ubuntu_Sans } from "next/font/google";

const sans = Ubuntu_Sans({ variable: "--font-ubuntu-sans", subsets: ["latin"] });

export default function RootLayout() {
  return <html className={sans.variable} />;
}
`,
    });
    const { code, out } = doctor(app);
    expect(out).toContain("--font-ubuntu-sans-mono is not bound");
    expect(code).toBe(1);
  });

  it("treats the editorial serif as informational until .editorial is used", () => {
    const layout = `import { Ubuntu_Sans, Ubuntu_Sans_Mono } from "next/font/google";

const sans = Ubuntu_Sans({ variable: "--font-ubuntu-sans", subsets: ["latin"] });
const mono = Ubuntu_Sans_Mono({ variable: "--font-ubuntu-sans-mono", subsets: ["latin"] });

export default function RootLayout() {
  return <html className={\`\${sans.variable} \${mono.variable}\`} />;
}
`;
    expect(doctor(makeApp({ layout })).code).toBe(0);

    const usesEditorial = makeApp({
      layout,
      files: { "app/page.tsx": `export default () => <div className="editorial" />;` },
    });
    const { code, out } = doctor(usesEditorial);
    expect(out).toContain("--font-average is not bound");
    expect(code).toBe(1);
  });

  it("fails on a symlinked install", () => {
    const { code, out } = doctor(makeApp({ symlinked: true }));
    expect(out).toContain("the installed package is a symlink");
    expect(code).toBe(1);
  });

  it("fails on a second React nested in the package", () => {
    const { code, out } = doctor(makeApp({ nestedReact: true }));
    expect(out).toContain("a second React is nested inside the package");
    expect(code).toBe(1);
  });

  it("fails when a peer is below its range", () => {
    const { code, out } = doctor(makeApp({ peers: { "next-view-transitions": "0.2.0" } }));
    expect(out).toContain("below the peer range");
    expect(code).toBe(1);
  });

  it("treats a missing @base-ui/react as a warning only", () => {
    const { code, out } = doctor(makeApp({ peers: { "@base-ui/react": null } }));
    expect(out).toContain("@base-ui/react is not installed");
    expect(code).toBe(0);
  });

  // The default fixture pins the version this repo is at, so this case has to be
  // asked for. It used to fire by accident on every release, in tests that were
  // about something else.
  it("warns when the pinned tag is not the installed version", () => {
    const app = makeApp({ spec: "https://github.com/supertypeai/foundations.git#v0.0.1" });
    const { code, out } = doctor(app);
    expect(out).toContain("does not match the pinned tag");
    expect(out).toContain(repoPkg.version);
    expect(code).toBe(0);
  });

  it("warns about an unpinned dependency", () => {
    const { out, code } = doctor(makeApp({ spec: "https://github.com/supertypeai/foundations.git#main" }));
    expect(out).toContain("not pinned to a tag");
    expect(code).toBe(0);
  });

  // The tag rules are about git specs re-resolving. A registry range is pinned
  // by the lockfile, so the same warning there would fire on every consumer
  // installing the documented way.
  it("says nothing about a registry range", () => {
    const { out, code } = doctor(makeApp({ spec: `^${repoPkg.version}` }));
    expect(out).not.toContain("not pinned to a tag");
    expect(out).not.toContain("does not match the pinned tag");
    expect(code).toBe(0);
  });

  it("fails when the package is not a dependency at all", () => {
    const { code, out } = doctor(makeApp({ spec: null }));
    expect(out).toContain("is not a dependency of this app");
    expect(code).toBe(1);
  });

  it("fails when no CSS entry imports Tailwind", () => {
    const { code, out } = doctor(makeApp({ css: "body { color: red; }\n" }));
    expect(out).toContain("no CSS entry importing Tailwind");
    expect(code).toBe(1);
  });

  // DEFAULT_PEERS is hand-written, so a bump to a peer range in package.json can
  // leave it below the floor. Without this, that surfaces as a failure in
  // "passes a correctly wired app", which says nothing about the cause.
  it("keeps the fixture's peers within the declared ranges", () => {
    const parts = (spec: string) => {
      const m = /(\d+)(?:\.(\d+))?(?:\.(\d+))?/.exec(spec);
      return m ? [Number(m[1]), Number(m[2] ?? 0), Number(m[3] ?? 0)] : null;
    };
    // Compare rung by rung. Comparing the arrays directly coerces both to
    // strings, where "9.0.0" sorts above "10.0.0".
    const atLeast = (have: number[], want: number[]) => {
      for (let i = 0; i < 3; i += 1) {
        if (have[i] !== want[i]) return have[i] > want[i];
      }
      return true;
    };

    for (const [name, range] of Object.entries(repoPkg.peerDependencies)) {
      const have = parts(DEFAULT_PEERS[name] ?? "");
      const want = parts(range);
      expect(have, `${name} is missing from DEFAULT_PEERS`).not.toBeNull();
      expect(want, `${name} has an unparseable peer range: ${range}`).not.toBeNull();
      expect(
        atLeast(have!, want!),
        `DEFAULT_PEERS.${name} is ${DEFAULT_PEERS[name]}, below the declared ${range}`,
      ).toBe(true);
    }
  });

  // sectors is on Tailwind 3.3.2 with a v3 `src/app/globals.css`. Every check
  // in this block used to answer "no CSS entry importing tailwindcss", which is
  // both wrong and unactionable: the entry is there, the version is not.
  const V3_CSS = "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n";

  it("names Tailwind v3 as the cause rather than reporting no entry", () => {
    const app = makeApp({ css: V3_CSS, peers: { tailwindcss: "3.3.2" } });
    const { code, out } = doctor(app);
    expect(out).toContain("is a Tailwind v3 stylesheet");
    expect(out).toContain("tailwindcss@3.3.2 is below the peer range");
    expect(out).not.toContain("no CSS entry");
    expect(code).toBe(1);
  });

  // The install is the fact; the dialect is the fallback for an app running
  // `npx … init` before it has installed anything.
  it("falls back to the stylesheet's dialect when Tailwind is not installed", () => {
    const app = makeApp({ css: V3_CSS, peers: { tailwindcss: null } });
    expect(doctor(app).out).toContain("is a Tailwind v3 stylesheet");
  });

  it("finds an entry outside app/, src/ and styles/", () => {
    const app = makeApp({ css: null, files: { "assets/globals.css": DEFAULT_CSS } });
    const { out } = doctor(app);
    expect(out).not.toContain("no CSS entry");
    // The @source line is measured from wherever the entry actually is.
    expect(out).toContain("assets/globals.css");
  });

  it("finds an entry written in v4's layered import form", () => {
    const app = makeApp({
      css: `@layer theme, base, components, utilities;
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);
@import "tailwindcss/utilities.css" layer(utilities);
`,
    });
    expect(doctor(app).out).not.toContain("no CSS entry");
  });

  it("refuses to run against the package itself", () => {
    const repo = fileURLToPath(new URL("..", import.meta.url));
    const { code, out } = doctor(repo);
    expect(out).toContain("Run the CLI from an app that uses it");
    expect(code).toBe(1);
  });
});

// Both of these shipped as bugs. They stay as tests.
describe("doctor: CSS comments are not directives", () => {
  it("does not warn about @custom-variant mentioned in a comment", () => {
    const app = makeApp({
      css: `@import "tailwindcss";
@import "@supertype.ai/foundations/tokens.css";
@import "@supertype.ai/foundations/theme.css";
@import "@supertype.ai/foundations/type.css";
@import "@supertype.ai/foundations/prose.css";

@source '../node_modules/@supertype.ai/foundations/dist/**/*.js';

/* No @custom-variant dark here: tokens.css already binds it. */
`,
    });
    const { code, out } = doctor(app);
    expect(out).not.toContain("declares its own dark variant");
    expect(code).toBe(0);
  });

  it("still warns about a real second dark variant", () => {
    const app = makeApp({
      css: `@import "tailwindcss";
@import "@supertype.ai/foundations/tokens.css";
@import "@supertype.ai/foundations/theme.css";
@import "@supertype.ai/foundations/type.css";
@import "@supertype.ai/foundations/prose.css";

@source '../node_modules/@supertype.ai/foundations/dist/**/*.js';

@custom-variant dark (&:is(.dark *));
`,
    });
    expect(doctor(app).out).toContain("declares its own dark variant");
  });

  it("keeps the /**/ in the @source glob intact", () => {
    const { out } = doctor(makeApp());
    expect(out).toContain("dist/**/*.js");
    expect(out).not.toContain("dist*.js");
  });

  it("fails when an override makes body ink unreadable", () => {
    const app = makeApp({
      css: `${DEFAULT_CSS}
:root { --muted-foreground: hsl(0 0% 88%); }
`,
    });
    const { code, out } = doctor(app);
    expect(out).toContain("structural ink below 4.5:1");
    expect(out).toContain("--muted-foreground");
    expect(code).toBe(1);
  });

  it("warns, without failing, when a mark is under its own bar", () => {
    const app = makeApp({
      css: `${DEFAULT_CSS}
:root { --warn: hsl(30 100% 52%); }
`,
    });
    const { code, out } = doctor(app);
    expect(out).toContain("mark or tinted ink below its bar");
    expect(out).toContain("--warn");
    expect(code).toBe(0);
  });

  it("finds a palette that lives one relative import away", () => {
    const roles = [
      ...readFileSync(
        fileURLToPath(new URL("../src/tokens.css", import.meta.url)),
        "utf8",
      ).matchAll(/--color-[a-z0-9-]+:\s*var\((--[a-z0-9-]+)\)/gi),
    ].map((m) => `  ${m[1]}: ${/foreground|ink|danger/.test(m[1]) ? "#111111" : "#ffffff"};`);

    const app = makeApp({
      css: `@import "tailwindcss";
@import "@supertype.ai/foundations/tokens.css";
@import "./palette.css";
@import "@supertype.ai/foundations/type.css";
@import "@supertype.ai/foundations/prose.css";

@source '../node_modules/@supertype.ai/foundations/dist/**/*.js';
`,
      files: { "app/palette.css": `:root {\n${roles.join("\n")}\n}\n` },
    });
    const { code, out } = doctor(app);
    expect(out).toContain("paints all");
    expect(code).toBe(0);
  });

  it("treats a commented-out import as missing", () => {
    const app = makeApp({
      css: `@import "tailwindcss";
@import "@supertype.ai/foundations/tokens.css";
/* @import "@supertype.ai/foundations/theme.css"; */
@import "@supertype.ai/foundations/type.css";
@import "@supertype.ai/foundations/prose.css";

@source '../node_modules/@supertype.ai/foundations/dist/**/*.js';
`,
    });
    expect(doctor(app).out).toContain("theme.css is not imported");
  });
});

describe("init", () => {
  const readCss = (app: string) => readFileSync(join(app, "app/global.css"), "utf8");

  it("adds the single import to an entry with nothing of ours in it", () => {
    const app = makeApp({ css: `@import "tailwindcss";\n` });
    run(["init"], app);
    const css = readCss(app);

    expect(css).toContain(`@import "@supertype.ai/foundations";`);
    // The package registers its own sources now, so neither of these is the
    // app's business any more.
    expect(css).not.toContain("@source");
    expect(css).not.toContain("tokens.css");
    expect(doctor(app).code).toBe(0);
  });

  it("puts the import after Tailwind, not before it", () => {
    const app = makeApp({ css: `body { color: red; }\n@import "tailwindcss";\n` });
    run(["init"], app);
    const css = readCss(app);
    expect(css.indexOf(`"tailwindcss"`)).toBeLessThan(css.indexOf(`"@supertype.ai/foundations"`));
  });

  it("repairs the order and keeps a trailing comment with its import", () => {
    const app = makeApp({
      css: `@import "tailwindcss";
@import "@supertype.ai/foundations/type.css";  /* the type ramp */
@import "@supertype.ai/foundations/tokens.css";
@import "@supertype.ai/foundations/prose.css";

@layer base {
  body { color: red; }
}
`,
    });
    run(["init"], app);
    const css = readCss(app);

    expect(css.indexOf("tokens.css")).toBeLessThan(css.indexOf("theme.css"));
    expect(css.indexOf("theme.css")).toBeLessThan(css.indexOf("type.css"));
    expect(css.indexOf("type.css")).toBeLessThan(css.indexOf("prose.css"));
    expect(css).toContain(`@import "@supertype.ai/foundations/type.css";  /* the type ramp */`);
    expect(css).toContain("@layer base {");
    expect(doctor(app).code).toBe(0);
  });

  it("is idempotent", () => {
    const app = makeApp({ css: `@import "tailwindcss";\n` });
    run(["init"], app);
    const once = readCss(app);
    const { out } = run(["init"], app);
    expect(readCss(app)).toBe(once);
    expect(out).toContain("already imports the style layer");
  });

  it("does not revive a commented-out import", () => {
    const app = makeApp({
      css: `@import "tailwindcss";
@import "@supertype.ai/foundations/tokens.css";
/* @import "@supertype.ai/foundations/theme.css"; */
`,
    });
    run(["init"], app);
    const css = readCss(app);
    expect(css).toContain(`/* @import "@supertype.ai/foundations/theme.css"; */`);
    // One live import plus the commented one.
    expect(css.match(/@import "@supertype\.ai\/foundations\/theme\.css";/g)).toHaveLength(2);
    expect(doctor(app).code).toBe(0);
  });

  it("writes nothing with --dry-run", () => {
    const app = makeApp({ css: `@import "tailwindcss";\n` });
    const before = readCss(app);
    const { out } = run(["init", "--dry-run"], app);
    expect(readCss(app)).toBe(before);
    expect(out).toContain("dry run");
  });

  // The whole point of the v3 gate: the block it would write is v4 syntax, so
  // patching would trade a building app for a pile of parse errors.
  it("writes nothing to a Tailwind v3 stylesheet", () => {
    const css = "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n";
    const app = makeApp({ css, peers: { tailwindcss: "3.3.2" } });
    const { code, out } = run(["init"], app);

    expect(readCss(app)).toBe(css);
    expect(out).toContain("this app is on Tailwind v3");
    expect(out).toContain("@tailwindcss/upgrade");
    expect(code).toBe(1);
  });

  it("lands the block after the last import of v4's layered form", () => {
    const app = makeApp({
      css: `@layer theme, base, components, utilities;
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);
@import "tailwindcss/utilities.css" layer(utilities);
`,
    });
    run(["init"], app);
    const css = readCss(app);
    expect(css.indexOf("tailwindcss/utilities.css")).toBeLessThan(
      css.indexOf(`"@supertype.ai/foundations"`),
    );
    expect(doctor(app).code).toBe(0);
  });

  // A workspace hoists the package to the repo root, so the path measured from
  // the app's own package.json points at nothing and Tailwind silently scans
  // nothing — which renders every component unstyled, with no error anywhere.
  it("points @source at the package where it is actually installed", () => {
    const root = makeApp({
      files: {
        "apps/web/package.json": JSON.stringify({
          name: "web",
          dependencies: { "@supertype.ai/foundations": CURRENT_TAG },
        }),
        // The granular form, so init takes the legacy path and has an @source
        // line to compute in the first place.
        "apps/web/app/globals.css": `@import "tailwindcss";
@import "@supertype.ai/foundations/tokens.css";
`,
      },
    });
    const app = join(root, "apps/web");
    run(["init"], app);

    const css = readFileSync(join(app, "app/globals.css"), "utf8");
    expect(css).toContain("@source '../../../node_modules/@supertype.ai/foundations/dist/**/*.js';");
    expect(doctor(app).out).toContain("@source scans the package");
  });

  it("leaves an entry that already takes the single import alone", () => {
    const app = makeApp({ css: BUNDLE_CSS });
    run(["init"], app);
    expect(readCss(app)).toBe(BUNDLE_CSS);
    expect(run(["init"], app).out).toContain("already imports the style layer");
  });

  it("tells an app on the granular form that it can collapse to one line", () => {
    const { out } = run(["init"], makeApp({ css: DEFAULT_CSS }));
    expect(out).toContain(`can now be one: @import "@supertype.ai/foundations";`);
  });

  it("prints the font binding and the agent pointer", () => {
    const { out } = run(["init"], makeApp());
    expect(out).toContain("variable: \"--font-ubuntu-sans\"");
    expect(out).toContain("@node_modules/@supertype.ai/foundations/llms.txt");
  });
});

/** One file holding every shape 0.4 moves, and one it must leave alone. */
const BEFORE = `import { TypographyCaption, TypographyLabel } from "@supertype.ai/foundations";
import { Icons } from "./icons";

export function Card({ late }: { late: number }) {
  return (
    <div>
      <TypographyCaption className="flex items-center gap-1">
        <Icons.Clock className="size-3" /> 44d ago
      </TypographyCaption>
      <div className="flex items-center gap-2">
        <Icons.Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
        <TypographyLabel>Shared address</TypographyLabel>
      </div>
      <p>
        Open the <Icons.Settings className="inline h-4 w-4 align-middle mr-1" /> menu.
      </p>
      <TypographyCaption className="flex items-center gap-1">
        <Icons.Zap />
        {late} <span>late</span>
      </TypographyCaption>
    </div>
  );
}
`;

const AFTER = `import { Mark, TypographyCaption, TypographyLabel } from "@supertype.ai/foundations";
import { Icons } from "./icons";

export function Card({ late }: { late: number }) {
  return (
    <div>
      <TypographyCaption className="gap-x-1" mark={<Icons.Clock />}>
        44d ago
      </TypographyCaption>
      <TypographyLabel className="gap-x-2" mark={<Icons.Mail className="text-muted-foreground" />}>Shared address</TypographyLabel>
      <p>
        Open the <Mark className="mr-1"><Icons.Settings /></Mark> menu.
      </p>
      <TypographyCaption className="flex items-center gap-1">
        <Icons.Zap />
        {late} <span>late</span>
      </TypographyCaption>
    </div>
  );
}
`;

/** A client file written without semicolons, whose import has to follow the directive. */
const CLIENT_BEFORE = `"use client"

export const Hint = () => <p>Open the <SettingsIcon className="inline size-4 align-middle" /> menu</p>
`;

const CLIENT_AFTER = `"use client"
import { Mark } from "@supertype.ai/foundations"

export const Hint = () => <p>Open the <Mark><SettingsIcon /></Mark> menu</p>
`;

/** \`Mark\` already names something here, and nothing else is ours to touch. */
const TAKEN = `import { Mark } from "@mantine/core";
import { cn } from "@supertype.ai/foundations";

export const Note = () => (
  <p className="">
    See <Mark>this</Mark> <InfoIcon className="inline size-3 align-middle" />
  </p>
);
`;

/** Classes built with \`cn\`, and a row whose role runs over lines, so unwrapping has to dedent it. */
const META_BEFORE = `import { cn, TypographyCaption, TypographyLabel } from "@supertype.ai/foundations";

export const Meta = ({ muted, tone }: { muted: boolean; tone: string }) => (
  <section>
    <TypographyCaption className={cn("flex items-center", muted && "opacity-50")}>
      <ClockIcon className={cn("size-3", tone)} />
      44d ago
    </TypographyCaption>
    <TypographyCaption className={cn("flex items-center")}>
      <ClockIcon className={cn(tone, "size-3", "shrink-0")} />
      Due
    </TypographyCaption>
    <div className="flex items-center gap-2">
      <MailIcon />
      <TypographyLabel>
        Shared address
      </TypographyLabel>
    </div>
  </section>
);
`;

const META_AFTER = `import { cn, TypographyCaption, TypographyLabel } from "@supertype.ai/foundations";

export const Meta = ({ muted, tone }: { muted: boolean; tone: string }) => (
  <section>
    <TypographyCaption className={cn(muted && "opacity-50")} mark={<ClockIcon className={cn(tone)} />}>
      44d ago
    </TypographyCaption>
    <TypographyCaption mark={<ClockIcon className={cn(tone)} />}>
      Due
    </TypographyCaption>
    <TypographyLabel className="gap-x-2" mark={<MailIcon />}>
      Shared address
    </TypographyLabel>
  </section>
);
`;

const FILES = { "src/card.tsx": BEFORE, "src/hint.jsx": CLIENT_BEFORE, "src/note.tsx": TAKEN, "src/meta.tsx": META_BEFORE };

const git = (cwd: string, ...args: string[]) =>
  execFileSync("git", ["-c", "user.email=t@t", "-c", "user.name=t", ...args], { cwd, stdio: "ignore" });
const source = (app: string, file = "src/card.tsx") => readFileSync(join(app, file), "utf8");

describe("upgrade", () => {
  it("moves the regular shapes, leaves the irregular ones named, and changes nothing twice", () => {
    const app = makeApp({ typescript: true, files: FILES });
    git(app, "init", "-q");
    git(app, "add", "-A");
    git(app, "commit", "-qm", "before");

    const first = run(["upgrade"], app);
    expect(first.code).toBe(0);
    expect(source(app)).toBe(AFTER);
    expect(source(app, "src/hint.jsx")).toBe(CLIENT_AFTER);
    expect(source(app, "src/meta.tsx")).toBe(META_AFTER);
    // Named, never guessed at: the other \`Mark\` stays, and so does the class nothing moved.
    expect(source(app, "src/note.tsx")).toBe(TAKEN);
    expect(first.out).toContain("7 moved");
    expect(first.out).toMatch(/src\/card\.tsx:17\s+flex row holding other elements/);
    expect(first.out).toMatch(/src\/note\.tsx:6\s+inline glyph, but `Mark` already names an import from @mantine\/core/);

    git(app, "commit", "-qam", "after");
    const second = run(["upgrade"], app);
    expect(second.out).toContain("nothing to move");
    expect(source(app)).toBe(AFTER);
    expect(source(app, "src/hint.jsx")).toBe(CLIENT_AFTER);
    expect(source(app, "src/meta.tsx")).toBe(META_AFTER);
  });

  /** A line a later pass names is the line in the file as it was, not as the earlier passes left it. */
  it("names a line as the file had it", () => {
    // The role pass takes line 7 out; the inline pass, after it, still names line 11.
    const shifted = `import { Mark } from "@mantine/core";
import { TypographyLabel } from "@supertype.ai/foundations";

export const A = () => (
  <div>
    <TypographyLabel className="flex items-center gap-1">
      <ClockIcon className="size-3" />
      Due
    </TypographyLabel>
    <p>
      See <InfoIcon className="inline size-3 align-middle" />
    </p>
  </div>
);
`;
    const app = makeApp({ typescript: true, files: { "src/a.tsx": shifted } });
    expect(run(["upgrade", "--dry-run"], app).out).toMatch(/src\/a\.tsx:11\s+inline glyph, but/);
  });

  /** sectors' shadcn CardTitle took a mark it has no prop for: a role is a name imported from the package. */
  it("leaves an app's own component of a role's name alone", () => {
    const own = `import { CardTitle } from "@/components/ui/card";

export const Period = () => (
  <CardTitle className="flex items-center gap-2">
    <CalendarIcon className="size-4" />
    Trailing 12 Months
  </CardTitle>
);
`;
    const app = makeApp({ typescript: true, files: { "src/period.tsx": own } });
    run(["upgrade", "--force"], app);
    expect(source(app, "src/period.tsx")).toBe(own);
  });

  /** The two roles that only pinned a prop become the prop, and only the package's. */
  it("renames the roles 0.4 folded into a prop", () => {
    const files = {
      "src/terms.tsx": `import { TypographyCaption, TypographyProseList, TypographySmall } from "@supertype.ai/foundations";

export const Terms = () => (
  <>
    <TypographySmall className="mt-2">Rates exclude tax.</TypographySmall>
    <TypographyCaption>Billed monthly</TypographyCaption>
    <TypographyProseList ordered>
      <li>One</li>
    </TypographyProseList>
  </>
);
`,
      "src/typed.tsx": `import { TypographySmall } from "@supertype.ai/foundations";

export const Hint = (props: React.ComponentProps<typeof TypographySmall>) => <TypographySmall {...props} />;
`,
      "src/aliased.tsx": `import { TypographySmall as Small } from "@supertype.ai/foundations";

export const A = () => <Small>Fine print</Small>;
`,
      "src/own.tsx": `import { TypographySmall } from "./typography";

export const B = () => <TypographySmall>Ours</TypographySmall>;
`,
    };
    const app = makeApp({ typescript: true, files });
    const { out } = run(["upgrade", "--force"], app);

    expect(source(app, "src/terms.tsx")).toBe(`import { TypographyCaption, TypographyList } from "@supertype.ai/foundations";

export const Terms = () => (
  <>
    <TypographyCaption as="p" className="mt-2">Rates exclude tax.</TypographyCaption>
    <TypographyCaption>Billed monthly</TypographyCaption>
    <TypographyList variant="prose" ordered>
      <li>One</li>
    </TypographyList>
  </>
);
`);
    // A props type that named the old role names the new one, so the import can go.
    expect(source(app, "src/typed.tsx")).toBe(`import { TypographyCaption } from "@supertype.ai/foundations";

export const Hint = (props: React.ComponentProps<typeof TypographyCaption>) => <TypographyCaption as="p" {...props} />;
`);
    expect(source(app, "src/aliased.tsx")).toBe(files["src/aliased.tsx"]);
    expect(source(app, "src/own.tsx")).toBe(files["src/own.tsx"]);
    expect(out).toContain("4 moved");
    expect(out).toMatch(/src\/aliased\.tsx:1\s+TypographySmall is imported as Small/);
  });

  /** viably's FAQ and inbox folds, and ssite's specimen: the shapes 0.4's removals were written in. */
  it("moves an accordion, literal tabs and a surface's ink to the one way each", () => {
    const files = {
      "src/faq.tsx": `import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@supertype.ai/foundations/blocks";

export const Faq = ({ items }: { items: { q: string; a: string }[] }) => (
  <Accordion className="mt-10 w-full">
    {items.map(({ q, a }) => (
      <AccordionItem key={q} value={q}>
        <AccordionTrigger>{q}</AccordionTrigger>
        <AccordionContent className="leading-relaxed">
          {a}
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
);

export const Folds = ({ label }: { label: string }) => (
  <Accordion multiple className="my-0">
    <AccordionItem value="basis" className="border-b-0">
      <AccordionTrigger className="text-xs">Basis</AccordionTrigger>
      <AccordionContent>Three lines</AccordionContent>
    </AccordionItem>
    <AccordionItem value="history">
      <AccordionTrigger className="text-xs">{label}</AccordionTrigger>
      <AccordionContent>Older</AccordionContent>
    </AccordionItem>
  </Accordion>
);

export const Controlled = ({ open }: { open: string[] }) => <Accordion value={open}>x</Accordion>;

export const Opened = () => (
  <Accordion defaultValue={["b"]}>
    <AccordionItem value="a">
      <AccordionTrigger>A</AccordionTrigger>
      <AccordionContent>One</AccordionContent>
    </AccordionItem>
    <AccordionItem value="b">
      <AccordionTrigger>B</AccordionTrigger>
      <AccordionContent>Two</AccordionContent>
    </AccordionItem>
  </Accordion>
);

export const Runtime = ({ first }: { first: string[] }) => (
  <Accordion defaultValue={first}>
    <AccordionItem value="a">
      <AccordionTrigger>A</AccordionTrigger>
      <AccordionContent>One</AccordionContent>
    </AccordionItem>
  </Accordion>
);
`,
      "src/specimen.tsx": `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@supertype.ai/foundations/blocks";

export function Specimen({ code, filename }: { code: string; filename: string }) {
  return (
    <Tabs defaultValue="preview">
      <TabsList variant="line">
        <TabsTrigger value="preview">Rendered</TabsTrigger>
        <TabsTrigger value="code">{filename}</TabsTrigger>
      </TabsList>
      <TabsContent value="preview">
        <div className="p-6">Preview</div>
      </TabsContent>
      <TabsContent value="code">
        <pre>{code}</pre>
      </TabsContent>
    </Tabs>
  );
}
`,
      "src/panel.tsx": `import { cn, INK_ON_POPOVER, INK_ON_SIDEBAR } from "@supertype.ai/foundations";

export const Panel = () => <div className={cn("bg-popover p-4", INK_ON_POPOVER)}>Menu</div>;
export const Rail = () => <aside className={INK_ON_SIDEBAR}>Nav</aside>;
export const Styled = () => <div className={\`bg-popover \${INK_ON_POPOVER}\`} style={{ gap: 4 }}>x</div>;
`,
    };
    const app = makeApp({ typescript: true, files });
    const { out } = run(["upgrade", "--force"], app);

    expect(source(app, "src/faq.tsx")).toBe(`import { DisclosureGroup, Disclosure, Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@supertype.ai/foundations/blocks";

export const Faq = ({ items }: { items: { q: string; a: string }[] }) => (
  <DisclosureGroup type="single" className="mt-10 w-full">
    {items.map(({ q, a }) => (
      <Disclosure key={q} title={q}><div className="leading-relaxed">
          {a}
        </div></Disclosure>
    ))}
  </DisclosureGroup>
);

export const Folds = ({ label }: { label: string }) => (
  <DisclosureGroup className="my-0">
    <Disclosure className="border-b-0" title={<span className="text-xs">Basis</span>}>Three lines</Disclosure>
    <Disclosure title={<span className="text-xs">{label}</span>}>Older</Disclosure>
  </DisclosureGroup>
);

export const Controlled = ({ open }: { open: string[] }) => <Accordion value={open}>x</Accordion>;

export const Opened = () => (
  <DisclosureGroup type="single">
    <Disclosure title="A">One</Disclosure>
    <Disclosure open title="B">Two</Disclosure>
  </DisclosureGroup>
);

export const Runtime = ({ first }: { first: string[] }) => (
  <Accordion defaultValue={first}>
    <AccordionItem value="a">
      <AccordionTrigger>A</AccordionTrigger>
      <AccordionContent>One</AccordionContent>
    </AccordionItem>
  </Accordion>
);
`);
    expect(out).toMatch(/src\/faq\.tsx:29\s+Accordion with value=\{open\}/);

    expect(source(app, "src/specimen.tsx")).toBe(`import { TabGroup } from "@supertype.ai/foundations/blocks";

export function Specimen({ code, filename }: { code: string; filename: string }) {
  return (
    <TabGroup
      defaultValue="preview"
      variant="line"
      tabs={[
        { value: "preview", label: "Rendered", content: <div className="p-6">Preview</div> },
        { value: "code", label: filename, content: <pre>{code}</pre> },
      ]}
    />
  );
}
`);

    expect(source(app, "src/panel.tsx")).toBe(`import { cn, INK_ON_POPOVER, inkOnSurfaceStyle } from "@supertype.ai/foundations";

export const Panel = () => <div className={cn("bg-popover p-4")} style={inkOnSurfaceStyle("--popover-foreground")}>Menu</div>;
export const Rail = () => <aside style={inkOnSurfaceStyle("--sidebar-foreground")}>Nav</aside>;
export const Styled = () => <div className={\`bg-popover \${INK_ON_POPOVER}\`} style={{ gap: 4 }}>x</div>;
`);
    expect(out).toMatch(/src\/panel\.tsx:5\s+INK_ON_POPOVER on an element with a style of its own/);

    // A second run finds nothing more to move.
    expect(run(["upgrade", "--dry-run"], app).out).not.toMatch(/\d+ to move/);
  });

  /** viably's chart toggles and card-boxed strips, sectors' header-wrapped ones. */
  it("moves a picker, a looped strip, a boxed strip and a compact one to TabGroup", () => {
    const files = {
      "src/strips.tsx": `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@supertype.ai/foundations/blocks";

export const Metric = ({ metric, setMetric, offered }: any) => (
  <Tabs value={metric} onValueChange={(value) => setMetric(value)}>
    <TabsList className="h-7">
      {offered.map((m: any) => (
        <TabsTrigger key={m.key} value={m.key} className="px-2 text-xs tabular-nums">
          {m.label}
        </TabsTrigger>
      ))}
    </TabsList>
  </Tabs>
);

export const Boxed = () => (
  <Tabs defaultValue="a">
    <div className="rounded-lg border p-4">
      <TabsList className="mb-3 h-7">
        <TabsTrigger value="a" className="text-xs px-2">A</TabsTrigger>
        <TabsTrigger value="b" className="text-xs px-2">B</TabsTrigger>
      </TabsList>
      <TabsContent value="a"><One /></TabsContent>
      <TabsContent value="b"><Two /></TabsContent>
    </div>
  </Tabs>
);

export const Held = () => (
  <Tabs defaultValue="a">
    <div className="flex items-center md:justify-between">
      <TabsList variant="line">
        <TabsTrigger value="a">A</TabsTrigger>
      </TabsList>
    </div>
    <TabsContent value="a"><One /></TabsContent>
  </Tabs>
);

export const Guarded = ({ more, data }: any) => (
  <Tabs defaultValue="a">
    <TabsList>
      <TabsTrigger value="a">A</TabsTrigger>
      {more && <TabsTrigger value="b">B</TabsTrigger>}
    </TabsList>
    <TabsContent value="a"><One /></TabsContent>
    {data && (
      <TabsContent value="b"><Two /></TabsContent>
    )}
  </Tabs>
);
`,
    };
    const app = makeApp({ typescript: true, files });
    const { out } = run(["upgrade", "--force"], app);
    expect(source(app, "src/strips.tsx")).toBe(`import { TabGroup } from "@supertype.ai/foundations/blocks";

export const Metric = ({ metric, setMetric, offered }: any) => (
  <TabGroup
    value={metric}
    onValueChange={(value) => setMetric(value)}
    size="sm"
    tabs={offered.map((m: any) => ({ value: m.key, label: <span className="tabular-nums">{m.label}</span> }))}
  />
);

export const Boxed = () => (
  <div className="rounded-lg border p-4">
    <TabGroup
      defaultValue="a"
      size="sm"
      tabs={[
        { value: "a", label: "A", content: <One /> },
        { value: "b", label: "B", content: <Two /> },
      ]}
    />
  </div>
);

export const Held = () => (
  <TabGroup
    defaultValue="a"
    variant="line"
    tabs={[
      { value: "a", label: "A", content: <One /> },
    ]}
  />
);

export const Guarded = ({ more, data }: any) => (
  <TabGroup
    defaultValue="a"
    tabs={[
      { value: "a", label: "A", content: <One /> },
      ...(more ? [{ value: "b", label: "B", content: data && <Two /> }] : []),
    ]}
  />
);
`);
    // A move with something to look at is listed on a real run too, not only a dry one.
    expect(out).toMatch(/strips\.tsx:16\s+Tabs → TabGroup: TabGroup sets pt-2 .*the strip's bottom margin is now TabGroup's pt-2/);
    expect(out).toContain("3 to check");
  });

  // A clean tree is what lets git diff show exactly what upgrade changed.
  it("writes only on a clean tree, and previews anywhere", () => {
    const app = makeApp({ typescript: true, files: FILES });

    const refused = run(["upgrade"], app);
    expect(refused.code).toBe(1);
    expect(refused.out).toContain("not in a git repository");

    const preview = run(["upgrade", "--dry-run"], app);
    expect(preview.code).toBe(0);
    expect(preview.out).toContain("7 to move");
    expect(source(app)).toBe(BEFORE);

    expect(run(["upgrade", "--force"], app).code).toBe(0);
    expect(source(app)).toBe(AFTER);
  });

  it("takes paths, and names one that is not there", () => {
    const app = makeApp({ typescript: true, files: FILES });
    expect(run(["upgrade", "--dry-run", "src/hint.jsx"], app).out).toContain("1 to move");

    const { code, out } = run(["upgrade", "--dry-run", "src/nope"], app);
    expect(code).toBe(1);
    expect(out).toContain("src/nope does not exist");
  });

  it("says what is missing when the app has no TypeScript", () => {
    const { code, out } = run(["upgrade", "--dry-run"], makeApp({ files: { "src/card.tsx": BEFORE } }));
    expect(code).toBe(1);
    expect(out).toContain("TypeScript is not installed here");
  });

  it("is what doctor points at, and doctor stays quiet once it has run", () => {
    const stale = doctor(makeApp({ files: { "src/card.tsx": BEFORE } }));
    expect(stale.out).toContain("1 file still written for an older version");
    expect(stale.out).toContain("npx foundations upgrade");
    expect(stale.code).toBe(0);

    const current = doctor(makeApp({ files: { "src/card.tsx": AFTER.replace(/<TypographyCaption className="flex[\s\S]*?<\/TypographyCaption>\n/, "") } }));
    expect(current.out).not.toContain("older version");
  });
});
