[← README](../README.md) · [Blocks](blocks.md) · [The essay shell](essay.md) · [Build-time tooling](tooling.md) · [The CLI](cli.md)

---

# Typography

Everything here imports from `@supertype.ai/foundations`, and none of it needs a
`"use client"` boundary.

## Headings

You pick the level, the type ramp picks the size. `--text-h1` through
`--text-h4` in `type.css` set the sizes, and `.editorial` retunes all four
together.

| component      | size (product / editorial) | props                              |
| -------------- | -------------------------- | ---------------------------------- |
| `TypographyH1` | 22px / 36px                | `variant?: "default" \| "display"` |
| `TypographyH2` | 18px / 30px                | `variant?`, `divider?: boolean`    |
| `TypographyH3` | 16px / 24px                | `variant?: "default" \| "display"` |
| `TypographyH4` | 14px / 20px                | —                                  |

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

| component         | renders                                                                   |
| ----------------- | ------------------------------------------------------------------------- |
| `TypographyP`     | `variant?: "ui" \| "prose"` (default `ui`), `tone?: "default" \| "muted"` |
| `TypographyMuted` | `TypographyP` with `tone` pinned to `muted`                               |
| `TypographyProse` | `TypographyP` at reading size, muted                                      |
| `TypographyList`  | `variant?: "ui" \| "prose"` (default `ui`), `ordered?: boolean`           |

```tsx
<TypographyP>Interface copy, 13px.</TypographyP>
<TypographyMuted>The same size, secondary ink.</TypographyMuted>
<TypographyProse>Reading copy — 18px, relaxed leading, balanced wrapping.</TypographyProse>

<TypographyList>
  <li>A list inside a tier card, at the same size as the copy beside it.</li>
</TypographyList>

<TypographyList variant="prose" ordered>
  <li>Reading-size, numbered.</li>
</TypographyList>
```

The pinned props are removed from the type, so `<TypographyMuted tone="default">`
will not compile. Use `TypographyP` when you need to set the tone yourself.

## Meta and labels

| component           | props                                              | use                                              |
| ------------------- | -------------------------------------------------- | ------------------------------------------------ |
| `TypographyCaption` | `size?: "sm" \| "xs" \| "2xs" \| "inherit"`, `as?` | timestamps, counts, bylines, the value in a key/value row, small print |
| `TypographyLabel`   | `size?: "sm" \| "xs" \| "2xs" \| "inherit"`, `as?` | form labels, column headers, the key             |

```tsx
<TypographyLabel as="p" size="xs">Workspace</TypographyLabel>
<TypographyCaption size="xs">Updated 3 minutes ago</TypographyCaption>
<TypographyCaption as="small" className="block">Rates exclude tax.</TypographyCaption>
```

Labels and captions share one size scale. They usually appear together as a key
and its value, and the two should be set at the same size. Use `inherit` inside
a heading or a chip when the container already picks the size.

The component is the look and `as` is the element, chosen by what the words are:
the default `span` beside their subject, `p` for a note on a line of its own,
`small` for small print (a disclaimer, terms, a copyright line). `<small>` is
inline, so give it `block` when it stands on its own line.

**Caption or muted copy.** `TypographyMuted` and a `TypographyCaption` at its
default size are set in the same rung and ink, and they are different roles. Muted
copy is the content, said quietly: a sentence explaining a setting, an empty
state's second line. A caption is about something else: when it happened, how
many, who wrote it, the value beside a key, the terms under a price. Ask whether
the words are the content or about it. The roles part where that matters: a
caption has three rungs and states its weight, so it stays regular inside a
label's line; muted copy has the body's rungs, `prose` included.

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
`fig`. They carry emphasis, not status; use the set for emphasis, not warning,
info, or destructive states.

`seed` is any integer, `3` by default. It is a pattern selector, not a size or a
strength; `41` is a different swipe, not a heavier one. It seeds the
deterministic noise that decides where along the run the felt tip wobbled and
where the grain dragged, so the same seed always paints the same swipe (server
and browser included) and a different one repaints it without touching the hue.
Vary it when the same phrase is highlighted more than once on a page; leave it
alone otherwise.

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

There are two patterns, depending on whether you need a different tag or a
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

**A heading-like style** — `headingFace` is the face and weight alone, for text
that wears the heading type without being part of the outline. A pull quote, a
stat, a lockup:

```tsx
<blockquote className={cn(headingFace, "text-h2 leading-snug")}>
```

`headingClass()` is the wrong tool here. It carries `scroll-m-20` for an anchor a
blockquote does not have and a `first:mt-0` reset for a margin it does not set,
so it claims a level in a ladder the element does not belong to. Use the face and
name your own rung.

