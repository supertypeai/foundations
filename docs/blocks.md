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
{/* Shorthand — what MDX authors write */}
<Card
  href="/notes/streaming-pipelines"
  title="Build a streaming pipeline"
  description="Kafka in, warehouse out, four parts."
  icon={<DatabaseIcon className="size-4" />}
/>

{/* Composed */}
<Card>
  <CardHeader>
    <CardTitle>Usage</CardTitle>
    <CardDescription>Billing period to date</CardDescription>
  </CardHeader>
  <CardContent>
    <TypographyStat size="panel">18,204</TypographyStat>
  </CardContent>
</Card>

{/* A grid of them */}
<Cards>
  <Card title="One" href="/one" />
  <Card title="Two" href="/two" />
</Cards>
```

| prop | type | notes |
|---|---|---|
| `href` | `string` | present ⇒ the whole card is a link |
| `external` | `boolean` | overrides the scheme sniff |
| `title` / `description` / `icon` | `ReactNode` | the shorthand header |
| everything else | anchor/div props | passed through |

An href with a scheme leaves the app, with `target="_blank"` and
`rel="noopener noreferrer"`; the rest route through the router's `Link`. The
exported slots are
`CardHeader`, `CardTitle`, `CardDescription` and `CardContent`, and `Cards` is a
two-column grid from `sm` up.

`CardTitle` does not use the heading face. A card is chrome rather than prose, so
on an `.editorial` surface it stays in the body sans instead of turning serif and
losing the weight that separates it from the description.

## Callout

```tsx
<Callout tone="warn" title="Rotate the key first" icon={KeyIcon}>
  The old one stops working the moment the new one is issued.
</Callout>

{/* Docs density: reading-size body, accent rail */}
<Callout density="editorial" tone="accent" title="Why this is safe">
  Replication slots are consumed in order.
</Callout>
```

| prop | type | default |
|---|---|---|
| `tone` | `"muted" \| "destructive" \| "warn" \| "accent"` | `muted` |
| `density` | `"compact" \| "editorial"` | `compact` |
| `title` | `ReactNode` | — |
| `icon` | `ComponentType<{ className?: string }>` | — (injected, so the package needs no icon set) |
| `action` | `ReactNode` | a link or buttons under the body |
| `bodyClassName` | `string` | for the one body that is not prose |

`compact` is the product form, with a 12px title over 12px body. `editorial` is
the docs form: body copy at reading size and a 3px accent rail, so the surface
around it can stay quiet.

This is not a shadcn `Alert`. These are permanent explanations inside a panel,
and they should not announce themselves to a screen reader every time a sheet
opens.

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
    <AccordionContent>Anyone who signs in during the billing period.</AccordionContent>
  </AccordionItem>
</Accordion>
```

It needs `theme.css` for its open and close keyframes.

## Tabs

```tsx
"use client";
<Tabs defaultValue="people">
  <TabsList>
    <TabsTrigger value="people">People</TabsTrigger>
    <TabsTrigger value="revenue">Revenue</TabsTrigger>
  </TabsList>
  <TabsContent value="people">…</TabsContent>
  <TabsContent value="revenue">…</TabsContent>
</Tabs>
```

`TabsList` takes a `variant`: `default` draws a boxed segmented track, `line`
drops the surface and marks the active tab with an accent underline.

`TabGroup` is the shorthand, and what an MDX author writes as `<Tabs>`. Children
pair with `items` **by position**:

```tsx
<TabGroup items={["npm", "pnpm", "yarn"]}>
  <Tab value="npm">…</Tab>
  <Tab value="pnpm">…</Tab>
  <Tab value="yarn">…</Tab>
</TabGroup>
```

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

The keys are `track`, `item`, `active`, `idle`, `activeSurface`, and
`dataActiveSurface` for an engine that marks its own trigger with `data-active`.

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

| in MDX | renders |
|---|---|
| `<Card>` `<Cards>` | the card block |
| `<Accordion>` `<Accordions>` | `Disclosure` / `DisclosureGroup`, the no-JS pair |
| `<Banner>` | `Callout` at `density="editorial"` |
| `<Tabs>` `<Tab>` | `TabGroup` / `Tab` |
| `<Steps>` `<Step>` | the step sequence |

Elements that MDX renders automatically take no options, since there is no call
site to make the choice. Retune them in CSS by moving the `--text-*` rung they
sit on, or scope `.editorial` over the subtree to move the whole ladder.

For code fences, add the Shiki plugin at build time:

```ts
// source.config.ts — runs in bare Node, so it must not reach React
import { rehypeProseCode } from "@supertype.ai/foundations/rehype";

export default defineConfig({ mdxOptions: { rehypePlugins: [rehypeProseCode] } });
```

It writes `--shiki-light` and `--shiki-dark` on every token instead of a fixed
colour, so one compiled document works in both themes and `shiki.css` decides
which applies.
