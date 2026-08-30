[← README](../README.md) · [Typography](typography.md) · [Blocks](blocks.md) · [Build-time tooling](tooling.md) · [The CLI](cli.md)

---

# The essay shell

`@supertype.ai/foundations/essay` holds the long-form reading surface: any page
someone arrives at to read from the top rather than to scan for one thing. It
also exports the individual pieces, which an MDX article composes directly.

```tsx
// lib/essay.ts
import { createEssay } from "@supertype.ai/foundations/essay";

export const {
  EssayHeader, EssayLayout, EssaySection, EssayPullQuote,
  EssayFigure, EssayMovements, EssayDocument,
} = createEssay({ Reveal, Glow });   // both optional
```

`createEssay` is the one factory left in the package. Motion and gradient belong
to an app's visual language, so the injected values really do differ per
consumer: viably passes its two, ssite passes none. Both default to nothing, so
an app that supplies neither gets identical markup, rendered statically. If you
have no decorations, skip the factory — the undecorated bindings are exported
directly.

## A hand-built essay

```tsx
<article>
  <EssayHeader
    eyebrow="Engineering"
    title="What we learned shipping to 40 workspaces"
    lede="Three months, one migration, and a queue that would not drain."
    byline="Samuel Chan · for teams running their own infrastructure"
  />
  <EssayLayout index={[{ id: "queue", label: "The queue" }]}>
    <EssaySection id="queue" heading="The queue">
      <TypographyProse>…</TypographyProse>
      <EssayPullQuote>One per essay. A page with three has decided nothing.</EssayPullQuote>
      <EssayFigure caption="Backlog, by hour">{chart}</EssayFigure>
    </EssaySection>
  </EssayLayout>
</article>
```

`EssayHeader` sets its own measure and runs full-bleed, so the opening can carry
a backdrop edge to edge while the prose stays in its column. Put it *above*
`EssayLayout`, not inside it.

## A reference document

```tsx
<EssayDocument
  eyebrow="Legal"
  title="Privacy"
  sections={[
    { heading: "What we collect", body: "Only what the product needs to run." },
    { heading: "What we don't collect", body: <TypographyProse>…</TypographyProse> },
  ]}
/>
```

The margin index is derived from the sections rather than kept in a list beside
them, so renaming a section cannot leave the rail pointing at an anchor that no
longer exists.

Anchors are slugified with apostrophes dropped, so "What we don't collect" lands
at `what-we-dont-collect`, and duplicates get a numeric suffix. Pass an explicit
`id` when an anchor has to survive a retitling, since it is a public URL.

## An MDX article

Its sections come from the markdown headings, so it composes the pieces rather
than using the whole shell:

```tsx
import { extractHeadings, readingTime, ReadingLayout,
         PostMetaRow, PostDate, ReadTime, TagPills, MetaDot } from "@supertype.ai/foundations/essay";

const headings = extractHeadings(source);   // TocHeading[] — { id, label, depth }
const minutes = readingTime(source);        // words / 200, rounded up

<EssayHeader eyebrow="Notes" title={frontmatter.title} />
<ReadingLayout headings={headings}>
  <PostMetaRow>
    <PostDate date={frontmatter.date} format="long" />
    <MetaDot />
    <ReadTime minutes={minutes} icon={ClockIcon} />
    <MetaDot />
    <TagPills tags={frontmatter.tags} />
  </PostMetaRow>
  {content}
</ReadingLayout>
```

`ReadingLayout` is `EssayLayout`'s counterpart for a body the app supplies whole:
the same column and the same sticky margin, with the scroll-spied `ReadingRail`
in place of the declared-section index. It drops the rail when a piece has no
headings, so a short post gets a centred measure rather than a margin holding an
empty nav. Reach for `EssayColumns` and `EssayAside` directly only when the
margin holds something that is not a rail — and open the body with `EssayBody`
when you do, since that is the one piece that rules the seam under a header. Both
layouts already use it, and nothing else in the package draws that line.

Also exported: `TableOfContents` (the static margin index), `EssayAside` (the
sticky positioner both layouts put in the margin), `ReadingProgressBar`,
`Rail` and `RailLink` (the rail's own primitives), `formatPostDate` (the same
formatter outside React, so an OG image and a card cannot print different dates),
`createSlugger`, and the `useReadingProgress` and `useScrollSpy` hooks.

`ReadingRail` and `ReadingProgressBar` read from shared stores, so mounting both
costs one scroll subscription rather than two.

The rail is a container query, not a media query: the margin only appears once
the shell has 72rem to place it in, which is the width its own three tracks were
drawn for. Mount it in something narrower — a docs page with its own column —
and it drops the rail and sets the prose centred, rather than drawing a margin
too thin to hold a label.

`EssayColumns` is three tracks with the third left empty. With two, the prose
would shift off-centre as soon as a page had an aside, which sets body copy on a
different axis from one page to the next.
