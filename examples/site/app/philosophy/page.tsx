import type { Metadata } from "next";
import {
  TypographyHighlight,
  TypographyInlineCode,
  TypographyLink,
  TypographyProse,
  TypographyProseList,
} from "@supertype.ai/foundations";
import {
  EssayFigure,
  EssayHeader,
  EssayLayout,
  EssayPullQuote,
  EssaySection,
  type EssayIndexEntry,
} from "@supertype.ai/foundations/essay";
import { Code } from "../_components/code";
import { ContrastProof } from "../_components/contrast-proof";
import { PAGES } from "../_components/pages";
import { pageMetadata, seo } from "../_components/seo";

export const metadata: Metadata = pageMetadata("philosophy");

const INDEX: EssayIndexEntry[] = [
  { id: "decisions", label: "Primitives and decisions" },
  { id: "quiet-failures", label: "Setting up the CSS" },
  { id: "meaning", label: "Naming tokens" },
  { id: "platform", label: "The platform first" },
  { id: "one-place", label: "One place for the rules" },
  { id: "contrast", label: "Contrast, measured" },
  { id: "proof", label: "Docs as a build step" },
];

const CALL_SITES = `<TypographyMuted>Only what the product needs to run.</TypographyMuted>
<TypographyCaption as="p">Last reviewed Sep 2026</TypographyCaption>
<TypographyEyebrow>Guides</TypographyEyebrow>`;

/** The standard config for the design rules. One spread, because `designRules`
 * assembles the whole set in one place. */
const LINT_CONFIG = `// eslint.config.js
import { designRules } from "@supertype.ai/foundations/eslint";

export default [
  {
    files: ["app/**/*.tsx", "components/**/*.tsx"],
    rules: {
      "no-restricted-syntax": [
        "error",
        ...designRules({ accents: "the brand tints", weights: true }),
      ],
    },
  },
];`;

/** The page headline is longer than the nav label, so it keeps its own title. */
const TITLE = "Why foundations";

/** Shared with the tab and the card so the schema stays consistent with them. */
const { description } = PAGES.find((page) => page.slug === "philosophy")!;

/** The byline printed on the page and the same person named in the schema. */
const AUTHOR = { name: "Samuel Chan", url: "https://supertype.ai/p/samuel" };

