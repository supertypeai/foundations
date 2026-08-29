import type { Metadata } from "next";
import { TypographyInlineCode, TypographyLink } from "@supertype/foundations";
import { Code } from "../_components/code";
import { Demo } from "../_components/demo";
import { Section, SectionGroup } from "../_components/section";
import { PageTitle } from "../_components/site-header";
import { WithGroupedToc } from "../_components/toc";
import CardDemo from "../_demos/cards";
import Callouts from "../_demos/callouts";
import StepsDemo from "../_demos/steps";
import TabsDemo from "../_demos/tabs";
import AccordionDemo from "../_demos/accordion";
import DisclosureDemo from "../_demos/disclosure";
import RailDemo from "../_demos/rail";
import ContentsDemo from "../_demos/contents";
import ReadingRailDemo from "../_demos/reading-rail";
import MarkdownHelpersDemo from "../_demos/markdown-helpers";
import EssayColumnsDemo from "../_demos/essay-columns";
import MovementsDemo from "../_demos/movements";
import PostMetaDemo from "../_demos/post-meta";

export const metadata: Metadata = { title: "Blocks" };

/**
 * Everything the package exports that is not typography or prose, on one page.
 *
 * The split by import subpath is real — `/blocks` and `/essay` are separate
 * entry points — but it is the package's business, not the reader's. Someone
 * looking for a table of contents should not have to guess that it ships under
 * essay, so the groups state the subpath and the index lists them all together.
 */
const GROUPS = [
  {
    id: "content",
    label: "Content",
    entries: [
      { id: "card", label: "Card" },
      { id: "callout", label: "Callout" },
      { id: "steps", label: "Steps" },
      { id: "disclosure", label: "Disclosure" },
      { id: "accordion", label: "Accordion" },
      { id: "tabs", label: "Tabs" },
    ],
  },
  {
    id: "navigation",
    label: "Indexes and rails",
    entries: [
      { id: "rail", label: "Rail" },
      { id: "contents", label: "TableOfContents" },
      { id: "reading", label: "ReadingRail" },
      { id: "progress", label: "ReadingProgressBar" },
    ],
  },
  {
    id: "editorial",
    label: "Editorial",
    entries: [
      { id: "columns", label: "EssayColumns" },
      { id: "movements", label: "EssayMovements" },
      { id: "meta", label: "Post meta" },
      { id: "shell", label: "The essay shell" },
    ],
  },
  {
    id: "functions",
    label: "Helpers",
    entries: [
      { id: "markdown", label: "Headings from markdown" },
      { id: "hooks", label: "Scroll hooks" },
    ],
  },
];

const PROGRESS_BAR = `import { ReadingProgressBar } from "@supertype/foundations/essay";

export default function ArticleLayout({ children }) {
  return (
    <>
      {/* Fixed to the top of the viewport. Render one per page, above your header. */}
      <ReadingProgressBar />
      {children}
    </>
  );
}`;

const HOOKS = `"use client";

import { useScrollSpy, useReadingProgress } from "@supertype/foundations/essay";

export function MyRail({ ids }: { ids: string[] }) {
  // Returns the id of the topmost heading on screen. The hook keys on the
  // joined ids, so building the array inline each render is fine.
  const active = useScrollSpy(ids);

  // Returns 0 to 1. All callers on a page share a single scroll listener.
  const progress = useReadingProgress();

  return <p>{active} · {Math.round(progress * 100)}%</p>;
}`;

const SHELL = `import {
  EssayHeader,
  EssayLayout,
  EssaySection,
  EssayPullQuote,
  EssayFigure,
  EssayDocument,
  createEssay,
} from "@supertype/foundations/essay";

// Sections as data. The margin index is derived from them, so renaming a
// heading updates its rail link automatically.
<EssayDocument
  eyebrow="Engineering"
  title="What we learned shipping to forty workspaces"
  sections={[{ heading: "The queue", body: "Three months, one migration." }]}
/>;

// createEssay binds your own motion and decoration components once. Call it at
// module scope: each call defines new component types, and calling it during a
// render would remount the tree on every pass.
const { EssayHeader: Decorated } = createEssay({ Reveal, Glow });`;

