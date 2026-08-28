import { TypographyH2, TypographyProse, TypographyLink, TypographyInlineCode } from "@supertype/foundations";
import { Cards, Card, Callout } from "@supertype/foundations/blocks";
import { Code } from "./_components/code";
import { PageTitle } from "./_components/site-header";
import { WithRouteRail } from "./_components/toc";

const AREAS = [
  ["/recipes", "Recipes"],
  ["/typography", "Typography"],
  ["/blocks", "Blocks"],
  ["/tokens", "Tokens"],
  ["/essay", "The essay shell"],
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

export default function Home() {
  return (
    <WithRouteRail label="What is in here" routes={AREAS}>
      <PageTitle
        eyebrow="@supertype/foundations"
        title="The design layer, running"
        lede="Everything on this site is rendered by the package, from a Next app that installs it the same way yours would. The switches in the header turn on the dark and editorial surfaces."
      />

      <section id="install" className="scroll-mt-24 pt-14">
        <TypographyH2 divider>Install</TypographyH2>
        <TypographyProse className="mt-3">
          Three steps. Get the CSS or the fonts wrong and nothing throws an error; the
          components just render unstyled, or in the wrong typeface. So the package ships a
          CLI that writes the CSS for you and checks the rest.
        </TypographyProse>

        <div className="mt-4">
          <Code
            lang="bash"
            code={`yarn add "@supertype/foundations@https://github.com/supertypeai/foundations.git#v0.1.20"
npx foundations init      # writes the CSS block, prints the font binding
npx foundations doctor    # checks the wiring`}
          />
        </div>

        <TypographyProse className="mt-6">
          Here is what <TypographyInlineCode>init</TypographyInlineCode> writes. This site
          uses the same block, unchanged:
        </TypographyProse>
        <div className="mt-4">
          <Code lang="css" code={INSTALL_CSS} />
        </div>

        <Callout tone="warn" title="Do not skip the @source line" className="mt-6">
          Tailwind only generates the classes it finds in the files it scans, and it does not
          scan inside <TypographyInlineCode>node_modules</TypographyInlineCode> by default.
          Without this line every class the package ships gets purged and the components
          render with no styles at all. Nothing errors.
        </Callout>

        <TypographyProse className="mt-6">
          Fonts are the one part the package cannot do for you.{" "}
          <TypographyInlineCode>next/font</TypographyInlineCode> runs in your app and
          generates hashed variable names at build time, so the binding has to live in your
          layout:
        </TypographyProse>
        <div className="mt-4">
          <Code code={INSTALL_FONTS} />
        </div>
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
            description="Cards, callouts, steps, tabs and the two disclosure components."
          />
          <Card
            href="/tokens"
            title="Tokens"
            description="Every colour token, in both themes, plus how to repaint them."
          />
        </Cards>

        <TypographyProse className="mt-6">
          The written reference lives in the repo:{" "}
          <TypographyLink href="https://github.com/supertypeai/foundations#readme" addArrow>
            the README and docs
          </TypographyLink>
          .
        </TypographyProse>
      </section>
    </WithRouteRail>
  );
}
