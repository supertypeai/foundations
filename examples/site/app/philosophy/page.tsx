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
  { id: "decisions", label: "Utilities and decisions" },
  { id: "quiet-failures", label: "The bugs that don't throw" },
  { id: "meaning", label: "Naming tokens" },
  { id: "platform", label: "The platform first" },
  { id: "one-place", label: "One place for the rules" },
  { id: "proof", label: "Docs as a build step" },
];

const CALL_SITES = `// Decided at the call site, across three files that never see each other
<p className="text-sm text-muted-foreground">Only what the product needs to run.</p>
<p className="text-xs text-muted-foreground">Last reviewed Sep 2026</p>
<p className="block text-xs font-semibold uppercase tracking-wider">Guides</p>

// The same three, decided once
<TypographyMuted>Only what the product needs to run.</TypographyMuted>
<TypographyCaption as="p">Last reviewed Sep 2026</TypographyCaption>
<TypographyEyebrow>Guides</TypographyEyebrow>`;

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
        <EssaySection id="decisions" heading="Utilities don't store decisions">
          <TypographyProse>
            Someone types{" "}
            <TypographyInlineCode>
              text-sm text-muted-foreground
            </TypographyInlineCode>{" "}
            on the first piece of secondary copy in a new repo. It is the right
            call and it takes four seconds, and it is also the last time anybody
            thinks about it. The next person copies the nearest paragraph that
            looks close, and a year later there are a few hundred of them. Some
            of those are a step off — an{" "}
            <TypographyInlineCode>xs</TypographyInlineCode> where the rest are{" "}
            <TypographyInlineCode>sm</TypographyInlineCode>, a raw slate where
            the rest are tokens — and you cannot say which without opening every
            file.
          </TypographyProse>

          <EssayPullQuote>
            A utility class is a fine way to express a style and a poor way to
            store a decision.
          </EssayPullQuote>

          <TypographyProse>
            Nobody decided on that, it just accumulated. The utility puts the
            decision at the call site, and there are hundreds of call sites. A
            primitive puts it in one.{" "}
            <TypographyInlineCode>TypographyMuted</TypographyInlineCode> renders
            nothing you could not have written by hand; what you get is that the
            next change to secondary ink is a one-line diff instead of a
            find-and-replace you have to review.
          </TypographyProse>

          <EssayFigure caption="The same three elements, decided wherever they happen to be used, then decided once.">
            <Code code={CALL_SITES} />
          </EssayFigure>

          <TypographyProse>
            Two rules cover most of the API. Don&apos;t hand-write type styles:
            if you are reaching for{" "}
            <TypographyInlineCode>
              text-sm text-muted-foreground
            </TypographyInlineCode>
            , the primitive already exists. And retune with CSS variables rather
            than classes. The package owns its final classnames and reserves the
            right to change them, so the levers you want are the{" "}
            <TypographyInlineCode>--text-*</TypographyInlineCode>,{" "}
            <TypographyInlineCode>--heading-weight</TypographyInlineCode>, and
            the colour tokens. Patching a class works until the next release.
          </TypographyProse>
        </EssaySection>

        <EssaySection id="quiet-failures" heading="The bugs that don't throw">
          <TypographyProse>
            Three things have to be right before a component renders the way it
            should: the CSS imports in cascade order, the{" "}
            <TypographyInlineCode>@source</TypographyInlineCode> line that sends
            Tailwind into{" "}
            <TypographyInlineCode>node_modules</TypographyInlineCode>, and fonts
            bound with <TypographyInlineCode>.variable</TypographyInlineCode>{" "}
            rather than <TypographyInlineCode>.className</TypographyInlineCode>.
            Get one of them wrong and{" "}
            <TypographyHighlight tone="terracotta">
              nothing throws
            </TypographyHighlight>
            . Types pass, the build is green, and the page comes up either
            unstyled or in a typeface nobody picked, usually close enough to
            right that it gets approved.{" "}
            <TypographyInlineCode>
              @supertypeai/foundations
            </TypographyInlineCode>{" "}
            ships a CLI that writes the CSS for you and checks the rest.
            <br />
          </TypographyProse>
          <TypographyProseList>
            <li>
              <TypographyInlineCode>npx foundations init</TypographyInlineCode>{" "}
              writes the CSS block and reorders the imports you already have.
            </li>
            <li>
              <TypographyInlineCode>
                npx foundations doctor
              </TypographyInlineCode>{" "}
              reads your CSS entry, your root layout and your installed tree to
              find issues. It exits non-zero, so it can sit in CI next to your
              tests. See{" "}
              <TypographyLink href="/#install" addArrow>
                install
              </TypographyLink>
              .
            </li>
          </TypographyProseList>
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
            For a while we kept the design rules in each app. The colour rules
            got copied across by hand and stayed roughly in step; the typography
            rules never made the trip at all. By the time anyone went looking,
            one app had{" "}
            <TypographyHighlight tone="ochre" seed={7}>
              78 one-off font sizes
            </TypographyHighlight>{" "}
            in it, against rules that had been failing its sibling&apos;s builds
            for months.
          </TypographyProse>
          <TypographyProse>
            So the rules ship with the package now.{" "}
            <TypographyInlineCode>
              @supertype.ai/foundations/eslint
            </TypographyInlineCode>{" "}
            exports them as{" "}
            <TypographyInlineCode>no-restricted-syntax</TypographyInlineCode>{" "}
            selectors: plain data, no plugin, no ESLint dependency of its own.
            One line in a flat config turns them on everywhere at once.
          </TypographyProse>
          <TypographyProse>
            Contrast is handled the same way.{" "}
            <TypographyInlineCode>checkLegibility</TypographyInlineCode> sweeps
            every ink over every surface in both themes against a 4.5:1 floor,
            and it resolves the cascade instead of reading the declarations. It
            has to: a bare <TypographyInlineCode>:root</TypographyInlineCode>{" "}
            override of{" "}
            <TypographyInlineCode>--background</TypographyInlineCode> ties with{" "}
            <TypographyInlineCode>.dark</TypographyInlineCode> on specificity
            and wins in both themes. We found that out the expensive way, on a
            site whose <TypographyInlineCode>.dark</TypographyInlineCode> block
            measured a healthy 15.7:1 while the page itself rendered white on
            white.
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
