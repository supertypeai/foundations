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
| `newTab`                         | `boolean`        | overrides the target               |
| `title` / `description` / `icon` | `ReactNode`      | the shorthand header               |
| everything else                  | anchor/div props | passed through                     |

Where the href goes is [`resolveLink`](#links)'s call, not the call site's. The
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
| `primary`     | the principal action     | `--primary` / `--primary-foreground` / `--primary-ink`           |
| `secondary`   | the warm accent          | `--secondary` / `--secondary-foreground` / `--secondary-ink`     |
| `brand`       | the app's own identity   | `--brand` / `--brand-foreground` / `--brand-ink`                 |
| `success`     | it worked                | `--success` / `--success-foreground` / `--success-ink`           |
| `warn`        | a footgun                | `--warn` / `--warn-foreground` / `--warn-ink`                    |
| `destructive` | it deletes, or it failed | `--destructive` / `--destructive-foreground` / `--destructive`   |

**Seven tones, seven tokens, one to one.** That is the bar for admitting a new
one, and three names failed it:

- `neutral` — no such token, and `muted` is already the package's word for the
  quiet register (`--muted-foreground`, `TypographyMuted`, `TypographyP
tone="muted"`).
- `accent` — `--accent` is `--primary`'s hover tint, so `tone="accent"` and a
  washed `tone="primary"` rendered the same control.
- `info` — a real token, but `success | warn | destructive` is already the whole
  good/careful/bad triad, and neither app had ever reached for a fourth.

One list: `Callout` used to have `muted`, `TypographyLink` used to have
`foreground`, and a button's `default` was the same idea a third time.

`muted`'s hue is `--foreground`, not `--muted-foreground`. The tone says the
control carries no _meaning_, not that it carries less contrast — a Cancel button
beside a Save button is quiet when it is unfilled, and its label still has to be
read.

Three values per row, not one: a fill is a mark that clears 3:1, and an ink is
read and clears 4.5:1. `--tone-fill` is the surface, `--tone-ink` is the label
printed on it, and `--tone-hue` is the same colour as words. `/contrast`'s
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

### The ink your children inherit

`toneClass` is a palette, not a surface. A `Callout` spends the same seven values
a filled `Button` does and tints at 5%, so the words inside it still sit on the
page and still want the page's ink.

So the ink is handed down by whatever actually paints. Fill a surface and add
`INK_ON_FILL`; tint a neutral one and add `INK_ON_CARD`, `INK_ON_POPOVER` or
`INK_ON_SIDEBAR`. They are constants rather than a function of the token because
Tailwind generates only the classes it can read as text in the package, so a
class assembled at runtime resolves to nothing at all. A surface the package does
not name takes `inkOnSurfaceStyle(token)`, spread into `style`.
Both set `--ink` and `--ink-muted`, which every type primitive reads with the
page as its fallback:

```tsx
<div className={cn(toneClass("brand"), INK_ON_FILL, "bg-(--tone-fill) p-4")}>
  <TypographyLabel>Reads the surface, not the page</TypographyLabel>
</div>
```

Skip it and a nested `TypographyLabel` prints `--foreground` on your fill.
That shipped: a hand-rolled anchor styled `bg-primary text-primary-foreground`
with a `TypographyLabel` inside measured **2.34:1**. The preset's own ink had
won over the colour it inherited. `test/composition.test.ts` measures every
surface against every primitive in both themes, which is what makes the token
pair check sufficient.

On a hue fill `--ink-muted` collapses to `--ink`: mixing a label 20% toward its
fill measures 4.22:1 on the dark theme. Nothing on a filled control may be
quieter than its label — two rungs means you wanted a tinted surface.

`brand` is the one row the package does not define. Each cut falls back to the
matching cut of `primary`, so an app with no identity hue of its own gets its
principal one rather than an invisible control.

**Declare one cut and you owe the rest.** The fallbacks are per property, so an
app that sets `--brand` and stops gets its own fill with the package's label on
it — a bronze `--brand` took white from `--primary-foreground` and printed every
solid brand badge at 2.80:1. Nothing renders wrong enough to notice, which is why
`checkSignals` now resolves each cut the way the cascade does and measures
whichever token actually answers. Declare `--brand`, and declare
`--brand-foreground` and `--brand-ink` beside it:

```css
:root {
  --brand: #b1976b;
  --brand-foreground: hsl(
    30 25% 12%
  ); /* the label printed on the fill, 4.5:1 */
  --brand-ink: #8c6c3c; /* the same hue as words, 4.5:1 on the page */
}
```

`TypographyHighlight` deliberately does not take this type. Its palette is
categorical — identity and kind, never state — which is the same distinction
theme.css draws between the earth swatches and the status tokens.

## Links

Every component that can be a link takes `href` and nothing more: `Button`,
`Badge`, `Card`, `TypographyLink`. One function behind all four —
`resolveLink`, exported from the root for the rare call site that styles someone
else's element:

| the href          | renders                                         | why                                                                    |
| ----------------- | ----------------------------------------------- | ---------------------------------------------------------------------- |
| `/notes`          | the router's `Link`                             | client navigation, and the view transition survives                    |
| `#section`        | a plain `<a>`                                   | the browser can already scroll there; routing it asks for a navigation |
| `https://…`       | `<a target="_blank" rel="noopener noreferrer">` | it leaves the app                                                      |
| `mailto:`, `tel:` | `<a>`, no target                                | it hands off to another app; no tab opens                              |

`external` overrides the scheme sniff (an absolute URL that is home, a relative
one that is not) and `newTab` overrides the target.

**Do not pass an anchor through `render`.** `render={<a href="/x" />}` reads as a
styling escape hatch and is a routing decision made in the wrong place: the
cloned anchor never reaches the router, so the page fully reloads and the view
transition is lost, and an off-site href gets no `rel`. `Button` now accepts
`href`, so this old pattern is no longer the way to do it. `linkRules()` in the
lint set flags the old form on `Button`, `Badge` and `Card`, and `render` keeps
its real job — an element that is genuinely not a link.

`RailLink` is the exception, and the comment in `essay/rail.tsx` says why: its
module is reached from `contents.tsx`, `reading.tsx` and `layout.tsx`, which have
to import in bare Node and in a test runner with no Next installed. Pulling the
router in there would break that, so a rail of routes still passes `<Link>`
through `render`. Its own links are `#hash` anchors, which want no router.

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

This is a permanent explanation inside a panel, not a shadcn `Alert`, and it
should not announce itself to a screen reader every time a sheet opens.

## Button

```tsx
<Button>Publish</Button>                                  {/* solid, primary, md */}
<Button variant="outline">Cancel</Button>                  {/* outline implies neutral */}
<Button variant="ghost" tone="destructive" size="sm">Delete</Button>
<Button variant="ghost" size="sm" icon aria-label="More"><MoreIcon /></Button>
<Button size="xl" pill tone="brand" href="/notes">      {/* a link, routed */}
  Read the notes
</Button>
```

| prop       | type                                                            | default                                 |
| ---------- | --------------------------------------------------------------- | --------------------------------------- |
| `variant`  | `"solid" \| "soft" \| "outline" \| "ghost" \| "link"`           | `solid`                                 |
| `tone`     | `Tone` (see above)                                              | `primary` on `solid`, `muted` otherwise |
| `size`     | `"xs" \| "sm" \| "md" \| "lg" \| "xl"`                          | `md`                                    |
| `icon`     | `boolean` — a square box for a lone glyph                       | `false`                                 |
| `pill`     | `boolean` — full-round corners                                  | `false`                                 |
| `href`     | `string` — makes it a link, routed by [`resolveLink`](#links)   | —                                       |
| `external` | `boolean` — override the scheme sniff                           | from the href                           |
| `newTab`   | `boolean` — override the target                                 | on for an `http(s)` href                |
| `render`   | `ReactElement` — an element that is neither a button nor a link | a `<button>`                            |

**Variant is how much ink the button spends; tone is what the ink means.** They
are independent, and that separation is what makes the API useful. A list that
mixes them — the `default | secondary | destructive | ghost` both apps used to
ship — can only express the pairs someone thought to add, so a quiet destructive
button had to be written by hand. Five variants against seven tones is
thirty-five pairs from twelve declarations, and the cross product happens in CSS.
`tone` is not this component's: it is the package's one semantic vocabulary,
listed under [Tone](#tone) above and taken by `Callout` and `TypographyLink`
too.

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

**A button that leads somewhere takes `href`, not an anchor.** `render={<a
href="/x" />}` was how this used to be written, and it is a routing decision
wearing a styling prop: the cloned anchor never reaches the router, so the CTA
full-page-reloads and loses the view transition, and an off-site href gets no
`rel`. `href` goes through the package's one rule — see [Links](#links) — the
same one `Card`, `Badge` and `TypographyLink` use. The lint set flags
the old form.

Either way the element is not run through Base UI: it stamps `role="button"` on
whatever it renders, and that drops an anchor out of screen-reader link
navigation. `render` remains for an element that is genuinely neither — a
`<label>`, a menu item.

## Badge

```tsx
<Badge>Live</Badge>                                   {/* solid, primary, sm */}
<Badge variant="soft" tone="destructive">Failed</Badge>
<Badge variant="outline" tone="warn">Needs review</Badge>
<Badge size="xs">12</Badge>                           {/* the toolbar count */}
```

| prop      | type                                                                       | default                                 |
| --------- | -------------------------------------------------------------------------- | --------------------------------------- |
| `variant` | `"solid" \| "soft" \| "outline" \| "ghost"`                                | `solid`                                 |
| `tone`    | `Tone` (see above)                                                         | `primary` on `solid`, `muted` otherwise |
| `size`    | `"xs" \| "sm"`                                                             | `sm`                                    |
| `pill`    | `boolean`                                                                  | `false`                                 |
| `href`    | `string` — a badge that leads somewhere, routed by [`resolveLink`](#links) | —                                       |

The same two axes as [Button](#button), spelled the same way, so knowing one
component's vocabulary is knowing this one's. `link` is the single omission: badge
labels are not links.

Both apps had grown a private list instead. ssite's carried `warning` and
`supertype` — the package's `warn` and `brand` tones under invented names, which
is exactly the second vocabulary a design system exists to prevent — plus a
`secondary` that was `bg-muted/80 text-foreground` against a `default` of
`bg-muted text-muted-foreground`, a distinction no reader could put a name to.
viably's was a copy of the old button list, `link` variant and all.

Two rungs, not five: `sm` is the label beside a title, `xs` the figure beside a
toolbar control.

## Disclosure and Accordion

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

Both wear one look, from `DISCLOSURE` in `blocks/disclosure.tsx`, so a row opened
in an MDX FAQ and a row opened in a client panel are visibly the same control. It
is `Tabs`' `line` variant turned on its side: no box and no fill, a hairline
between rows, and one 2px mark in `--tone-hue` drawing itself down the open row.
Ink carries the state the way a tab label does — muted at rest, `--foreground`
open — and hover moves the ink and nothing else.

`tone` on either root inks that mark, and only it:

```tsx
<DisclosureGroup tone="brand">…</DisclosureGroup>
<Accordion tone="brand">…</Accordion>
```

The two engines report "open" differently — `<details>` writes `open` on itself,
Base UI writes `aria-expanded` on the trigger — so `DISCLOSURE.row` spells out
both selectors. The one that does not apply matches nothing, which is why there
is one set of classes rather than two that drift. The cost is one class the
constant cannot supply for itself: `<details>` carries its state on the ancestor,
so `Disclosure` marks it `group/disclosure`.

`DISCLOSURE` is four strings — `group`, `item`, `row`, `panel` — and `row` already
carries its own open state, since no call site has wanted one without the other.

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
this shape, including the cases that look like they want composing by hand.

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
position. That shape belongs to the MDX map, not the component API.

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

It renders exactly what the `TabGroup` above it does. The purpose is simple: it is a
lower rung, not a second way.

## Steps

```tsx
<Steps>
  <Step title="Install the CLI">…</Step>
  <Step title="Authenticate">…</Step>
</Steps>
```

It renders an `<ol>`, so a screen reader counts the steps and says how many are
left. The numerals on the page are a CSS counter rather than markup: reordering
renumbers them, and the digits stay out of the accessibility tree and out of
anything you copy, since the list already carries the count.

Three columns, at 0, 28 and 40px: the numeral, the spine, the copy. The numeral
sits in its own gutter rather than centred on the rail — centring it there means
covering the hairline with a plate in the page's colour, which is a component
asserting what surface it is on, and a visible chip the moment a step list lands
inside a card. Out in the gutter the rule runs unbroken and nothing has to know
the background. It is also the better setting: right-aligned and `tabular-nums`,
so 9 to 10 moves the digits and not the spine.

The rail is a pseudo-element rather than a left border, so the last step drops it
outright instead of painting it transparent. `tone` inks the numerals and nothing
else; title and body are `TypographyLabel` and `TypographyMuted`, so both read
`--ink`/`--ink-muted` and a step list on a card takes the card's ink.

## Bulletin

The panel shape, with no copy in it: an accent along the top edge, a kicker, a
headline, a sentence, a two-up grid of short points, and a rule with a control
on it. An announcement, a release note, a status post, a credits block.

```tsx
import { Bulletin, Ribbon, Button } from "@supertype.ai/foundations/blocks";

const POINTS = [
  {
    mark: "bg-fern",
    ink: "text-fern-ink",
    title: "Scheduled exports",
    body: "…",
  },
  {
    mark: "bg-stone",
    ink: "text-stone-ink",
    title: "Faster cold starts",
    body: "…",
  },
];

<Bulletin
  accent={<Ribbon className="h-1.5 w-full" />}
  eyebrow="Release 4.2"
  headline="Exports run on a schedule now."
  lede="Two things shipped this week."
  points={POINTS}
  action={
    <Button href="/notes" variant="outline" size="sm">
      Read the notes
    </Button>
  }
  footnote="Rolling out through Friday."
/>;
```

| prop                          | what it is                                                                                  |
| ----------------------------- | ------------------------------------------------------------------------------------------- |
| `variant`                     | `"card"` (the panel) or `"line"` (the same statement at one line: accent, action, sentence) |
| `accent`                      | drawn along the top edge, full width, before the padding starts                             |
| `eyebrow`, `headline`, `lede` | the opening                                                                                 |
| `points`                      | `{ title, body, mark?, ink? }[]` — `mark` and `ink` are class names                         |
| `action`                      | the control on the footer rule                                                              |
| `footnote`                    | the line opposite it                                                                        |
| `children`                    | under the rule                                                                              |

Every slot is optional and an omitted one renders nothing rather than an empty
box, so the same component covers a full credits panel and a headline with one
button under it. One point takes the width; two or more go two-up from `sm`.

`mark` and `ink` are class names rather than token names, so a point can carry
any hue the app has — `bg-fern`/`text-fern-ink` from `theme.css`, or one of your
own. `Ribbon` takes `hues` (default `EDITORIAL_INKS`, the eight categorical hues
as data) and states no size of its own, since a panel wants `h-1.5 w-full` and a
row wants `h-1 min-w-20 flex-1 rounded-full`.

Whatever you pass has to be a literal in your own source. Tailwind reads the
files it scans as text, so a class assembled from a variable is a class it never
generates — the same rule the package follows in its own files.

## Colophon

A compact statement block for a page, a section, or a footer.

```tsx
import { Colophon } from "@supertype.ai/foundations/blocks";

<Colophon />                 // the standard panel
<Colophon variant="line" />  // a compact row
```

This component takes no configuration. Call it as `<Colophon />`. `children`
renders under the rule on the panel, where a printed colophon carries the site's
own credit — the faces it is set in, the people who wrote it, its licence — and
`label` translates the link's words.

The panel's own copy is not a prop: this is a mark, and a mark every site
rewrites is not a mark. That is a constraint on the _words_; it used to be a
constraint on the layout too, which was wrong — an announcement panel and a
credits panel are the same shape. The shape is [`Bulletin`](#bulletin) above,
and `Colophon` is a nine-line preset of it, the way `TypographyProse` is a
preset of `TypographyP`. If you want this look with your own words, use
`Bulletin`, not a reconfigured attribution.

It draws all eight categorical hues as a ribbon and inks two of them, so it is
the one place the palette appears whole. Those hues live in `theme.css`: an app
that imported `tokens.css` alone gets a panel with an invisible ribbon and no
error, which is the failure `doctor` exists to catch.

### Colophon or BuiltWithFoundations

```tsx
import { BuiltWithFoundations } from "@supertype.ai/foundations/blocks";

<footer className="flex items-center gap-4">
  <span>© 2026 Your Company</span>
  <a href="/privacy">Privacy</a>
  <BuiltWithFoundations />
</footer>;
```

A colophon is a block with something to say, and it needs a place to say it: a
credits page, an about page, the foot of a long article, a footer with room for
a row of its own. `BuiltWithFoundations` is one item in a row somebody else laid
out, sitting next to a privacy link and a copyright line, and it says only where
the site came from.

The test is what the surface is for. If the attribution is going somewhere that
already has its own columns, it is `BuiltWithFoundations`. If the block is the
thing being placed, it is `Colophon`. There is deliberately no `Colophon`
variant that renders the link alone: that would be a second name for a component
that already has one.

`BuiltWithFoundations` is a `Button variant="outline" size="sm"` carrying an
`href`, so it is the same control, the same hairline and the same radius rung as
every other button on the page — and the anchor is the button, which is where
the routing and the `rel` come from.

`FoundationsMark` is the eight-hue chip on its own, for a row that wants the
mark beside its own wording, and `FOUNDATIONS_URL` is the bare href for a
`<link rel>` or an analytics label.

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

It is a plain object rather than a factory; the router and image component come
from the package, and nothing remains to inject.

It binds the markdown elements (`h1`–`h4`, `p`, `ul`/`ol`, `blockquote`, `a`,
`pre`, `img`, `table`…) and exposes these for authors to call by hand:

| in MDX                       | renders                                          |
| ---------------------------- | ------------------------------------------------ |
| `<Card>` `<Cards>`           | the card block                                   |
| `<Accordion>` `<Accordions>` | `Disclosure` / `DisclosureGroup`, the no-JS pair |
| `<Banner>`                   | `Callout` at `density="editorial"`               |
| `<Tabs>` `<Tab>`             | `TabGroup`, via the MDX map’s positional shim    |
| `<Steps>` `<Step>`           | the step sequence                                |

MDX-rendered elements take no options. No call site exists to make the choice.
Retune them in CSS by moving the `--text-*` rung they sit on, or scope
`.editorial` over the subtree to move the whole ladder.

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
