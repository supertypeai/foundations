import { type LinkBehavior } from "../href.js";
import { type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import { type Tone } from "../tone.js";
import { type WithAs } from "./as.js";
/** The body layer: two axes and no more. A paragraph picks a rung and an ink; a
 * caption is always secondary ink and picks a size. `lead` was a third rung a
 * breakpoint away from `prose`, and its standfirst role is now the eyebrow's. */
declare const pVariants: (props?: ({
    variant?: "ui" | "prose" | null | undefined;
    tone?: "muted" | "default" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type ParagraphVariants = VariantProps<typeof pVariants>;
/**
 * `as` is here for the reason the caption has it, one step further on: a
 * component that hands its body to a caller cannot know whether what arrives is
 * a sentence or a list, and a paragraph may hold neither a list nor a div. The
 * HTML parser closes the `<p>` early and React reports a hydration error, so
 * every wrapper of that shape (`Callout` was the one) renders `as="div"`.
 */
export declare function TypographyP({ className, variant, tone, as, children, ...props }: WithAs<ParagraphVariants>): import("react").JSX.Element;
/** A preset's props: its base's, minus the axes it has decided. `keyof Pins` reads
 * the exclusion off the pinned object the preset also spreads, so the two cannot
 * drift — `<TypographyMuted tone="default">` used to compile and un-mute it. */
type Preset<Base, Pins> = Omit<Base, keyof Pins>;
type ParagraphProps = WithAs<ParagraphVariants>;
/** The UI rung in the secondary ink. */
declare const MUTED: {
    readonly tone: "muted";
};
export declare function TypographyMuted(props: Preset<ParagraphProps, typeof MUTED>): import("react").JSX.Element;
/** Reading-size body copy. `TypographyMuted` is the same ink one rung down. */
declare const PROSE: {
    readonly variant: "prose";
    readonly tone: "muted";
};
export declare function TypographyProse(props: Preset<ParagraphProps, typeof PROSE>): import("react").JSX.Element;
export type ListProps = ComponentProps<"ul"> & Pick<ParagraphVariants, "variant"> & {
    ordered?: boolean;
};
export declare function TypographyList({ className, children, ordered, variant, ...props }: ListProps): import("react").JSX.Element;
/**
 * The reading rung, pinned. The name predates the axis and keeps every call site
 * that already had it; `Preset` stops one re-opening the rung it names.
 */
declare const PROSE_LIST: {
    readonly variant: "prose";
};
export declare function TypographyProseList(props: Preset<ListProps, typeof PROSE_LIST>): import("react").JSX.Element;
/**
 * Meta beside content: timestamps, counts, bylines, the key in a key-value row.
 *
 * Always the secondary ink and never a weight — a caption is secondary because
 * it is muted, and 500 on top would have the colour and the weight arguing.
 * `sm` is the default because meta is separated from body by ink, not size;
 * the smaller rungs are a deliberate step down, not the norm.
 *
 * Leading comes from the rung, as it does for every other primitive here. Two
 * of these rungs used to pin a fixed ratio on top of the ramp, which held a
 * caption apart from the label beside it and overrode the retune an editorial
 * subtree had just made. An app that wants more air under a wrapped caption
 * moves the rung, which is where the rest of the page reads its leading from.
 *
 * `inherit` is the parenthetical inside a heading, an eyebrow or a stat. It
 * takes the size of whatever set it and resets the weight, because the only
 * reason to sit there is to be quieter than the thing you qualify — and every
 * container that sets a size for you sets a weight too.
 */
declare const captionVariants: (props?: ({
    size?: "inherit" | "sm" | "xs" | "2xs" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type CaptionVariants = VariantProps<typeof captionVariants>;
/**
 * `as` covers the one thing that genuinely differs between call sites: whether
 * the run is inline beside its subject or a block under it.
 */
export declare function TypographyCaption({ className, size, as, children, ...props }: WithAs<CaptionVariants>): import("react").JSX.Element;
/**
 * Small print set as a block: a note under the thing it annotates, rather than
 * an aside inline with it. Same rung and same ink as the caption — small print
 * is small because it is muted, and dropping it a rung as well is what made
 * both apps hand-roll their own.
 */
declare const BLOCK: {
    readonly as: "p";
};
export declare function TypographySmall(props: Preset<WithAs<CaptionVariants>, typeof BLOCK>): import("react").JSX.Element;
/**
 * The label role: a form label, a column header, the key a reader scans for.
 * 500 is the only weight bump a dense surface needs below a heading.
 *
 * The rungs are the caption's, deliberately. A label and a caption are one pair
 * — the key and the value, the name and the note — and a pair that cannot be set
 * at one size is not a pair. Pinning the label to `sm` while the caption had an
 * axis is what sent a key next to an `xs` value out to `font-medium text-xs` in
 * a className, leaving the weight arguing with the rung it landed on.
 *
 * `as` is here for the same reason it is on `TypographyEyebrow`: a config panel
 * names its sections at this size, and those names are the page's outline.
 */
declare const labelVariants: (props?: ({
    size?: "inherit" | "sm" | "xs" | "2xs" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type LabelVariants = VariantProps<typeof labelVariants>;
export declare function TypographyLabel({ className, size, as, children, ...props }: WithAs<LabelVariants>): import("react").JSX.Element;
/**
 * A numeric readout. Size and colour ride in via className per use.
 *
 * Tabular is right in a column and wrong in a headline, so it is an axis rather
 * than a constant. Keep `tabular` anywhere a value updates in place.
 *
 * Leading is the one thing here the rung does not decide. A stat sits on the
 * body rungs, whose leading is room for the line that follows, and a value has
 * no line following it: the ratio lands as dead space arguing with the padding
 * the tile around it already sets. Pinned tight, for the reason a badge is.
 */
declare const statVariants: (props?: ({
    size?: "display" | "base" | "section" | "inherit" | "page" | "sm" | "xs" | "2xs" | "3xs" | "lg" | "xl" | "2xl" | "3xl" | "card" | "panel" | null | undefined;
    tone?: "muted" | "default" | null | undefined;
    figures?: "tabular" | "proportional" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type StatVariants = VariantProps<typeof statVariants>;
export declare function TypographyStat({ className, size, figures, tone, children, ...props }: ComponentProps<"span"> & StatVariants): import("react").JSX.Element;
/**
 * A run of code inside a sentence: a command, a field name, a trigger.
 *
 * Everything is in `em`, not a rung: the chip has to sit in whatever size the
 * sentence around it is set at, and the ramp differs per surface. The 0.9 is an
 * optical correction — the mono face carries a taller x-height than the sans.
 */
export declare function TypographyInlineCode({ className, children, ...props }: ComponentProps<"code">): import("react").JSX.Element;
type TypographyLinkProps = Omit<ComponentProps<"a">, "href"> & LinkBehavior & {
    href: string;
    children: ReactNode;
    tone?: Tone;
    /**
     * A trailing arrow, for a link that ends a sentence and leads somewhere. The
     * glyph follows the href: `↗` when the link leaves the site, `→` when it does
     * not. The href picks it, so a call site never has to.
     */
    addArrow?: boolean;
};
/**
 * The inline link.
 *
 * Internal and external are decided from the href, never at the call site —
 * ../href.ts holds that decision, and Button, Badge and Card make the same one.
 * `newTab` and `external` are the overrides. Call-site props apply last, so a
 * passed `target`/`rel` still wins.
 *
 * The router is `next-view-transitions`, imported rather than injected. Every
 * project on this package is a Next app and wants the same link, and a factory
 * bought router-agnosticism nobody used at the price of a component that could
 * not be imported by name. One call site ended up on the unbound version that
 * way and lost its decoration.
 */
export declare function TypographyLink({ href, children, tone, external: leavesApp, newTab, addArrow, className, ...props }: TypographyLinkProps): import("react").JSX.Element;
export {};
