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
import { PAGES } from "../_components/pages";
import { pageMetadata, seo } from "../_components/seo";

export const metadata: Metadata = pageMetadata("philosophy");

const INDEX: EssayIndexEntry[] = [
  { id: "decisions", label: "Primitives and decisions" },
  { id: "quiet-failures", label: "Setting up the CSS" },
  { id: "meaning", label: "Naming tokens" },
  { id: "platform", label: "The platform first" },
  { id: "one-place", label: "One place for the rules" },
  { id: "proof", label: "Docs as a build step" },
];

const CALL_SITES = `<TypographyMuted>Only what the product needs to run.</TypographyMuted>
<TypographyCaption as="p">Last reviewed Sep 2026</TypographyCaption>
<TypographyEyebrow>Guides</TypographyEyebrow>`;

/** The whole install for the design rules. One entry, one `no-restricted-syntax`,
 *  because flat config replaces a rule's options rather than merging them. */
const LINT_CONFIG = `// eslint.config.js
import { designConfig } from "@supertype.ai/foundations/eslint";

export default [
  ...designConfig({ accents: "the brand tints", weights: true }),
];`;

/** Longer than the nav label, so the page keeps its own headline. */
const TITLE = "Why foundations";

/** Shared with the tab and the card, so the schema cannot disagree with them. */
const { description } = PAGES.find((page) => page.slug === "philosophy")!;

/** The byline the page prints, and the same person the schema names. */
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
            Three roles a page needs constantly — secondary copy, a
            timestamp, a section label — and the three primitives that carry
            them. Each renders nothing you could not have written by hand. What
            you get is that the next change to secondary ink is a one-line diff
            in the package rather than a find-and-replace you have to review.
          </TypographyProse>

          <EssayFigure caption="Reach for the primitive whenever the style carries a meaning. The decision lives in one place.">
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
            instead, the decision sits at the call site, and a year in there are
            a few hundred call sites drifting a step apart from each other. Two
            rules keep that from starting. If you are about to hand-write a type
            style, the primitive already exists. And retune with CSS variables
            — the <TypographyInlineCode>--text-*</TypographyInlineCode> scale,{" "}
            <TypographyInlineCode>--heading-weight</TypographyInlineCode>, the
            colour tokens — rather than classes, since the package owns its
            final classnames and reserves the right to change them.
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
              and exits non-zero, so it can sit in CI next to your tests.
            </li>
          </TypographyProseList>
          <TypographyProse>
            Three things have to be right before a component renders the way it
            should: the CSS imports in cascade order, the{" "}
            <TypographyInlineCode>@source</TypographyInlineCode> line that sends
            Tailwind into{" "}
            <TypographyInlineCode>node_modules</TypographyInlineCode>, and fonts
            bound with <TypographyInlineCode>.variable</TypographyInlineCode>{" "}
            rather than <TypographyInlineCode>.className</TypographyInlineCode>.
            None of the three throws when it is wrong — types pass and the
            build is green — so{" "}
            <TypographyHighlight tone="terracotta">
              doctor is what tells you
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
            <TypographyInlineCode>--success</TypographyInlineCode> is not{" "}
            <TypographyInlineCode>--green</TypographyInlineCode>. If your
            product renders success in blue the token still reads correctly, and
            when the brand moves, nothing in the component layer needs renaming.
            So the package ships structural roles only: background, foreground,
            card, muted, primary, border, ring, and the status set. There are no
            brand colours anywhere in it. Yours belong to your app, and you
            install them by overriding the raw variables after the imports
            rather than by patching utilities.
          </TypographyProse>
          <TypographyProse>
            <TypographyInlineCode>.editorial</TypographyInlineCode> came out of
            the same thinking. A heading size is a ratio to the body text
            underneath it, not a number in a table, so one{" "}
            <TypographyInlineCode>TypographyH2</TypographyInlineCode> has to
            render at 18px in the first and 30px in the second to mean the same
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
            the browser handles that part, and it works from a markdown file
            where there is no call site to pass props to.{" "}
            <TypographyInlineCode>Accordion</TypographyInlineCode> and{" "}
            <TypographyInlineCode>Tabs</TypographyInlineCode> use Base UI, so we
            don't have to maintain the keyboard handling, focus management, and
            ARIA attributes ourselves.
          </TypographyProse>
          <TypographyProse>
            Structure lives in CSS. A host framework can substitute its own
            element for yours and drop the classes on the way through; it cannot
            do much about a child combinator in our stylesheet.
          </TypographyProse>
        </EssaySection>

        <EssaySection id="one-place" heading="One place for the rules">
          <TypographyProse>
            The design rules ship with the package, so every app enforces the
            same set from one line of config.
          </TypographyProse>

          <EssayFigure caption="designConfig returns a single flat-config entry holding a single no-restricted-syntax rule.">
            <Code code={LINT_CONFIG} lang="js" />
          </EssayFigure>

          <TypographyProse>
            They are{" "}
            <TypographyInlineCode>no-restricted-syntax</TypographyInlineCode>{" "}
            selectors and nothing more — plain data, no plugin, no ESLint
            dependency of its own. Spread{" "}
            <TypographyInlineCode>designRules</TypographyInlineCode> instead if
            you are on <TypographyInlineCode>.eslintrc</TypographyInlineCode> or
            composing the rule yourself.
          </TypographyProse>

          <TypographyProse>
            Contrast ships the same way.{" "}
            <TypographyInlineCode>checkLegibility</TypographyInlineCode> sweeps
            every ink over every surface in both themes against a 4.5:1 floor,
            and it resolves the cascade rather than reading the declarations —
            a bare <TypographyInlineCode>:root</TypographyInlineCode> override of{" "}
            <TypographyInlineCode>--background</TypographyInlineCode> ties with{" "}
            <TypographyInlineCode>.dark</TypographyInlineCode> on specificity and
            wins in{" "}
            <TypographyHighlight tone="ochre" seed={7}>
              both themes at once
            </TypographyHighlight>
            , so a{" "}
            <TypographyInlineCode>.dark</TypographyInlineCode> block that
            measures 15.7:1 on its own can still render white on white.
          </TypographyProse>

          <EssayPullQuote>
            Measure the two blocks separately and you have measured an
            intention, not a page.
          </EssayPullQuote>
        </EssaySection>

        <EssaySection id="proof" heading="The documentation is a build step">
          <TypographyProse>
            This site (and this page, naturally) is built using{" "}
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
            pages rather than single components, and each one is a complete file
            that imports only from the package. The build fails if a recipe
            reaches for a local helper, otherwise you end up with examples that
            only run inside this repo.
          </TypographyProse>
          <TypographyProse>
            Most of the code that ends up using this package will not be typed
            by a person, so it also ships an{" "}
            <TypographyInlineCode>llms.txt</TypographyInlineCode> covering the
            public API, the rules, and the mistakes that produce no error.{" "}
            <TypographyInlineCode>yarn build</TypographyInlineCode> fails if an
            export is missing from it, and one line in your{" "}
            <TypographyInlineCode>AGENTS.md</TypographyInlineCode> is usually
            enough to stop an agent hand-writing{" "}
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
            None of this is clever. They are small decisions, made once and
            readily deployed in the places where a codebase begins to drift. If
            you want to try it, start at{" "}
            <TypographyLink href="/#install" addArrow>
              install
            </TypographyLink>
            ; if you would rather read a whole page than a component list, go to{" "}
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
