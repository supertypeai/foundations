[← README](../README.md) · [Typography](typography.md) · [The essay shell](essay.md) · [Build-time tooling](tooling.md)

---

# Blocks

Content blocks, from `@supertype/foundations/blocks` — plus the MDX map that
makes them authorable in markdown.

From `@supertype/foundations/blocks`. `Tabs` and `Accordion` are client
components (Base UI); everything else renders on the server.

## Card

Two shapes, one component. Shorthand fills the header; bare children compose.

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

An href with a scheme leaves the app (`target="_blank"`, `rel="noopener
noreferrer"`); the rest route through the router's `Link`. Exported slots are
`CardHeader`, `CardTitle`, `CardDescription`, `CardContent`. `Cards` is a
two-column grid from `sm` up.

`CardTitle` deliberately wears no heading face: a card is chrome, not prose, so
on an `.editorial` surface it stays in the body sans rather than turning serif
and losing the weight that separates it from the description.

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

`compact` is the product form (12px title over 12px body). `editorial` is the
docs form: body copy at reading size and a 3px accent rail, so the surface itself
can stay quiet. Deliberately not a shadcn `Alert` — these are permanent
explanations inside a panel, and must not announce themselves to a screen reader
every time a sheet opens.

## Disclosure and Accordion

Two components, not two variants — and they no longer share a name, because a
call site reaching for the wrong one used to cost real bugs.

**`Disclosure` / `DisclosureGroup`** — `<details>`/`<summary>`. No JS, correct
before hydration, free to an MDX author:

```tsx
<DisclosureGroup type="single" defaultValue="Retries">
  <Disclosure title="Retries">Three attempts, exponential backoff.</Disclosure>
  <Disclosure title="Timeouts">30s, then the job is requeued.</Disclosure>
</DisclosureGroup>
```

`type`: `multiple` (default) | `single`. Single-open comes from the shared
`name` attribute browsers implement natively, so it costs no state. `defaultValue`
matches on the title string.

**`Accordion`** — Base UI, animated, client:

```tsx
"use client";
<Accordion>
  <AccordionItem value="a">
    <AccordionTrigger>What counts as a seat?</AccordionTrigger>
    <AccordionContent>Anyone who signs in during the billing period.</AccordionContent>
  </AccordionItem>
</Accordion>
```

Needs `theme.css` for its open/close keyframes.

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

`TabsList` takes `variant`: `default` (a boxed segmented track) or `line` (no
surface — an accent underline is the whole signal).

`TabGroup` is the declarative shorthand, and what an MDX author writes as
`<Tabs>`: children pair with `items` **by position**.

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

Numbers are a CSS counter, not markup: reordering renumbers itself, and the
digits stay out of the accessibility tree and out of copied text.

## SEGMENT

The segmented picker as one set of surfaces, for a consumer building its own
control that must not drift from `TabsList`:

```tsx
import { SEGMENT } from "@supertype/foundations/blocks";

<div className={cn(SEGMENT.track, "flex")}>
  <button className={cn(SEGMENT.item, active ? SEGMENT.activeSurface : SEGMENT.idle)}>
```

Keys: `track`, `item`, `active`, `idle`, `activeSurface`, and
`dataActiveSurface` for an engine that marks its own trigger with `data-active`.

---

## In MDX

```tsx
// mdx-components.tsx — the file convention @next/mdx calls with no arguments
import type { MDXComponents } from "mdx/types";
import { proseMdxComponents } from "@supertype/foundations/mdx";

export function useMDXComponents(): MDXComponents {
  return proseMdxComponents as MDXComponents;
}
```

A plain object, not a factory — the router and the image component are the
package's now, so there is nothing left to inject.

It binds the markdown elements (`h1`–`h4`, `p`, `ul`/`ol`, `blockquote`, `a`,
`pre`, `img`, `table`…) and exposes these for authors to call by hand:

| in MDX | renders |
|---|---|
| `<Card>` `<Cards>` | the card block |
| `<Accordion>` `<Accordions>` | `Disclosure` / `DisclosureGroup` — the no-JS pair |
| `<Banner>` | `Callout` at `density="editorial"` |
| `<Tabs>` `<Tab>` | `TabGroup` / `Tab` |
| `<Steps>` `<Step>` | the step sequence |

Elements MDX renders automatically take no options — there is no call site to
make the choice. Retune them in CSS via `--prose-measure` and `--prose-leading`.

For code fences, add the Shiki plugin at build time:

```ts
// source.config.ts — runs in bare Node, so it must not reach React
import { rehypeProseCode } from "@supertype/foundations/rehype";

export default defineConfig({ mdxOptions: { rehypePlugins: [rehypeProseCode] } });
```

It emits `--shiki-light` / `--shiki-dark` per token rather than a baked colour,
so one compiled document serves both themes; `shiki.css` maps them.

