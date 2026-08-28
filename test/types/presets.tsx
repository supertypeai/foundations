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
} from "../../dist/index.js";

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
