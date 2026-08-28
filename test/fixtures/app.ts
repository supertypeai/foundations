import { mkdtempSync, mkdirSync, writeFileSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

/**
 * A throwaway consumer app for the CLI to inspect.
 *
 * The CLI reads what to expect from its own installed location, and the tests
 * run it straight out of this repo, so a fixture only needs the parts the checks
 * actually look at: a package.json, a CSS entry, a root layout, and enough of
 * node_modules to resolve versions against.
 */
export type FixtureOptions = {
  /** The dependency spec in package.json. `null` leaves the package undeclared. */
  spec?: string | null;
  css?: string | null;
  layout?: string | null;
  /** Installed peer versions. `null` removes the package entirely. */
  peers?: Record<string, string | null>;
  /** Make node_modules/@supertype/foundations a symlink, as `yarn link` would. */
  symlinked?: boolean;
  /** Nest a second copy of React inside the package. */
  nestedReact?: boolean;
  /** Extra files, keyed by path relative to the app root. */
  files?: Record<string, string>;
};

const DEFAULT_CSS = `@import "tailwindcss";
@import "@supertype/foundations/tokens.css";
@import "@supertype/foundations/theme.css";
@import "@supertype/foundations/type.css";
@import "@supertype/foundations/prose.css";

@source '../node_modules/@supertype/foundations/dist/**/*.js';
`;

const DEFAULT_LAYOUT = `import { Ubuntu_Sans, Ubuntu_Sans_Mono, Average } from "next/font/google";

const sans = Ubuntu_Sans({ variable: "--font-ubuntu-sans", subsets: ["latin"] });
const mono = Ubuntu_Sans_Mono({ variable: "--font-ubuntu-sans-mono", subsets: ["latin"] });
const serif = Average({ variable: "--font-average", weight: "400", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={\`\${sans.variable} \${mono.variable} \${serif.variable} font-sans\`}>
      <body>{children}</body>
    </html>
  );
}
`;

const DEFAULT_PEERS = {
  react: "19.1.0",
  next: "15.5.24",
  "next-view-transitions": "0.3.5",
  "@base-ui/react": "1.4.1",
};

const write = (root: string, rel: string, body: string) => {
  const file = join(root, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, body);
};

const created: string[] = [];

export function makeApp(options: FixtureOptions = {}): string {
  const root = mkdtempSync(join(tmpdir(), "foundations-fixture-"));
  created.push(root);

  const spec =
    options.spec === undefined
      ? "https://github.com/supertypeai/foundations.git#v0.1.20"
      : options.spec;

  write(
    root,
    "package.json",
    JSON.stringify(
      { name: "fixture", dependencies: spec ? { "@supertype/foundations": spec } : {} },
      null,
      2,
    ),
  );

  const css = options.css === undefined ? DEFAULT_CSS : options.css;
  if (css !== null) write(root, "app/global.css", css);

  const layout = options.layout === undefined ? DEFAULT_LAYOUT : options.layout;
  if (layout !== null) write(root, "app/layout.tsx", layout);

  for (const [name, version] of Object.entries({ ...DEFAULT_PEERS, ...options.peers })) {
    if (version === null) continue;
    write(root, `node_modules/${name}/package.json`, JSON.stringify({ name, version }));
  }

  const installed = join(root, "node_modules/@supertype/foundations");
  if (options.symlinked) {
    const real = mkdtempSync(join(tmpdir(), "foundations-linked-"));
    created.push(real);
    write(real, "dist/index.js", "export {};");
    write(real, "package.json", JSON.stringify({ name: "@supertype/foundations", version: "0.1.20" }));
    mkdirSync(dirname(installed), { recursive: true });
    symlinkSync(real, installed, "dir");
  } else {
    write(root, "node_modules/@supertype/foundations/dist/index.js", "export {};");
    write(
      root,
      "node_modules/@supertype/foundations/package.json",
      JSON.stringify({ name: "@supertype/foundations", version: "0.1.20" }),
    );
    if (options.nestedReact) {
      write(
        root,
        "node_modules/@supertype/foundations/node_modules/react/package.json",
        JSON.stringify({ name: "react", version: "19.1.0" }),
      );
    }
  }

  for (const [rel, body] of Object.entries(options.files ?? {})) write(root, rel, body);

  return root;
}

export function cleanupApps() {
  for (const dir of created.splice(0)) rmSync(dir, { recursive: true, force: true });
}
