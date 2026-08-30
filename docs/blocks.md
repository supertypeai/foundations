[← README](../README.md) · [Typography](typography.md) · [The essay shell](essay.md) · [Build-time tooling](tooling.md) · [The CLI](cli.md)

---

# Blocks

Content blocks from `@supertype.ai/foundations/blocks`, plus the MDX map that makes
them available in markdown.

`Tabs` and `Accordion` are client components (Base UI); everything else renders
on the server.

## Card

Two shapes, one component. Pass `title` and `description` for the common case, or
compose the slots yourself when you need more.

```tsx
{
  /* Shorthand — what MDX authors write */
}
<Card
  href="/notes/streaming-pipelines"
  title="Build a streaming pipeline"
  description="Kafka in, warehouse out, four parts."
  icon={<DatabaseIcon className="size-4" />}
/>;

{
  /* Composed */
}
<Card>
  <CardHeader>
    <CardTitle>Usage</CardTitle>
    <CardDescription>Billing period to date</CardDescription>
  </CardHeader>
  <CardContent>
    <TypographyStat size="panel">18,204</TypographyStat>
  </CardContent>
</Card>;

{
  /* A grid of them */
}
<Cards>
  <Card title="One" href="/one" />
  <Card title="Two" href="/two" />
</Cards>;
```

| prop                             | type             | notes                              |
| -------------------------------- | ---------------- | ---------------------------------- |
| `href`                           | `string`         | present ⇒ the whole card is a link |
| `external`                       | `boolean`        | overrides the scheme sniff         |
| `title` / `description` / `icon` | `ReactNode`      | the shorthand header               |
| everything else                  | anchor/div props | passed through                     |

An href with a scheme leaves the app, with `target="_blank"` and
`rel="noopener noreferrer"`; the rest route through the router's `Link`. The
exported slots are
`CardHeader`, `CardTitle`, `CardDescription` and `CardContent`, and `Cards` is a
two-column grid from `sm` up.

`CardTitle` does not use the heading face. A card is chrome rather than prose, so
on an `.editorial` surface it stays in the body sans instead of turning serif and
losing the weight that separates it from the description.

## Tone

```tsx
<Button tone="destructive" variant="ghost">Delete</Button>
<Callout tone="warn" title="Rotate the key first">…</Callout>
<TypographyLink href="/pricing" tone="primary">See pricing</TypographyLink>
```

| tone          | means                    | fill / ink / hue                                                 |
| ------------- | ------------------------ | ---------------------------------------------------------------- |
| `muted`       | nothing; chrome          | `--muted` / `--foreground` / `--foreground`, hairline `--border` |
| `primary`     | the principal action     | `--primary` / `--primary-foreground` / `--primary`               |
| `secondary`   | the warm accent          | `--secondary` / `--secondary-foreground` / `--secondary-ink`     |
| `brand`       | the app's own identity   | `--brand` / `--tint-foreground` / `--brand-ink`                  |
| `success`     | it worked                | `--success` / `--tint-foreground` / `--success-ink`              |
| `warn`        | a footgun                | `--warn` / `--tint-foreground` / `--warn-ink`                    |
| `destructive` | it deletes, or it failed | `--destructive` / `--destructive-foreground` / `--destructive`   |

**Seven tones, seven tokens, one to one.** That is the bar for admitting a new
one, and it is what ruled three out:

- `neutral` — no such token, and `muted` is already the package's word for the
  quiet register (`--muted-foreground`, `TypographyMuted`, `TypographyP
tone="muted"`).
- `accent` — `--accent` is `--primary`'s hover tint, so `tone="accent"` and a
  washed `tone="primary"` rendered the same control.
- `info` — a real token, but `success | warn | destructive` is already the whole
  good/careful/bad triad, and neither app had ever reached for a fourth.

One list, because there used to be three: `Callout` had `muted`,
`TypographyLink` had `foreground`, and a button's `default` was the same idea a
third time.

`muted`'s hue is `--foreground`, not `--muted-foreground`. The tone says the
control carries no _meaning_, not that it carries less contrast — a Cancel button
beside a Save button is quiet because it is not filled in, and its label still has
to be read.

Three values per row, not one, because a fill is a mark that clears 3:1 and an
ink is read and clears 4.5:1. `--tone-fill` is the surface, `--tone-ink` the
label printed on it, `--tone-hue` the same colour as words. `/contrast`'s
`checkSignals` is the test.

