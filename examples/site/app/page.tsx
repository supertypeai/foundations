import {
  TypographyH2,
  TypographyProse,
  TypographyLink,
  TypographyInlineCode,
} from "@supertype.ai/foundations";
import { Cards, Card, Callout } from "@supertype.ai/foundations/blocks";
import type { Metadata } from "next";
import { Code } from "./_components/code";
import { ContrastHeadline, ContrastProof } from "./_components/contrast-proof";
import { PageTitle } from "./_components/site-header";
import { WithRouteRail } from "./_components/toc";
import {
  ROUTES,
  SITE_DESCRIPTION,
  SITE_TITLE,
  homeMetadata,
  seo,
} from "./_components/seo";

export const metadata: Metadata = homeMetadata;

/**
 * WebSite plus the pages under it, from the package's `seo` entry point. Its
 * `@id` anchors are what let a crawler merge them into one site.
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

const sans = Ubuntu_Sans({
  variable: "--font-ubuntu-sans",
  subsets: ["latin"],
});
const mono = Ubuntu_Sans_Mono({
  variable: "--font-ubuntu-sans-mono",
  subsets: ["latin"],
});
const serif = Average({
  variable: "--font-average",
  weight: "400",
  subsets: ["latin"],
});

const fonts = \`\${sans.variable} \${mono.variable} \${serif.variable}\`;

<html className={\`\${fonts} font-sans\`}>`;

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
          Install it with three commands: add the package, initialize the CSS,
          and run the wiring check.
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
          Every release is tagged and published, so you can pin a specific
          commit ahead of the next release.
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
          Tailwind generates only the classes it finds in the files it scans,
          and skips <TypographyInlineCode>node_modules</TypographyInlineCode> by
          default. Leave this line out and the package&rsquo;s utility classes
          get purged from the build. The components render bare, with no error.
        </Callout>

        <TypographyProse className="mt-6">
          Fonts are the one part you wire up yourself.{" "}
          <TypographyInlineCode>next/font</TypographyInlineCode> runs in your
          app and hashes its variable names at build time, so the binding
          belongs in your layout:
        </TypographyProse>
        <div className="mt-4">
          <Code code={INSTALL_FONTS} />
        </div>
      </section>

      <section id="agents" className="scroll-mt-24 pt-14">
        <TypographyH2 divider>If you use a coding agent</TypographyH2>
        <TypographyProse className="mt-3">
          The package ships an{" "}
          <TypographyInlineCode>llms.txt</TypographyInlineCode> alongside its{" "}
          <TypographyInlineCode>dist/</TypographyInlineCode>: the public API,
          the rules, and the common mistakes that leave a build looking fine.
          One line is enough to point an agent at it, so it stops writing{" "}
          <TypographyInlineCode>
            text-sm text-muted-foreground
          </TypographyInlineCode>{" "}
          when a primitive already exists.
        </TypographyProse>
        <div className="mt-4">
          <Code lang="markdown" code={AGENT_POINTER} />
        </div>
        <TypographyProse className="mt-6">
          <TypographyLink href="/agents" addArrow>
            Coding agents
          </TypographyLink>{" "}
          covers what is in the file, how it stays current, and the lint rules
          and <TypographyInlineCode>doctor</TypographyInlineCode> run that catch
          what it misses.
        </TypographyProse>
      </section>

      <section id="contrast" className="scroll-mt-24 pt-14">
        <TypographyH2 divider>Contrast you can check</TypographyH2>
        <TypographyProse className="mt-3">
          A WCAG ratio scores both polarities alike. Swap the ink and the ground
          and it reports the same figure, while on screen dark glyphs on a
          bright field thin out and light glyphs on a dark field bloat. The two
          specimens below carry the same ratio to a tenth, both clear AA, and
          read half a ramp apart.
        </TypographyProse>

        <ContrastProof className="mt-6" />

        <TypographyProse className="mt-6">
          So the package measures its palette twice.{" "}
          <TypographyInlineCode>contrast</TypographyInlineCode> answers the
          compliance question and{" "}
          <TypographyInlineCode>lc</TypographyInlineCode> answers the design
          one: whether your secondary ink is meaningfully quieter than your
          primary, and whether it survived the trip to dark. Both read the
          resolved cascade, so what gets measured is the page a browser paints.
        </TypographyProse>

        <div className="mt-6">
          <ContrastHeadline />
        </div>

        <TypographyProse className="mt-6">
          <TypographyInlineCode>checkLegibility</TypographyInlineCode> and{" "}
          <TypographyInlineCode>checkSignals</TypographyInlineCode> hold those
          floors across both themes in CI. Every figure above was computed at
          build time from the stylesheet this site installs, including the two
          ratios in that row: the same tertiary ink measures 3.44:1 in light and
          6.75:1 in dark, and reads 59.5 Lc against 47.8.{" "}
          <TypographyLink href="/tokens#measuring" addArrow>
            Two measures
          </TypographyLink>{" "}
          has the maths and the call sites.
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
            description="Cards, callouts, steps, tabs, disclosures, rails, indexes and the editorial pieces, on one page."
          />
          <Card
            href="/tokens"
            title="Tokens"
            description="Every colour token, in both themes, how to repaint them, and the two measures that keep them legible."
          />
          <Card
            href="/essay"
            title="The essay shell"
            description="One article rendered whole, the long-form surface at full page width."
          />
          <Card
            href="/agents"
            title="Coding agents"
            description="The bundled llms.txt, the lint rules, and the wiring check to run in CI."
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
          Sites running the package. Both install it from a tag, the way the
          instructions above describe, so you are seeing these components at
          full size on real content.
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
