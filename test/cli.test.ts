import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, describe, expect, it } from "vitest";
import { makeApp, cleanupApps } from "./fixtures/app.js";

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
@import "@supertype/foundations/tokens.css";
@import "@supertype/foundations/theme.css";
@import "@supertype/foundations/type.css";
@import "@supertype/foundations/prose.css";
`,
    });
    const { code, out } = doctor(app);
    expect(out).toContain("no @source line for the package");
    expect(code).toBe(1);
  });

  it("fails when the CSS imports are out of order", () => {
    const app = makeApp({
      css: `@import "tailwindcss";
@import "@supertype/foundations/type.css";
@import "@supertype/foundations/tokens.css";
@import "@supertype/foundations/theme.css";
@import "@supertype/foundations/prose.css";

@source '../node_modules/@supertype/foundations/dist/**/*.js';
`,
    });
    const { code, out } = doctor(app);
    expect(out).toContain("is imported out of order");
    expect(code).toBe(1);
  });

  it("warns, without failing, when theme.css is absent", () => {
    const app = makeApp({
      css: `@import "tailwindcss";
@import "@supertype/foundations/tokens.css";
@import "@supertype/foundations/type.css";
@import "@supertype/foundations/prose.css";

@source '../node_modules/@supertype/foundations/dist/**/*.js';
`,
    });
    const { code, out } = doctor(app);
    expect(out).toContain("theme.css is not imported");
    expect(out).toContain("1 warning");
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

  it("warns about an unpinned dependency", () => {
    const { out, code } = doctor(makeApp({ spec: "https://github.com/supertypeai/foundations.git#main" }));
    expect(out).toContain("not pinned to a tag");
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
@import "@supertype/foundations/tokens.css";
@import "@supertype/foundations/theme.css";
@import "@supertype/foundations/type.css";
@import "@supertype/foundations/prose.css";

@source '../node_modules/@supertype/foundations/dist/**/*.js';

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
@import "@supertype/foundations/tokens.css";
@import "@supertype/foundations/theme.css";
@import "@supertype/foundations/type.css";
@import "@supertype/foundations/prose.css";

@source '../node_modules/@supertype/foundations/dist/**/*.js';

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

  it("treats a commented-out import as missing", () => {
    const app = makeApp({
      css: `@import "tailwindcss";
@import "@supertype/foundations/tokens.css";
/* @import "@supertype/foundations/theme.css"; */
@import "@supertype/foundations/type.css";
@import "@supertype/foundations/prose.css";

@source '../node_modules/@supertype/foundations/dist/**/*.js';
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
      expect(css).toContain(`@import "@supertype/foundations/${entry}.css";`);
    }
    expect(css).toContain("@source '../node_modules/@supertype/foundations/dist/**/*.js';");
    // Not added: an app with no code fences should not pay for it.
    expect(css).not.toContain("shiki.css");
    expect(doctor(app).code).toBe(0);
  });

  it("repairs the order and keeps a trailing comment with its import", () => {
    const app = makeApp({
      css: `@import "tailwindcss";
@import "@supertype/foundations/type.css";  /* the type ramp */
@import "@supertype/foundations/tokens.css";
@import "@supertype/foundations/prose.css";

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
    expect(css).toContain(`@import "@supertype/foundations/type.css";  /* the type ramp */`);
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
/* @import "@supertype/foundations/theme.css"; */
`,
    });
    run(["init"], app);
    const css = readCss(app);
    expect(css).toContain(`/* @import "@supertype/foundations/theme.css"; */`);
    // One live import plus the commented one.
    expect(css.match(/@import "@supertype\/foundations\/theme\.css";/g)).toHaveLength(2);
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
    expect(out).toContain("@node_modules/@supertype/foundations/llms.txt");
  });
});
