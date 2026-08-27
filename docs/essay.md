[← README](../README.md) · [Typography](typography.md) · [Blocks](blocks.md) · [Build-time tooling](tooling.md)

---

# The essay shell

`@supertype/foundations/essay` — the long-form reading surface, and the pieces
an MDX article composes instead.

`@supertype/foundations/essay` carries the long-form reading surface — any page a
reader arrives at to read from the top rather than to scan for one thing.

```tsx
// lib/essay.ts
import { createEssay } from "@supertype/foundations/essay";

export const {
  EssayHeader, EssayLayout, EssaySection, EssayPullQuote,
  EssayFigure, EssayMovements, EssayDocument,
} = createEssay({ Reveal, Glow });   // both optional
```

`createEssay` is the one factory left, and it earns its keep where the link and
card factories did not: motion and gradient belong to an app's visual language,
so the injected values genuinely differ per consumer. Both default to nothing, so
an app that supplies neither gets identical markup, statically rendered. viably
passes its two; ssite passes none — and the undecorated bindings are exported
directly if you want them without calling the factory.

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

`EssayHeader` sets its own measure and is deliberately full-bleed, so the opening
can carry a backdrop edge to edge while the prose stays in column. Put it *above*
`EssayLayout`, not inside.

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

The margin index derives from the sections rather than being hand-kept beside
them — which is how a retitled section used to leave the rail scrolling to
nothing. Anchors are slugified with apostrophes dropped, so "What we don't
collect" lands at `what-we-dont-collect`, and duplicates are suffixed. Pass an
explicit `id` only when the anchor has to outlive a retitling; it is a public URL.

## An MDX article

Its sections come from the markdown headings, so it composes the pieces instead:

```tsx
import { extractHeadings, readingTime, EssayColumns, ReadingRail,
         PostMetaRow, PostDate, ReadTime, TagPills, MetaDot } from "@supertype/foundations/essay";

const headings = extractHeadings(source);   // TocHeading[] — { id, label, depth }
const minutes = readingTime(source);        // words / 200, rounded up

<EssayHeader eyebrow="Notes" title={frontmatter.title} />
<EssayColumns aside={<div className="sticky top-24"><ReadingRail headings={headings} /></div>}>
  <PostMetaRow>
    <PostDate date={frontmatter.date} format="long" />
    <MetaDot />
    <ReadTime minutes={minutes} icon={ClockIcon} />
    <MetaDot />
    <TagPills tags={frontmatter.tags} />
  </PostMetaRow>
  {content}
</EssayColumns>
```

Also exported: `TableOfContents` (the static margin index), `ReadingProgressBar`,
`Rail`/`RailLink` (the rail's own primitives), `formatPostDate` (the same
formatter outside React, so an OG image and a card cannot disagree),
`createSlugger`, and the `useReadingProgress` / `useScrollSpy` hooks. `ReadingRail`
and `ReadingProgressBar` read shared stores, so mounting both costs one scroll
subscription, not two.

`EssayColumns` is three tracks with the third empty: two would push the prose
off-centre the moment an aside appeared, setting body copy on a different axis
per page.

