[← README](../README.md) · [Blocks](blocks.md) · [The essay shell](essay.md) · [Build-time tooling](tooling.md) · [The CLI](cli.md)

---

# Typography

Everything here imports from `@supertype.ai/foundations`, and none of it needs a
`"use client"` boundary.

## Headings

You pick the level, the type ramp picks the size. `--text-h1` through
`--text-h4` in `type.css` set the sizes, and `.editorial` retunes all four
together.

| component | size (product / editorial) | props |
|---|---|---|
| `TypographyH1` | 22px / 36px | `variant?: "default" \| "display"` |
| `TypographyH2` | 18px / 30px | `variant?`, `divider?: boolean` |
| `TypographyH3` | 16px / 24px | `variant?: "default" \| "display"` |
| `TypographyH4` | 14px / 20px | — |

```tsx
<TypographyH1>Settings</TypographyH1>
<TypographyH1 variant="display">Ship faster with less ceremony</TypographyH1>

<TypographyH2 divider>Billing</TypographyH2>   {/* rule under the heading */}

<TypographyH3 variant="display">Featured post</TypographyH3>  {/* the lead card in a grid */}
<TypographyH4>Connected accounts</TypographyH4>               {/* a panel title */}
```

Use `display` for a heading that has to outrank the same level somewhere else,
like a landing page against the docs. `divider` draws a rule underneath, kept as
a separate prop so you can pick a size without committing to a border.

## Body copy

| component | renders |
|---|---|
| `TypographyP` | `variant?: "ui" \| "prose"` (default `ui`), `tone?: "default" \| "muted"` |
| `TypographyMuted` | `TypographyP` with `tone` pinned to `muted` |
| `TypographyProse` | `TypographyP` at reading size, muted |
| `TypographyList` | `variant?: "ui" \| "prose"`, `ordered?: boolean` |
| `TypographyProseList` | `TypographyList` with `variant` pinned to `prose` |

```tsx
<TypographyP>Interface copy, 13px.</TypographyP>
<TypographyMuted>The same size, secondary ink.</TypographyMuted>
<TypographyProse>Reading copy — 18px, relaxed leading, balanced wrapping.</TypographyProse>

<TypographyList variant="ui">
  <li>A list inside a tier card, at the same size as the copy beside it.</li>
</TypographyList>

<TypographyProseList ordered>
  <li>Reading-size, numbered.</li>
</TypographyProseList>
```

The pinned props are removed from the type, so `<TypographyMuted tone="default">`
will not compile. Use `TypographyP` when you need to set the tone yourself.

## Meta and labels

| component | props | use |
|---|---|---|
| `TypographyCaption` | `size?: "sm" \| "xs" \| "2xs" \| "inherit"`, `as?` | timestamps, counts, the value in a key/value row |
| `TypographySmall` | same, `as` pinned to `p` | small print as a block |
| `TypographyLabel` | `size?: "sm" \| "xs" \| "2xs" \| "inherit"`, `as?` | form labels, column headers, the key |

```tsx
<TypographyLabel as="p" size="xs">Workspace</TypographyLabel>
<TypographyCaption size="xs">Updated 3 minutes ago</TypographyCaption>
<TypographySmall>Rates exclude tax.</TypographySmall>
```

Labels and captions share one size scale because they usually appear together as
a key and its value, and those two should be set at the same size. Use `inherit`
inside a heading or a chip, where the container has already picked a size.

## Stats, code, highlight

```tsx
<TypographyStat size="display">2.4M</TypographyStat>
<TypographyStat size="panel" figures="proportional">98%</TypographyStat>

<TypographyInlineCode>pnpm dlx create-next-app</TypographyInlineCode>

<TypographyHighlight tone="sage">the part that matters</TypographyHighlight>
<TypographyHighlight tone="terracotta" seed={7}>a different swipe</TypographyHighlight>

{/* one tone, three swipes: same hue, three shapes */}
<TypographyHighlight tone="sage">default, seed 3</TypographyHighlight>
<TypographyHighlight tone="sage" seed={12}>same sage, wobbles elsewhere</TypographyHighlight>
<TypographyHighlight tone="sage" seed={41}>same sage again</TypographyHighlight>
```

`TypographyStat` takes `size`: `inherit` (default), `card`, `panel`, `page` or
`display`, and `figures`: `tabular` (default) or `proportional`. The `card`,
`panel` and `page` sizes ride the heading ladder, so a stat retunes along with
the heading next to it on an editorial surface. Keep figures tabular anywhere a
value updates in place, since tabular digits do not shift width. A headline
figure usually looks better proportional.