A component spends what a tone declares — `--tone-line` for a hairline,
`--tone-veil` for a panel's tint, `--tone-wash` for a control's, `--tone-hue` for
ink — so neither `Button` nor `Callout` contains a single per-tone branch. Adding
an eighth tone is one row in `tone.ts` and nothing anywhere else.

Painting your own surface with one is `toneClass(tone)`, which returns the whole
class list. It used to be two exports combined by hand, and the order was
load-bearing in a way nothing enforced: the derived values have to come first so
`muted` can override `--tone-line` with `--border`. Two arguments whose order
matters and whose values always travel together is one argument.

`brand` is the one token the package does not define. It falls back to
`--primary`, so an app with no identity hue of its own gets its principal one
rather than an invisible control.

`TypographyHighlight` deliberately does not take this type. Its palette is
categorical — identity and kind, never state — which is the same distinction
theme.css draws between the earth swatches and the status tokens.

## Callout

```tsx
<Callout tone="warn" title="Rotate the key first" icon={KeyIcon}>
  The old one stops working the moment the new one is issued.
</Callout>;

{
  /* Docs density: reading-size body, accent rail */
}
<Callout density="editorial" tone="primary" title="Why this is safe">
  Replication slots are consumed in order.
</Callout>;
```

| prop            | type                                    | default                                        |
| --------------- | --------------------------------------- | ---------------------------------------------- |
| `tone`          | `Tone` (see above)                      | `muted`                                        |
| `density`       | `"compact" \| "editorial"`              | `compact`                                      |
| `title`         | `ReactNode`                             | —                                              |
| `icon`          | `ComponentType<{ className?: string }>` | — (injected, so the package needs no icon set) |
| `action`        | `ReactNode`                             | a link or buttons under the body               |
| `bodyClassName` | `string`                                | for the one body that is not prose             |

`compact` is the product form, with a 12px title over 12px body. `editorial` is
the docs form: body copy at reading size and a 3px accent rail, so the surface
around it can stay quiet.

This is not a shadcn `Alert`. These are permanent explanations inside a panel,
and they should not announce themselves to a screen reader every time a sheet
opens.

## Button

```tsx
<Button>Publish</Button>                                  {/* solid, primary, md */}
<Button variant="outline">Cancel</Button>                  {/* outline implies neutral */}
<Button variant="ghost" tone="destructive" size="sm">Delete</Button>
<Button variant="ghost" size="sm" icon aria-label="More"><MoreIcon /></Button>
<Button size="xl" pill tone="brand" render={<Link href="/notes" />}>
  Read the notes
</Button>
```

| prop      | type                                                  | default                                 |
| --------- | ----------------------------------------------------- | --------------------------------------- |
| `variant` | `"solid" \| "soft" \| "outline" \| "ghost" \| "link"` | `solid`                                 |
| `tone`    | `Tone` (see above)                                    | `primary` on `solid`, `muted` otherwise |
| `size`    | `"xs" \| "sm" \| "md" \| "lg" \| "xl"`                | `md`                                    |
| `icon`    | `boolean` — a square box for a lone glyph             | `false`                                 |
| `pill`    | `boolean` — full-round corners                        | `false`                                 |
| `render`  | `ReactElement` — the element the button becomes       | a `<button>`                            |