export default function PhilosophyPage() {
  const schema = seo.buildWebPageJsonLd(
    TITLE,
    description,
    "philosophy",
    "AboutPage",
    AUTHOR,
  );

  return (
    <article className="pt-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <EssayHeader
        eyebrow="Principles"
        title={TITLE}
        lede="Foundations pulls our design patterns and typography into one layer that installs with our React apps. Sane defaults, applied the same way in every repo, so whatever we ship starts from the same baseline."
        byline={`${AUTHOR.name}, Supertype`}
      />

      <EssayLayout index={INDEX}>
        <EssaySection id="decisions" heading="Primitives store decisions">
          <TypographyProse>
            Three roles every page needs constantly: secondary copy, a
            timestamp, a section label. Each primitive renders markup you could
            have written by hand. The payoff comes at the next change to
            secondary ink, which is then a one-line diff in the package instead
            of a find-and-replace across your app.
          </TypographyProse>

          <EssayFigure caption="Reach for the primitive whenever the style carries a meaning. The decision then lives in one place.">
            <Code code={CALL_SITES} />
          </EssayFigure>

          <EssayPullQuote>
            A utility class is a fine way to express a style but a poor way to
            store a decision.
          </EssayPullQuote>

          <TypographyProse>
            Spelled as{" "}
            <TypographyInlineCode>
              text-sm text-muted-foreground
            </TypographyInlineCode>{" "}
            instead, the decision sits at the call site, and a year in you have
            a few hundred call sites drifting a step apart. Two rules keep that
            from starting. When you are about to hand-write a type style, look
            for the primitive first. When you want to retune, reach for the CSS
            variables: the <TypographyInlineCode>--text-*</TypographyInlineCode>{" "}
            scale, <TypographyInlineCode>--heading-weight</TypographyInlineCode>
            , the colour tokens. The package owns its final classnames and
            reserves the right to change them.
          </TypographyProse>
        </EssaySection>

        <EssaySection id="quiet-failures" heading="Two commands set up the CSS">
          <TypographyProseList>
            <li>
              <TypographyInlineCode>npx foundations init</TypographyInlineCode>{" "}
              writes the CSS block and reorders the imports you already have.
            </li>
            <li>
              <TypographyInlineCode>
                npx foundations doctor
              </TypographyInlineCode>{" "}
              reads your CSS entry, your root layout and your installed tree,
              then exits non-zero on a problem, so it can sit in CI next to your
              tests.
            </li>
          </TypographyProseList>
          <TypographyProse>
            Three things have to be right before a component renders the way it
            should: the CSS imports in cascade order, the{" "}
            <TypographyInlineCode>@source</TypographyInlineCode> line that sends
            Tailwind into{" "}
            <TypographyInlineCode>node_modules</TypographyInlineCode>, and fonts
            bound with <TypographyInlineCode>.variable</TypographyInlineCode>{" "}
            instead of <TypographyInlineCode>.className</TypographyInlineCode>.
            If any of them are off, the build still passes and the types still
            look fine, which is why the{" "}
            <TypographyHighlight tone="terracotta">
              doctor check is the one that catches it
            </TypographyHighlight>
            . The{" "}
            <TypographyLink href="/#install" addArrow>
              install
            </TypographyLink>{" "}
            section has both commands in context.
          </TypographyProse>
        </EssaySection>

        <EssaySection
          id="meaning"
          heading="Tokens are named for meaning, not colour"
        >
          <TypographyProse>
            The token is <TypographyInlineCode>--success</TypographyInlineCode>,
            never <TypographyInlineCode>--green</TypographyInlineCode>. Render
            success in blue and the name still reads true; move the brand and
            the component layer keeps its vocabulary. The package defines the
            structural roles only: background, foreground, card, muted, primary,
            border, ring, and the status set. Your brand colours stay in your
            app. Install them by overriding the raw variables after the imports,
            leaving the utilities alone.
          </TypographyProse>
          <TypographyProse>
            <TypographyInlineCode>.editorial</TypographyInlineCode> came out of
            the same thinking. A heading size is a ratio to the body text
            underneath it, so the same{" "}
            <TypographyInlineCode>TypographyH2</TypographyInlineCode> renders at
            18px on a dense product screen and 30px in an essay to say the same
            thing. <TypographyInlineCode>.editorial</TypographyInlineCode>{" "}
            retunes the whole ladder and hands the heading role to the serif at
            weight 400, because Average only ships the one weight. Put it on a
            div, a route group, or{" "}
            <TypographyInlineCode>&lt;html&gt;</TypographyInlineCode>. There is
            a switch for it in the header of this site if you want to see what
            it does to this page. The{" "}
            <TypographyLink href="/tokens" addArrow>
              tokens
            </TypographyLink>{" "}
            page has the full palette.
          </TypographyProse>
        </EssaySection>

        <EssaySection id="platform" heading="Use the platform first">
          <TypographyProse>
            <TypographyInlineCode>Disclosure</TypographyInlineCode> is a{" "}
            <TypographyInlineCode>&lt;details&gt;</TypographyInlineCode> and a{" "}
            <TypographyInlineCode>&lt;summary&gt;</TypographyInlineCode>. No
            JavaScript, correct before hydration, keyboard-accessible because
            the browser handles that part. It works from a markdown file too,
            where you have no call site to pass props to.{" "}
            <TypographyInlineCode>Accordion</TypographyInlineCode> and{" "}
            <TypographyInlineCode>Tabs</TypographyInlineCode> use Base UI, which
            leaves the keyboard handling, focus management and ARIA attributes
            to a team that maintains them full time.
          </TypographyProse>
          <TypographyProse>
            Structure lives in CSS. A host framework can swap its own element in
            for yours and drop the classes on the way through. A child
            combinator in our stylesheet survives that.
          </TypographyProse>
        </EssaySection>

        <EssaySection id="one-place" heading="One place for the rules">
          <TypographyProse>
            The design rules ship with the package, so every app enforces the
            same set from one line of config.
          </TypographyProse>

          <EssayFigure caption="designRules returns every rule as one array, for one no-restricted-syntax entry.">
            <Code code={LINT_CONFIG} lang="js" />
          </EssayFigure>

          <TypographyProse>
            The rules are{" "}
            <TypographyInlineCode>no-restricted-syntax</TypographyInlineCode>{" "}
            selectors: plain data, no plugin, no ESLint dependency of their own.
            Spread <TypographyInlineCode>designRules</TypographyInlineCode>{" "}
            instead if you are on{" "}
            <TypographyInlineCode>.eslintrc</TypographyInlineCode> or composing
            the rule yourself.
          </TypographyProse>
        </EssaySection>

        <EssaySection
          id="contrast"
          heading="Contrast is arithmetic, so we do it"
        >
          <TypographyProse>
            Contrast ships as functions for the same reason the rules do.{" "}
            <TypographyInlineCode>checkLegibility</TypographyInlineCode> checks
            every ink against every surface in both themes using a 4.5:1 floor,
            resolving the cascade the way a browser would. A bare{" "}
            <TypographyInlineCode>:root</TypographyInlineCode> override of{" "}
            <TypographyInlineCode>--background</TypographyInlineCode> ties with{" "}
            <TypographyInlineCode>.dark</TypographyInlineCode> on specificity
            and wins in{" "}
            <TypographyHighlight tone="ochre" seed={7}>
              both themes at once
            </TypographyHighlight>
            , so a <TypographyInlineCode>.dark</TypographyInlineCode> block that
            measures 15.7:1 on its own can still render white on white.
          </TypographyProse>

          <EssayPullQuote>
            Measure the two blocks separately and you have measured an
            intention.
          </EssayPullQuote>

          <TypographyProse>
            A ratio has a second blind spot: it treats both directions the same,
            even though dark text on a bright field looks thinner and light text
            on a dark field often looks heavier. That is why the package also
            computes Lc, the APCA measure WCAG 3 is built on, which uses{" "}
            <TypographyHighlight tone="sage">
              two exponent pairs, one per polarity
            </TypographyHighlight>
            .
          </TypographyProse>

          <EssayFigure caption="The same ratio to a tenth, both clearing AA, half a ramp apart to read. Under them, this site's own ramp in both themes: the light column steps 19 then 20 Lc, the dark column steps 18 then 30 and drops its tertiary ink to 47.8 while the ratio for that rung reads nearly double the light theme's.">
            <ContrastProof show="both" />
          </EssayFigure>

          <TypographyProse>
            Every figure in that panel is computed at build time from the
            stylesheet this site installs, by the same two functions your app
            gets. Ratios answer the audit;{" "}
            <TypographyInlineCode>lc</TypographyInlineCode> answers whether your
            secondary ink is quieter than your primary, and whether it stayed
            that way in dark. The{" "}
            <TypographyLink href="/tokens#measuring" addArrow>
              tokens
            </TypographyLink>{" "}
            page has the arithmetic and the call sites.
          </TypographyProse>
        </EssaySection>

        <EssaySection id="proof" heading="The documentation is a build step">
          <TypographyProse>
            This site, this page included, is built with{" "}
            <TypographyInlineCode>
              @supertype.ai/foundations
            </TypographyInlineCode>
            . It installs{" "}
            <TypographyInlineCode>
              @supertype.ai/foundations
            </TypographyInlineCode>{" "}
            from a git tag the same way our production apps do, and its{" "}
            <TypographyInlineCode>global.css</TypographyInlineCode> and{" "}
            <TypographyInlineCode>layout.tsx</TypographyInlineCode> are the
            install snippets from the README, unchanged.
          </TypographyProse>
          <TypographyProse>
            <TypographyLink href="/recipes">Recipes</TypographyLink> holds whole
            pages instead of single components, each one a complete file that
            imports from the package alone. The build fails if a recipe reaches
            for a local helper, which keeps every example runnable outside this
            repo.
          </TypographyProse>
          <TypographyProse>
            Most of the code that ends up using this package gets written by an
            agent, so it also ships an{" "}
            <TypographyInlineCode>llms.txt</TypographyInlineCode> covering the
            public API, the rules, and the mistakes that produce no error.{" "}
            <TypographyInlineCode>yarn build</TypographyInlineCode> fails if an
            export is missing from it, and one line in your{" "}
            <TypographyInlineCode>AGENTS.md</TypographyInlineCode> is usually
            enough to keep an agent from hand-writing{" "}
            <TypographyInlineCode>
              text-sm text-muted-foreground
            </TypographyInlineCode>{" "}
            where a primitive exists. That is the{" "}
            <TypographyLink href="/agents" addArrow>
              agents
            </TypographyLink>{" "}
            page.
          </TypographyProse>
          <TypographyProse>
            These are small decisions, made once and applied at the places where
            a codebase starts to drift. To try it, start at{" "}
            <TypographyLink href="/#install" addArrow>
              install
            </TypographyLink>
            . For a whole page ahead of a component list, go to{" "}
            <TypographyLink href="/recipes" addArrow>
              recipes
            </TypographyLink>{" "}
            first.
          </TypographyProse>
        </EssaySection>
      </EssayLayout>
    </article>
  );
}
