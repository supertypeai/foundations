/**
 * Type-level assertions. Nothing here runs; `tsc --noEmit` is the test.
 *
 * Each `@ts-expect-error` is an assertion that the line below it does NOT
 * compile. If one of these starts compiling — a preset stops pinning its prop,
 * a required prop becomes optional — TypeScript reports the directive as unused
 * and this file fails, which is what makes it a test rather than a comment.
 */
import {
  TypographyH1,
  TypographyH2,
  TypographyMuted,
  TypographyProse,
  TypographyProseList,
  TypographyP,
  TypographyList,
  TypographyLink,
  TypographyStat,
  TypographyEyebrow,
  TypographyCaption,
  TypographyHighlight,
} from "../../dist/index.js";
import { Button, Callout } from "../../dist/blocks/index.js";

export const pinned = (
  <>
    {/* A preset removes the prop it settles from its own type. */}
    {/* @ts-expect-error tone is pinned to "muted" */}
    <TypographyMuted tone="default">no</TypographyMuted>
    {/* @ts-expect-error tone is pinned to "muted" */}
    <TypographyProse tone="default">no</TypographyProse>
    {/* @ts-expect-error variant is pinned to "prose" */}
    <TypographyProseList variant="ui">no</TypographyProseList>

    {/* The unpinned components still take the axis. */}
    <TypographyP tone="muted" variant="prose">yes</TypographyP>
    <TypographyList variant="ui" ordered>yes</TypographyList>
  </>
);

export const variants = (
  <>
    {/* @ts-expect-error "huge" is not on the heading variant union */}
    <TypographyH1 variant="huge">no</TypographyH1>
    {/* @ts-expect-error divider is boolean, not a string */}
    <TypographyH2 divider="yes">no</TypographyH2>
    {/* @ts-expect-error stat sizes do not include "large" */}
    <TypographyStat size="large">no</TypographyStat>
    {/* @ts-expect-error the marker has no destructive tone, on purpose */}
    <TypographyEyebrow tone="destructive">no</TypographyEyebrow>

    <TypographyH1 variant="display">yes</TypographyH1>
    <TypographyH2 divider variant="default">yes</TypographyH2>
    <TypographyStat size="panel" figures="proportional">yes</TypographyStat>
    <TypographyEyebrow tone="label">yes</TypographyEyebrow>
  </>
);

export const required = (
  <>
    {/* @ts-expect-error href is required on a link */}
    <TypographyLink>no</TypographyLink>

    <TypographyLink href="/ok" addArrow newTab={false} tone="secondary">yes</TypographyLink>
  </>
);

export const polymorphic = (
  <>
    {/* @ts-expect-error `as` takes a tag from TypographyTag, not any string */}
    <TypographyCaption as="marquee">no</TypographyCaption>

    <TypographyCaption as="p" size="2xs">yes</TypographyCaption>
  </>
);

export const buttonAxes = (
  <>
    {/* The two axes stay separate: a semantic name is never a variant. */}
    {/* @ts-expect-error "destructive" is a tone, not a variant */}
    <Button variant="destructive">no</Button>
    {/* @ts-expect-error "secondary" is a tone, not a variant */}
    <Button variant="secondary">no</Button>
    {/* @ts-expect-error one size ladder; a square is `icon`, not a size */}
    <Button size="icon-sm">no</Button>

    <Button variant="ghost" tone="destructive" size="sm">yes</Button>
    <Button variant="solid" tone="brand" size="xl" pill icon>yes</Button>
  </>
);

/**
 * One tone vocabulary, not one per component. The three names that were dropped
 * when the private lists merged must stay dropped: each was a second spelling of
 * a tone that already existed, and a compiling `tone="muted"` is how the second
 * spelling comes back.
 */
export const oneToneVocabulary = (
  <>
    {/* @ts-expect-error a tone with no token behind it; this one is `muted` */}
    <Callout tone="neutral">no</Callout>
    {/* @ts-expect-error Callout's old "accent" was `--primary` under another name */}
    <Callout tone="accent">no</Callout>
    {/* @ts-expect-error TypographyLink's old "foreground" is `muted` */}
    <TypographyLink href="/x" tone="foreground">no</TypographyLink>
    {/* @ts-expect-error the categorical palette is not the semantic one */}
    <Button tone="sage">no</Button>
    {/* @ts-expect-error ...and the semantic one is not the categorical palette */}
    <TypographyHighlight tone="destructive">no</TypographyHighlight>

    {/* The same eight reach every component that carries meaning in a hue. */}
    {/* @ts-expect-error `success | warn | destructive` is the whole triad */}
    <Button tone="info">no</Button>

    <Button tone="warn" variant="soft">yes</Button>
    <Callout tone="warn">yes</Callout>
    <TypographyLink href="/x" tone="warn">yes</TypographyLink>
  </>
);