**Variant is how much ink the button spends; tone is what the ink means.** They
are independent, which is the point. A list that mixes them — the
`default | secondary | destructive | ghost` both apps used to ship — can only
express the pairs someone thought to add, so a quiet destructive button had to be
written by hand. Five variants against seven tones is thirty-five pairs from twelve
declarations, and the cross product happens in CSS. `tone` is not this
component's: it is the package's one semantic vocabulary, listed under
[Tone](#tone) above and taken by `Callout` and `TypographyLink` too.

`tone` is the one axis whose default is not a constant. Filling a button in is
how a page says _this is the action_, so a solid button with nothing else stated
is the principal one; anything less than filled is chrome until a call site says
otherwise. That is not a convenience — 244 of the 246 buttons across both apps
that name a variant name `outline` or `ghost`, and every one wants the page's own
ink. A uniform default would have meant `tone="muted"` on all 244.

Sizes are one ladder on a 4px step, 24px to 40px. `md` is the product default,
`lg` and `xl` the marketing ones. `icon` and `pill` are both booleans because
both have exactly two states, and they compose: a round icon button is
`icon pill`.

A `render` element that is not a `<button>` gets the classes and nothing else, on
purpose: Base UI stamps `role="button"` on whatever it renders, and that drops an
anchor out of screen-reader link navigation. `render={<Link href="/x" />}` stays a
link.

## Badge

```tsx
<Badge>Live</Badge>                                   {/* solid, primary, sm */}
<Badge variant="soft" tone="destructive">Failed</Badge>
<Badge variant="outline" tone="warn">Needs review</Badge>
<Badge size="xs">12</Badge>                           {/* the toolbar count */}
```

| prop      | type                                        | default                                 |
| --------- | ------------------------------------------- | --------------------------------------- |
| `variant` | `"solid" \| "soft" \| "outline" \| "ghost"` | `solid`                                 |
| `tone`    | `Tone` (see above)                          | `primary` on `solid`, `muted` otherwise |
| `size`    | `"xs" \| "sm"`                              | `sm`                                    |
| `pill`    | `boolean`                                   | `false`                                 |

The same two axes as [Button](#button), spelled the same way, so knowing one
component's vocabulary is knowing this one's. `link` is the single omission: no
badge has ever used it, because a badge is not a link.

Both apps had grown a private list instead. ssite's carried `warning` and
`supertype` — the package's `warn` and `brand` tones under invented names, which
is exactly the second vocabulary a design system exists to prevent — plus a
`secondary` that was `bg-muted/80 text-foreground` against a `default` of
`bg-muted text-muted-foreground`, a distinction no reader could name. viably's
was a copy of the old button list, `link` variant and all.

Two rungs, not five: `sm` is the label beside a title, `xs` the figure beside a
toolbar control.

## Disclosure and Accordion

Two components rather than two variants, with different names, because call sites
reaching for the wrong one used to cause real bugs.

**`Disclosure` / `DisclosureGroup`** — a `<details>`/`<summary>` pair. No
JavaScript, correct before hydration, and available to an MDX author:

```tsx
<DisclosureGroup type="single" defaultValue="Retries">
  <Disclosure title="Retries">Three attempts, exponential backoff.</Disclosure>
  <Disclosure title="Timeouts">30s, then the job is requeued.</Disclosure>
</DisclosureGroup>
```

`type` is `multiple` (default) or `single`. Single-open mode uses the shared
`name` attribute browsers implement natively, so it costs no state.
`defaultValue` matches on the title string.

**`Accordion`** — Base UI, animated, client-side:

```tsx
"use client";
<Accordion>
  <AccordionItem value="a">
    <AccordionTrigger>What counts as a seat?</AccordionTrigger>
    <AccordionContent>
      Anyone who signs in during the billing period.
    </AccordionContent>
  </AccordionItem>
</Accordion>;
```

It needs `theme.css` for its open and close keyframes.

## Tabs

```tsx
"use client";
<TabGroup
  defaultValue="people"
  tabs={[
    { value: "people", label: "People", content: <Roster /> },
    { value: "revenue", label: "Revenue", content: <Chart /> },
  ]}
/>;
```

`TabGroup` is the component. Everything the package and both apps do with tabs is
this shape, and it is the one to reach for — including the cases that look like
they want composing by hand.

`TabsList` takes a `variant`: `default` draws a boxed segmented track, `line`
drops the surface and marks the active tab with an underline. Each variant states
its own box — a `line` strip wraps and its tabs are as wide as their labels;
boxed segments split one fixed-height rail evenly — so neither needs correcting
at the call site.

It also takes a `tone`, from the same seven every Button and Callout uses. The
tone inks **the marker, and only the marker**: on `line`, the underline and the
active tab's icon. The boxed track's marker is a card surface and a hairline that
`SEGMENT` keeps deliberately flat, so a tone there would be a colour with nothing
to paint. Labels stay `--foreground` either way — a label is read, not signalled.

```tsx
<TabGroup
  variant="line"
  tone="brand"
  defaultValue="speakers"
  tabs={[
    { value: "gallery", label: "Gallery", icon: Award, content: <Overview /> },
    {
      value: "speakers",
      label: "Speakers",
      icon: <PriceChip />,
      content: <Speakers />,
    },
  ]}
/>
```

`icon` is an element — `<Award />`, `<PriceChip />` — sized at `size-4`, seated in the
label's own gap, and taking the tone when its tab is active. An element rather than a
component because `TabGroup` is a client component: a component reference handed to it
from a server page is a function crossing the RSC boundary, and React refuses that. `iconPosition` moves it to `"inline-end"`. Pass `value` with
`onValueChange` to drive the strip from outside.

`value` is stable across a relabel, which is the whole reason it exists — it is
what `defaultValue` and `onValueChange` speak.

An MDX author writes `<Tabs items={[…]}>` with a `<Tab>` per panel, paired by
position. That shape lives in the MDX map alone; it is not the component API.

### Composing by hand

`Tabs`, `TabsList`, `TabsTrigger` and `TabsContent` are the parts `TabGroup` is
built from. Nothing in this repo or in the apps needs one today — the
preview/code switchers that look like they do are `TabGroup` with a wrapper in
`content` — so if you are reaching for these, check that first.

```tsx
<Tabs defaultValue="people">
  <TabsList variant="line">
    <TabsTrigger value="people">People</TabsTrigger>
    <TabsTrigger value="revenue">Revenue</TabsTrigger>
  </TabsList>
  <TabsContent value="people">…</TabsContent>
  <TabsContent value="revenue">…</TabsContent>
</Tabs>
```

It renders exactly what the `TabGroup` above it does. That is the point: it is a
lower rung, not a second way.

## Steps

```tsx
<Steps>
  <Step title="Install the CLI">…</Step>
  <Step title="Authenticate">…</Step>
</Steps>
```

The numbers come from a CSS counter rather than markup, so reordering the steps
renumbers them, and the digits stay out of the accessibility tree and out of
anything you copy.

## SEGMENT

The segmented picker as a set of class strings, for building your own control
that needs to match `TabsList`:

```tsx
import { SEGMENT } from "@supertype.ai/foundations/blocks";

<div className={cn(SEGMENT.track, "flex")}>
  <button className={cn(SEGMENT.item, active ? SEGMENT.activeSurface : SEGMENT.idle)}>
```

The keys are `track`, `item`, `active`, `idle` and `activeSurface`. There used to be a
sixth, `dataActiveSurface`, which was `activeSurface` respelled with `data-active:`
prefixes for an engine that marked its own trigger — one surface with two spellings,
changeable by half. `Tabs` draws its marker as an element now, so both engines wear
`activeSurface` itself.

`track` carries `shadow-recessed`, the system's one inward shadow, over `bg-background`
rather than a fill of its own. The rail is the page pressed in, so the selected segment
can stay on the page plane and still be the brighter of the two — 4 points in light, 7 in
dark. A `--muted` rail gets that backwards in the dark theme, where `--muted` sits above
`--card` rather than below it.

Radii are concentric: `rounded-md` on the track over `rounded-sm` on `activeSurface`, the
2px of `p-0.5` between them.

---

## In MDX

```tsx
// mdx-components.tsx — the file convention @next/mdx calls with no arguments
import type { MDXComponents } from "mdx/types";
import { proseMdxComponents } from "@supertype.ai/foundations/mdx";

export function useMDXComponents(): MDXComponents {
  return proseMdxComponents as MDXComponents;
}
```

It is a plain object rather than a factory, since the router and the image
component come from the package and there is nothing left to inject.

It binds the markdown elements (`h1`–`h4`, `p`, `ul`/`ol`, `blockquote`, `a`,
`pre`, `img`, `table`…) and exposes these for authors to call by hand:

| in MDX                       | renders                                          |
| ---------------------------- | ------------------------------------------------ |
| `<Card>` `<Cards>`           | the card block                                   |
| `<Accordion>` `<Accordions>` | `Disclosure` / `DisclosureGroup`, the no-JS pair |
| `<Banner>`                   | `Callout` at `density="editorial"`               |
| `<Tabs>` `<Tab>`             | `TabGroup`, via the MDX map’s positional shim    |
| `<Steps>` `<Step>`           | the step sequence                                |

Elements that MDX renders automatically take no options, since there is no call
site to make the choice. Retune them in CSS by moving the `--text-*` rung they
sit on, or scope `.editorial` over the subtree to move the whole ladder.

For code fences, add the Shiki plugin at build time:

```ts
// source.config.ts — runs in bare Node, so it must not reach React
import { rehypeProseCode } from "@supertype.ai/foundations/rehype";

export default defineConfig({
  mdxOptions: { rehypePlugins: [rehypeProseCode] },
});
```

It writes `--shiki-light` and `--shiki-dark` on every token instead of a fixed
colour, so one compiled document works in both themes and `shiki.css` decides
which applies.
