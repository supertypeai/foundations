import {
  TypographyH2,
  TypographyProse,
  TypographyLink,
  TypographyInlineCode,
} from "@supertype.ai/foundations";
import { Cards, Card, Callout } from "@supertype.ai/foundations/blocks";
import type { Metadata } from "next";
import { Code } from "./_components/code";
import { PageTitle } from "./_components/site-header";
import { WithRouteRail } from "./_components/toc";
import { INSTALL_SPEC } from "./_components/version";
import {
  ROUTES,
  SITE_DESCRIPTION,
  SITE_TITLE,
  homeMetadata,
  seo,
} from "./_components/seo";

export const metadata: Metadata = homeMetadata;

/**
 * WebSite plus the pages under it, from the package's own `seo` entry point.
 * The `@id` anchors it emits are what let a crawler merge these into one site
 * rather than a handful of unrelated documents.
 */
const JSON_LD = [
  seo.buildWebPageJsonLd(SITE_TITLE, SITE_DESCRIPTION, "", "WebSite"),
  seo.buildItemListJsonLd(ROUTES.map(([url, name]) => ({ name, url }))),
];

const AREAS = ROUTES;

const INSTALL_CSS = `/* app/global.css */
@import "tailwindcss";
@import "@supertype.ai/foundations/tokens.css";
@import "@supertype.ai/foundations/theme.css";
@import "@supertype.ai/foundations/type.css";
@import "@supertype.ai/foundations/prose.css";
@import "@supertype.ai/foundations/shiki.css";

@source '../node_modules/@supertype.ai/foundations/dist/**/*.js';`;

const INSTALL_FONTS = `// app/layout.tsx
import { Ubuntu_Sans, Ubuntu_Sans_Mono, Average } from "next/font/google";

const sans = Ubuntu_Sans({ variable: "--font-ubuntu-sans", subsets: ["latin"] });
const mono = Ubuntu_Sans_Mono({ variable: "--font-ubuntu-sans-mono", subsets: ["latin"] });
const serif = Average({ variable: "--font-average", weight: "400", subsets: ["latin"] });

<html className={\`\${sans.variable} \${mono.variable} \${serif.variable} font-sans\`}>`;

const AGENT_POINTER = `# CLAUDE.md, AGENTS.md, or your agent's equivalent

@node_modules/@supertype.ai/foundations/llms.txt`;

export default function Home() {
  return (
    <WithRouteRail label="What is in here" routes={AREAS}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <PageTitle
        eyebrow="@supertype.ai/foundations"
        title="Better foundations"
        lede="Pre-made shadcn and tailwind components for semantic and legible interfaces. Built for the Supertype assembly line and open-source."
      />

      <section id="install" className="scroll-mt-24 pt-14">
        <TypographyH2 divider>Install</TypographyH2>
        <TypographyProse className="mt-3">
          This package ships a CLI that writes the CSS for you and performs
          diagnostic checks. The three commands below are all you need to get
          started. The first adds the package, the second writes the CSS imports
          and prints the rest, and the third checks that everything is wired up
          correctly.
        </TypographyProse>

        <div className="mt-4">
          <Code
            lang="bash"
            code={`yarn add @supertype.ai/foundations
npx foundations init      # adds and reorders the CSS imports, prints the rest
npx foundations doctor    # checks the wiring`}
          />
        </div>

        <TypographyProse className="mt-3">
          Every release is tagged as well as published, so a commit can be
          installed directly — useful for pinning ahead of a release. It is what
          this site installs:{" "}
          <TypographyInlineCode>{`"@supertype.ai/foundations": "${INSTALL_SPEC}"`}</TypographyInlineCode>
        </TypographyProse>

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