export default function BlocksPage() {
  return (
    <WithGroupedToc groups={GROUPS}>
      <PageTitle
        eyebrow="Reference"
        title="Blocks"
        lede="Every component outside typography and prose. They ship from two import subpaths; each group lists the one it comes from."
      />

      <SectionGroup
        id="content"
        title="Content"
        from="@supertype/foundations/blocks"
        note="Components that sit inside prose. Tabs and Accordion are client components built on Base UI. Everything else renders on the server."
      />

      <Section
        id="card"
        title="Card"
        note="Pass title and description for the default layout, or compose the slots directly for full control. An href makes the whole card a link; an href with a scheme opens in a new tab."
      >
        <Demo source="app/_demos/cards.tsx">
          <CardDemo />
        </Demo>
      </Section>

      <Section
        id="callout"
        title="Callout"
        note={
          <>
            Two variants. <TypographyInlineCode>compact</TypographyInlineCode> is sized to sit
            inside a panel or sidebar. <TypographyInlineCode>editorial</TypographyInlineCode>{" "}
            sets the body at reading size and adds an accent rail, for docs and long-form
            pages.
          </>
        }
      >
        <Demo source="app/_demos/callouts.tsx">
          <Callouts />
        </Demo>
      </Section>

      <Section
        id="steps"
        title="Steps"
        note="A numbered sequence. Numbers come from a CSS counter, so reordering steps renumbers them automatically, and the digits are excluded from copied text and from the accessibility tree."
      >
        <Demo source="app/_demos/steps.tsx">
          <StepsDemo />
        </Demo>
      </Section>

      <Section
        id="disclosure"
        title="Disclosure"
        note="Expandable content built on the native <details> element: no JavaScript required, and correct before hydration. Set a shared name to make a group single-open, handled by the browser rather than React state."
      >
        <Demo source="app/_demos/disclosure.tsx">
          <DisclosureDemo />
        </Demo>
      </Section>

      <Section
        id="accordion"
        title="Accordion"
        note="Use Accordion when you need animated transitions or controlled selection; otherwise Disclosure is lighter. Requires theme.css for the open and close keyframes — without it, panels snap open."
      >
        <Demo source="app/_demos/accordion.tsx">
          <AccordionDemo />
        </Demo>
      </Section>

      <Section
        id="tabs"
        title="Tabs"
        note="TabsList takes a variant. default renders a boxed segmented track; line drops the surface and underlines the active tab, as in the preview and code switcher on this page."
      >
        <Demo source="app/_demos/tabs.tsx">
          <TabsDemo />
        </Demo>
      </Section>

      <SectionGroup
        id="navigation"
        title="Indexes and rails"
        from="@supertype/foundations/essay"
        note="Indexes, rails, and reading progress. They ship from the essay entry point but are not essay-only — this page builds its own margin index from them."
      />

      <Section
        id="rail"
        title="Rail and RailLink"
        note={
          <>
            The primitive behind every index in the package: a list with a rule down its
            side. On <TypographyInlineCode>RailLink</TypographyInlineCode>,{" "}
            <TypographyInlineCode>active</TypographyInlineCode> highlights an item,{" "}
            <TypographyInlineCode>nested</TypographyInlineCode> indents a sub-heading, and{" "}
            <TypographyInlineCode>render</TypographyInlineCode> swaps the anchor for a router
            link. Uses no client hooks, so it works in a server component.
          </>
        }
      >
        <Demo source="app/_demos/rail.tsx">
          <RailDemo />
        </Demo>
      </Section>

      <Section
        id="contents"
        title="TableOfContents"
        note={
          <>
            A margin index that highlights the current section with a scroll spy. Pass{" "}
            <TypographyInlineCode>sections</TypographyInlineCode> as{" "}
            <TypographyInlineCode>{"{ id, label }"}</TypographyInlineCode> matching the ids on
            your headings. <TypographyInlineCode>label</TypographyInlineCode> renames the rail
            heading; pass <TypographyInlineCode>null</TypographyInlineCode> to hide it. An
            empty list renders nothing. The examples below spy on this page, so they update as
            you scroll.
          </>
        }
      >
        <Demo source="app/_demos/contents.tsx">
          <ContentsDemo />
        </Demo>
      </Section>

      <Section
        id="reading"
        title="ReadingRail"
        note={
          <>
            TableOfContents plus a progress donut, for pages that are read start to finish
            rather than scanned. Takes{" "}
            <TypographyInlineCode>TocHeading[]</TypographyInlineCode> —{" "}
            <TypographyInlineCode>{"{ depth, id, label }"}</TypographyInlineCode>, the shape{" "}
            <TypographyInlineCode>extractHeadings</TypographyInlineCode> returns. Headings at
            depth 3 are indented.
          </>
        }
      >
        <Demo source="app/_demos/reading-rail.tsx">
          <ReadingRailDemo />
        </Demo>
      </Section>

      <Section
        id="progress"
        title="ReadingProgressBar"
        note="A hairline progress indicator fixed to the top of the viewport, for the widths where the rail is hidden. Mount one per page, above your header. It shares a single scroll listener with ReadingRail, so using both costs one subscription. Not previewed here: it would track this page rather than the example."
      >
        <div className="mt-4">
          <Code code={PROGRESS_BAR} />
        </div>
      </Section>

      <SectionGroup
        id="editorial"
        title="Editorial"
        from="@supertype/foundations/essay"
        note="Layout, meta, and the shell that composes them. Use the individual pieces for MDX articles, and EssayDocument when the content is data."
      />

      <Section
        id="columns"
        title="EssayColumns"
        note="A three-track grid — margin, measure, and an aside column that is often empty. Keeping the third track reserved holds the prose on the same axis whether or not a page has asides. The measure widens per breakpoint; the aside is hidden below lg."
      >
        <Demo source="app/_demos/essay-columns.tsx">
          <EssayColumnsDemo />
        </Demo>
      </Section>

      <Section
        id="movements"
        title="EssayMovements"
        note="An ordered list for stages that feed into one another — a pipeline, a method, a sequence of phases. Use it instead of a card grid when the order carries meaning."
      >
        <Demo source="app/_demos/movements.tsx">
          <MovementsDemo />
        </Demo>
      </Section>

      <Section
        id="meta"
        title="Post meta"
        note={
          <>
            The byline row under an article title.{" "}
            <TypographyInlineCode>PostMetaRow</TypographyInlineCode> lays out{" "}
            <TypographyInlineCode>PostDate</TypographyInlineCode>,{" "}
            <TypographyInlineCode>ReadTime</TypographyInlineCode> and{" "}
            <TypographyInlineCode>TagPills</TypographyInlineCode>, separated by{" "}
            <TypographyInlineCode>MetaDot</TypographyInlineCode>. Dates format in en-US on both
            server and client, which avoids a locale mismatch at hydration. Use{" "}
            <TypographyInlineCode>formatPostDate</TypographyInlineCode> for the same output
            outside React, such as in an OG image or a feed.
          </>
        }
      >
        <Demo source="app/_demos/post-meta.tsx">
          <PostMetaDemo />
        </Demo>
      </Section>

      <Section
        id="shell"
        title="The essay shell"
        note={
          <>
            <TypographyInlineCode>EssayHeader</TypographyInlineCode>,{" "}
            <TypographyInlineCode>EssayLayout</TypographyInlineCode>,{" "}
            <TypographyInlineCode>EssaySection</TypographyInlineCode>,{" "}
            <TypographyInlineCode>EssayPullQuote</TypographyInlineCode> and{" "}
            <TypographyInlineCode>EssayFigure</TypographyInlineCode> compose an article by
            hand. <TypographyInlineCode>EssayDocument</TypographyInlineCode> takes the sections
            as data instead and builds the margin index from them. See{" "}
            <TypographyLink href="/essay" addArrow>
              a rendered essay
            </TypographyLink>{" "}
            for what they look like at full page width.
          </>
        }
      >
        <div className="mt-4">
          <Code code={SHELL} />
        </div>
      </Section>

      <SectionGroup
        id="functions"
        title="Helpers"
        from="@supertype/foundations/essay"
        note="The functions that produce heading data for the rails, and the two hooks they run on."
      />

      <Section
        id="markdown"
        title="Headings from markdown"
        note={
          <>
            <TypographyInlineCode>extractHeadings</TypographyInlineCode> pulls h2 and h3 from
            raw markdown, ignoring fenced code. It needs no DOM and no compiled MDX, so it runs
            at build time. Ids come from{" "}
            <TypographyInlineCode>createSlugger</TypographyInlineCode>, which follows GitHub's
            algorithm and therefore matches the ids rehype-slug adds to your headings.{" "}
            <TypographyInlineCode>readingTime</TypographyInlineCode> skips code blocks, which
            otherwise inflate the estimate on technical posts. The output below was generated
            at build time.
          </>
        }
      >
        <Demo source="app/_demos/markdown-helpers.tsx">
          <MarkdownHelpersDemo />
        </Demo>
      </Section>

      <Section
        id="hooks"
        title="Scroll hooks"
        note="The hooks behind TableOfContents and ReadingRail, exported so you can build your own. useScrollSpy tracks a list of heading ids with a single IntersectionObserver. useReadingProgress returns 0 to 1 from a shared store, so any number of callers on a page share one scroll listener."
      >
        <div className="mt-4">
          <Code code={HOOKS} />
        </div>
      </Section>
    </WithGroupedToc>
  );
}
