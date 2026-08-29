import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, describe, expect, it } from "vitest";
import { makeApp, cleanupApps, repoPkg, DEFAULT_PEERS, DEFAULT_CSS } from "./fixtures/app.js";

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

  it("fails when no CSS entry imports tailwindcss", () => {
    const { code, out } = doctor(makeApp({ css: "body { color: red; }\n" }));
    expect(out).toContain("no CSS entry importing tailwindcss");
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

  it("adds the missing imports and the @source line", () => {
    const app = makeApp({ css: `@import "tailwindcss";\n` });
    run(["init"], app);
    const css = readCss(app);

    for (const entry of ["tokens", "theme", "type", "prose"]) {
      expect(css).toContain(`@import "@supertype.ai/foundations/${entry}.css";`);
    }
    expect(css).toContain("@source '../node_modules/@supertype.ai/foundations/dist/**/*.js';");
    // Not added: an app with no code fences should not pay for it.
    expect(css).not.toContain("shiki.css");
    expect(doctor(app).code).toBe(0);
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

  it("prints the font binding and the agent pointer", () => {
    const { out } = run(["init"], makeApp());
    expect(out).toContain("variable: \"--font-ubuntu-sans\"");
    expect(out).toContain("@node_modules/@supertype.ai/foundations/llms.txt");
  });
});
