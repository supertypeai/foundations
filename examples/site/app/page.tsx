import {
  TypographyH2,
  TypographyProse,
  TypographyLink,
  TypographyInlineCode,
} from "@supertype/foundations";
import { Cards, Card, Callout } from "@supertype/foundations/blocks";
import { Code } from "./_components/code";
import { PageTitle } from "./_components/site-header";
import { WithRouteRail } from "./_components/toc";
import { INSTALL_SPEC } from "./_components/version";

const AREAS = [
  ["/recipes", "Recipes"],
  ["/typography", "Typography"],
  ["/blocks", "Blocks"],
  ["/tokens", "Tokens"],
  ["/essay", "The essay shell"],
  ["/agents", "Coding agents"],
] as const;

const INSTALL_CSS = `/* app/global.css */
@import "tailwindcss";
@import "@supertype/foundations/tokens.css";
@import "@supertype/foundations/theme.css";
@import "@supertype/foundations/type.css";
@import "@supertype/foundations/prose.css";
@import "@supertype/foundations/shiki.css";

@source '../node_modules/@supertype/foundations/dist/**/*.js';`;

const INSTALL_FONTS = `// app/layout.tsx
import { Ubuntu_Sans, Ubuntu_Sans_Mono, Average } from "next/font/google";

const sans = Ubuntu_Sans({ variable: "--font-ubuntu-sans", subsets: ["latin"] });
const mono = Ubuntu_Sans_Mono({ variable: "--font-ubuntu-sans-mono", subsets: ["latin"] });
const serif = Average({ variable: "--font-average", weight: "400", subsets: ["latin"] });

<html className={\`\${sans.variable} \${mono.variable} \${serif.variable} font-sans\`}>`;

const AGENT_POINTER = `# CLAUDE.md, AGENTS.md, or your agent's equivalent

@node_modules/@supertype/foundations/llms.txt`;

export default function Home() {
  return (
    <WithRouteRail label="What is in here" routes={AREAS}>
      <PageTitle
        eyebrow="@supertype/foundations"
        title="Better baseline components"
        lede="The design foundations for semantic and legible interfaces. Built for the Supertype assembly line and open-source."
      />

      <section id="install" className="scroll-mt-24 pt-14">
        <TypographyH2 divider>Install</TypographyH2>
        <TypographyProse className="mt-3">
          Three steps. Get the CSS or the fonts wrong and nothing throws an
          error; the components just render unstyled, or in the wrong typeface.
          So the package ships a CLI that writes the CSS for you and checks the
          rest.
        </TypographyProse>

        <div className="mt-4">
          <Code
            lang="bash"
            code={`yarn add "@supertype/foundations@${INSTALL_SPEC}"
npx foundations init      # adds and reorders the CSS imports, prints the rest
npx foundations doctor    # checks the wiring`}
          />
        </div>

        <TypographyProse className="mt-6">
          Here is what <TypographyInlineCode>init</TypographyInlineCode> writes.
          This site uses the same block, unchanged:
        </TypographyProse>
        <div className="mt-4">
          <Code lang="css" code={INSTALL_CSS} />
        </div>

        <Callout
          tone="warn"
          title="Do not skip the @source line"
          className="mt-6"
        >
          Tailwind only generates the classes it finds in the files it scans,
          and it does not scan inside{" "}
          <TypographyInlineCode>node_modules</TypographyInlineCode> by default.
          Without this line every class the package ships gets purged and the
          components render with no styles at all. Nothing errors.
        </Callout>

        <TypographyProse className="mt-6">
          Fonts are the one part the package cannot do for you.{" "}
          <TypographyInlineCode>next/font</TypographyInlineCode> runs in your
          app and generates hashed variable names at build time, so the binding
          has to live in your layout:
        </TypographyProse>
        <div className="mt-4">
          <Code code={INSTALL_FONTS} />
        </div>
      </section>

      <section id="agents" className="scroll-mt-24 pt-14">
        <TypographyH2 divider>If you use a coding agent</TypographyH2>
        <TypographyProse className="mt-3">
          The package ships an{" "}
          <TypographyInlineCode>llms.txt</TypographyInlineCode> next to its{" "}
          <TypographyInlineCode>dist/</TypographyInlineCode>: the public API,
          the rules, and the mistakes that produce no error. Point your agent at
          it with one line and it stops hand-writing{" "}
          <TypographyInlineCode>
            text-sm text-muted-foreground
          </TypographyInlineCode>{" "}
          where a primitive already exists.
        </TypographyProse>
        <div className="mt-4">
          <Code lang="markdown" code={AGENT_POINTER} />
        </div>
        <TypographyProse className="mt-6">
          <TypographyLink href="/agents" addArrow>
            Coding agents
          </TypographyLink>{" "}
          covers what is in the file, why it cannot go stale, and the lint rules
          and <TypographyInlineCode>doctor</TypographyInlineCode> run that catch
          what it misses.
        </TypographyProse>
      </section>

      <section id="what-is-in-here" className="scroll-mt-24 pt-14">
        <TypographyH2 divider>What is in here</TypographyH2>
        <Cards className="mt-6">
          <Card
            href="/recipes"
            title="Recipes"
            description="Whole pages to copy: a hero, a pricing table, a docs page, an article index."
          />
          <Card
            href="/typography"
            title="Typography"
            description="Headings, body copy, labels, links, and how to render your own element."
          />
          <Card
            href="/blocks"
            title="Blocks"
            description="Every component that is not typography or prose, on one page: cards, callouts, steps, tabs, disclosures, rails, indexes and the editorial pieces."
          />
          <Card
            href="/tokens"
            title="Tokens"
            description="Every colour token, in both themes, plus how to repaint them."
          />
          <Card
            href="/essay"
            title="The essay shell"
            description="One article, rendered whole — the long-form surface at full page width."
          />
          <Card
            href="/agents"
            title="Coding agents"
            description="The llms.txt the package ships, the lint rules, and the wiring check to run in CI."
          />
        </Cards>

        <TypographyProse className="mt-6">
          The written reference lives in the repo:{" "}
          <TypographyLink
            href="https://github.com/supertypeai/foundations#readme"
            addArrow
          >
            the README and docs
          </TypographyLink>
          .
        </TypographyProse>
      </section>

      <section id="in-production" className="scroll-mt-24 pt-14">
        <TypographyH2 divider>In production</TypographyH2>
        <TypographyProse className="mt-3">
          Sites running the package. Both install it from a tag the same way the
          instructions above describe, so what you see there is what these
          components do at full size, on real content.
        </TypographyProse>
        <Cards className="mt-6">
          <Card
            href="https://supertype.ai"
            title="Supertype"
            description="Supertype, a regional-leading analytics engineering and data science consulting firm."
          />
          <Card
            href="https://viably.app"
            title="Viably"
            description="An observability-first business operating system and CRM for automation-obsessed teams."
          />
        </Cards>
      </section>
    </WithRouteRail>
  );
}
