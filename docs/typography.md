[← README](../README.md) · [Blocks](blocks.md) · [The essay shell](essay.md) · [Build-time tooling](tooling.md)

---

# Typography

Every primitive in this file imports from `@supertype/foundations`. Nothing here
needs a `"use client"` boundary.

Everything below imports from `@supertype/foundations`.

## Headings

A heading does not pick its size. `--text-h1`…`--text-h4` in `type.css` do, and
`.editorial` retunes all four together. The call site knows the level; the
surface knows the size.

| component | rung (product / editorial) | props |
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

`display` is a role, not a size: the landing-page heading that has to outrank the
same level in the docs. `divider` is a rule under the heading, and is a separate
prop precisely so a call site can reach a size without also stating a border it
has no opinion about.

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
<TypographyMuted>The same rung, secondary ink.</TypographyMuted>
<TypographyProse>Reading copy — 18px, relaxed leading, balanced wrapping.</TypographyProse>

<TypographyList variant="ui">
  <li>A list inside a tier card, on the same rung as the copy beside it.</li>
</TypographyList>

<TypographyProseList ordered>
  <li>Reading-size, numbered.</li>
</TypographyProseList>
```

A preset cannot be un-set: `<TypographyMuted tone="default">` is a type error,
not a quiet un-muting. Reach for `TypographyP` if you want the axis back.

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

Label and caption share one size scale on purpose — they are a pair (the key and
the value), and a pair that cannot be set at one size is not a pair. `inherit`
is for a run inside a heading or a chip, where the container has already picked
a size.

## Stats, code, highlight

```tsx
<TypographyStat size="display">2.4M</TypographyStat>
<TypographyStat size="panel" figures="proportional">98%</TypographyStat>

<TypographyInlineCode>pnpm dlx create-next-app</TypographyInlineCode>

<TypographyHighlight tone="sage">the part that matters</TypographyHighlight>
<TypographyHighlight tone="terracotta" seed={7}>a different swipe</TypographyHighlight>
```

`TypographyStat` — `size`: `inherit` (default) | `card` | `panel` | `page` |
`display`; `figures`: `tabular` (default) | `proportional`. `card`/`panel`/`page`
ride the heading ladder, so a stat and the heading beside it retune together on
an editorial surface. Keep `tabular` anywhere a value updates in place; a
headline figure wants `proportional`.

`TypographyHighlight` paints a felt-tip swipe as the run's own background.
`tone`: `primary` (default) | `success` | `ochre` | `terracotta` | `sage` |
`fig`. `seed` (any integer) reshapes the wobble and grain. Emphasis only — warn,
info and destructive are absent on purpose.

## Links

```tsx
<TypographyLink href="/pricing">internal, routed</TypographyLink>
<TypographyLink href="https://sectors.app" addArrow>external, opens away</TypographyLink>
<TypographyLink href="https://app.viably.app/signup" newTab={false}>start the flow here</TypographyLink>
<TypographyLink href="/docs" tone="primary">the point of the line</TypographyLink>
```

`tone`: `foreground` (default) | `primary` | `secondary`. `addArrow` appends a
glyph that follows the href — `↗` when the link leaves the site, `→` when it does
not — which is a convention, not a call site's to get wrong.

Internal versus external is decided from the `href`, never at the call site: an
href with a scheme renders a plain anchor and, if http(s), opens away with
`rel="noopener noreferrer"`; everything else routes through
`next-view-transitions`. `newTab` is the one override, for an off-site href that
starts a flow the reader should stay in.

## Rendering your own element

Two mechanisms, and the split is about what you are handing the classes to.

**A different tag** — `as`, on `TypographyEyebrow`, `TypographyCaption` and
`TypographyLabel`. One shared union (`TypographyTag`), because the classes do not
change with the tag:

```tsx
<TypographyEyebrow as="h2">Pricing</TypographyEyebrow>
```

A section named at eyebrow or label size is still the page's outline and still
owes a screen reader a heading. The alternative a consumer reaches for is a
hand-rolled `<h2 className="text-sm font-medium">`, which is the same thing
spelled by hand and free to drift from every label beside it.

**A different component** — `headingClass()` and `eyebrowClass()` return the ramp
as a string, for a caller that cannot render one of our tags at all:

```tsx
<motion.h2 layoutId={id} className={cn(headingClass(), "text-2xl")}>
<Dialog.Title className={eyebrowClass("label")}>
```

Reach for `as` when you want a tag and the function when you want a component —
and do not invent a third way, which is how five hand-rolled copies of the
heading ramp appeared the first time.

## Eyebrow

```tsx
<TypographyEyebrow>Case study</TypographyEyebrow>              {/* tone="heading" */}
<TypographyEyebrow tone="label">Monthly revenue</TypographyEyebrow>
```

`heading` (default) is primary ink at semibold — an eyebrow names the section
under it. `label` is the stat-card inversion: the figure is the headline, so the
label yields.