## Eyebrow

```tsx
<TypographyEyebrow>Case study</TypographyEyebrow>              {/* tone="heading" */}
<TypographyEyebrow tone="brand">Case study</TypographyEyebrow>
<TypographyEyebrow tone="label">Monthly revenue</TypographyEyebrow>
<TypographyEyebrow tone="muted">Awaiting review</TypographyEyebrow>
<TypographyEyebrow tone="subtle" size="3xs">Source</TypographyEyebrow>
```

`heading` (default) is primary ink at semibold, for an eyebrow that names the
section under it. `brand` is the same rung in the app's identity hue
(`--brand-ink`, falling back to `--primary-ink`), for a kicker that ties the
section to the brand rather than to the page. `label` is the inverse, for a stat card where the figure is the
headline and the label should stay quiet. `muted` is the dense product default,
a micro-label over a group of controls. `subtle` is a rung quieter again, for a
column head or a rail marker the reader takes in on the way past.

Each tone carries the rung it is usually set at, and `size` overrides that where
the surface needs another: `sm`, `xs`, `2xs`, `3xs`. Omit it and the tone's own
rung stands; the prop only changes things where it is passed.

## Marks

A mark is anything set beside words to name them: an icon, a checkbox, a status
dot, a tick on the picked row. There is one way to place one. Pass it to the words:

```tsx
<TypographyLabel mark={<Icons.Clock />}>Nothing collected yet</TypographyLabel>
<TypographyCaption markEnd={<Icons.ChevronDown />}>90 days</TypographyCaption>
```

Every text role takes `mark` and `markEnd`, headings included. The role renders
the mark in a slot inside its own element, so the slot reads the words' own size.
A bare glyph in it is one em, the rung the words are set at, and its centre sits
on the middle of the first line's capitals. The slot is one cap tall and its
baseline is its bottom edge, so it rests on the words' baseline and nothing is
measured from the line box: leading, zoom and the browser's rounding of ascent
and descent leave it where it is. A checkbox or a dot keeps its own size and
takes the same seat. The slot sizes only a bare glyph, its direct child, so
anything composed (a checkbox and its tick, a wrapper of your own) sizes itself.

The two sides differ on purpose. A leading mark starts the line and the words
fill the rest, wrapping in their own column so a second line starts under the
first. An end mark follows the words, as an arrow follows "Configure";
`justify-between` sends it to the row's edge instead, as a checkbox at a card's
edge wants.

The marked row is a grid unless you name another display, so `inline-flex` or
`hidden sm:flex` still work; its alignment is the mark's, so an `items-` class
on it does nothing. A `gap-x-` class
changes the space beside the mark, and `truncate` cuts the words, never the mark.

When lines under a title belong to it, `Marked` gives the title the mark and puts
the lines in its words' column:

```tsx
<Marked
  mark={<Icons.CheckCircle />}
  title={<TypographyLabel>Discount applied</TypographyLabel>}
  className="gap-x-3"
>
  <TypographyCaption as="p">20% off the first year.</TypographyCaption>
</Marked>
```

A glyph inside a sentence, or in words no role renders (a line of code, a menu
item's label), goes in `<Mark>`, the same slot on its own:

```tsx
<p>Open the <Mark><Icons.Settings /></Mark> settings menu.</p>
```

In a row, give the element that sets the words' size `items-baseline` and put
the `<Mark>` in it beside them, so it reads their size from there.

Controls own their glyphs by the same rule. `Button` and `Badge` size a glyph
passed as a direct child, and `TabGroup` a tab's `icon`, to one em of the label and centre it on
the label's letters, so it takes no class. Lint flags a size on a glyph in a
mark, a `<Mark>` or a control as inert, a glyph passed loose into a text role, and
a glyph held into line with a top margin or `align-middle`.

Two things beside words are not marks. A glyph standing alone, an icon-only link
or button, names no words and keeps its own size. An object taller than the
line, an avatar or a reading-progress ring, would overflow a slot one cap tall
into the lines around it, so the words centre on it instead, in an
`items-center` row with `CAP_TRIM` on the words:

```tsx
<div className="flex items-center gap-2">
  <Avatar className="size-8" />
  <TypographyLabel className={CAP_TRIM}>Ada Lovelace</TypographyLabel>
</div>
```

`CAP_TRIM` does that job and one other: a line of text centred in a box of its
own, like an avatar's initials or a date in a calendar cell. It makes the element as tall
as its ink, so `items-center` centres what the reader sees. The trimmed box ends
at the baseline, so it does not suit a label that clips its descenders. Firefox
has no `text-box` yet and keeps the untrimmed box.