`TypographyHighlight` paints a felt-tip swipe as the background of the run it
wraps. `tone` is `primary` (default), `success`, `ochre`, `terracotta`, `sage` or
`fig`. They carry emphasis, not status, so there is no `warn`, `info` or
`destructive` tone.

`seed` is any integer, `3` by default. It is not a size or a strength — `41` is
not a heavier swipe than `3`, only a different one. It seeds the deterministic
noise that decides where along the run the felt tip wobbled and where the grain
dragged, so the same seed always paints the same swipe (server and browser
included) and a different one repaints it without touching the hue. Vary it when
the same phrase is highlighted more than once on a page; leave it alone
otherwise.

The words keep their own lightness and borrow the swipe's hue, so a `color` set
on the children only contributes its lightness. That lightness comes from
`--marker-ink`, a deepened `--foreground`; override it on the element to make a
run lighter or heavier than the default.

## Links

```tsx
<TypographyLink href="/pricing">internal, routed</TypographyLink>
<TypographyLink href="https://sectors.app" addArrow>external, opens away</TypographyLink>
<TypographyLink href="https://app.viably.app/signup" newTab={false}>start the flow here</TypographyLink>
<TypographyLink href="/docs" tone="primary">the point of the line</TypographyLink>
```

`tone` is `foreground` (default), `primary` or `secondary`. `addArrow` appends a
glyph that matches the destination: `↗` when the link leaves the site, `→` when
it does not.

The `href` decides whether a link is internal or external, so a call site cannot
get it wrong — and it is the same decision `Button`, `Badge` and `Card` make,
from the same function (`resolveLink`, see
[Links](./blocks.md#links)). A scheme renders a plain anchor, an http(s) one
opens away with `rel="noopener noreferrer"`, a `#hash` stays a plain anchor, and
everything else routes through `next-view-transitions`. `newTab={false}` is for
an off-site href that starts a flow the reader should stay inside; `external`
overrides the sniff itself.

## Rendering your own element

There are two options, depending on whether you need a different tag or a
different component.

**A different tag** — the `as` prop, on `TypographyEyebrow`, `TypographyCaption`
and `TypographyLabel`. They share one union (`TypographyTag`), since the classes
do not change with the tag:

```tsx
<TypographyEyebrow as="h2">Pricing</TypographyEyebrow>
```

A section named at eyebrow or label size is still part of the page outline and
still owes a screen reader a heading. The usual alternative is a hand-rolled
`<h2 className="text-sm font-medium">` — the same result written by hand, and
free to drift from every label next to it.

**A different component** — `headingClass()` and `eyebrowClass()` return the ramp
as a string, for a caller that cannot render one of our tags:

```tsx
<motion.h2 layoutId={id} className={cn(headingClass(), "text-2xl")}>
<Dialog.Title className={eyebrowClass("label")}>
```

Use `as` when you want a different tag and the function when you want a different
component. Please do not add a third way: the last time these were hand-rolled we
ended up with five slightly different copies of the heading styles.

**Something that is not a heading** — `headingFace` is the face and weight alone,
for text that wears the heading type without being part of the outline. A pull
quote, a stat, a lockup:

```tsx
<blockquote className={cn(headingFace, "text-h2 leading-snug")}>
```

`headingClass()` is not the tool there. It carries `scroll-m-20` for an anchor a
blockquote does not have and a `first:mt-0` reset for a margin it does not set,
and taking it means claiming a level in a ladder the element is not on. Take the
face and name your own rung.

## Eyebrow

```tsx
<TypographyEyebrow>Case study</TypographyEyebrow>              {/* tone="heading" */}
<TypographyEyebrow tone="label">Monthly revenue</TypographyEyebrow>
<TypographyEyebrow tone="muted">Awaiting review</TypographyEyebrow>
<TypographyEyebrow tone="subtle" size="3xs">Source</TypographyEyebrow>
```

`heading` (default) is primary ink at semibold, for an eyebrow that names the
section under it. `label` is the inverse, for a stat card where the figure is the
headline and the label should stay quiet. `muted` is the dense product default,
a micro-label over a group of controls. `subtle` is a rung quieter again, for a
column head or a rail marker the reader takes in on the way past.

Each tone carries the rung it is usually set at, and `size` overrides that where
the surface needs another: `sm`, `xs`, `2xs`, `3xs`. Omit it and the tone's own rung
stands, so the prop changes nothing anywhere it is not passed.
