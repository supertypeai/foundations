import { type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
/**
 * The body layer: one paragraph, one caption, one link.
 *
 * Two axes and no more. A paragraph picks a rung (interface copy or reading
 * copy) and an ink; a caption is always the secondary ink and picks a size.
 * Anything that was a separate component for one class is a preset below.
 */
declare const pVariants: (props?: ({
    variant?: "ui" | "prose" | "lead" | null | undefined;
    tone?: "default" | "muted" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type ParagraphVariants = VariantProps<typeof pVariants>;
export declare function TypographyP({ className, variant, tone, children, ...props }: ComponentProps<"p"> & ParagraphVariants): import("react").JSX.Element;
/** The UI rung in the secondary ink. */
export declare function TypographyMuted(props: ComponentProps<"p"> & ParagraphVariants): import("react").JSX.Element;
/** Reading-size body copy. `TypographyMuted` is the same ink one rung down. */
export declare function TypographyProse(props: ComponentProps<"p"> & ParagraphVariants): import("react").JSX.Element;
/** The deck's body-copy counterpart: the intro paragraph under a page title. */
export declare function TypographyLead(props: ComponentProps<"p"> & ParagraphVariants): import("react").JSX.Element;
/** A list at the prose rung, so it reads as body copy and not an aside. */
export declare function TypographyProseList({ className, children, ordered, ...props }: ComponentProps<"ul"> & {
    ordered?: boolean;
}): import("react").JSX.Element;
/**
 * Meta beside content: timestamps, counts, bylines, the key in a key-value row.
 *
 * Always the secondary ink and never a weight — a caption is secondary because
 * it is muted, and 500 on top would have the colour and the weight arguing.
 * `sm` is the default because meta is separated from body by ink, not size;
 * the smaller rungs are a deliberate step down, not the norm.
 *
 * Leading is pinned per size rather than left to the rung. Plenty of captions
 * are a wrapped sentence, and the ramp's tight setting sets those cramped —
 * descenders nearly on the caps below. `leading-normal` writes `--tw-leading`,
 * which is the variable the `text-*` step reads, so 1.5 wins at every rung.
 *
 * `inherit` is the parenthetical inside a heading, an eyebrow or a stat. It
 * takes the size of whatever set it and resets the weight, because the only
 * reason to sit there is to be quieter than the thing you qualify — and every
 * container that sets a size for you sets a weight too.
 */
declare const captionVariants: (props?: ({
    size?: "sm" | "inherit" | "xs" | "2xs" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type CaptionVariants = VariantProps<typeof captionVariants>;
/**
 * `as` covers the one thing that genuinely differs between call sites: whether
 * the run is inline beside its subject or a block under it. The classes do not
 * change with it, so it is an element choice rather than a second component.
 */
export declare function TypographyCaption({ className, size, as, children, ...props }: ComponentProps<"span"> & CaptionVariants & {
    as?: "span" | "p" | "small";
}): import("react").JSX.Element;
/**
 * Small print set as a block: a note under the thing it annotates, rather than
 * an aside inline with it. Same rung and same ink as the caption — small print
 * is small because it is muted, and dropping it a rung as well is what made
 * both apps hand-roll their own.
 */
export declare function TypographySmall(props: ComponentProps<"span"> & CaptionVariants): import("react").JSX.Element;
/**
 * The label role: a form label, a column header, the key a reader scans for.
 * 500 is the only weight bump a dense surface needs below a heading.
 *
 * `as` is here for the same reason it is on `TypographyEyebrow`: a config panel
 * names its sections at this size, and those names are the page's outline. The
 * alternative a consumer reaches for is a hand-rolled `<h2>` wearing these two
 * classes, which is how a label drifts from the ones beside it. The classes do
 * not change with the element.
 */
export declare function TypographyLabel({ className, as, children, ...props }: ComponentProps<"span"> & {
    as?: "span" | "p" | "div" | "label" | "h1" | "h2" | "h3" | "h4";
}): import("react").JSX.Element;
/**
 * A numeric readout. Size and colour ride in via className per use.
 *
 * Tabular is right in a column and wrong in a headline: even advances are what
 * stop a value jittering as it refreshes, and they cost a headline figure the
 * spacing its designer drew, since a lone 1 carries the side bearings of an 8.
 * Keep `tabular` anywhere a value updates in place.
 */
export declare function TypographyStat({ className, figures, children, ...props }: ComponentProps<"span"> & {
    figures?: "tabular" | "proportional";
}): import("react").JSX.Element;
/**
 * A run of code inside a sentence: a command, a field name, a trigger.
 *
 * Everything is in `em`, not a rung: the chip has to sit in whatever size the
 * sentence around it is set at, and the ramp differs per surface. The 0.9 is an
 * optical correction — the mono face carries a taller x-height than the sans.
 */
export declare function TypographyInlineCode({ className, children, ...props }: ComponentProps<"code">): import("react").JSX.Element;
/**
 * A statement about the surface, not the link: `foreground` inside a paragraph,
 * `primary` when the link is the point of the line, `secondary` for a note
 * beneath a hero where `primary` would compete with the CTA beside it, `muted`
 * for a link that sits under one.
 */
declare const LINK_TONES: {
    readonly foreground: "font-medium text-foreground";
    readonly primary: "font-medium text-primary";
    readonly secondary: "text-secondary-ink";
    readonly muted: "text-muted-foreground";
};
export type LinkTone = keyof typeof LINK_TONES;
type TypographyLinkProps = Omit<ComponentProps<"a">, "href"> & {
    href: string;
    children: ReactNode;
    tone?: LinkTone;
    /** Defaults on for an off-site link. Turn it off for one that starts a flow the reader should stay in. */
    newTab?: boolean;
    /**
     * A trailing arrow, for a link that ends a sentence and leads somewhere. The
     * glyph follows the href: `↗` when the link leaves the site, `→` when it does
     * not. That is the convention, and it is not a call site's to get wrong.
     */
    addArrow?: boolean;
};
/**
 * The inline link.
 *
 * Internal and external are decided from the href, never at the call site: an
 * href with a scheme renders a plain anchor and, if it is http(s), opens away
 * with `rel="noopener noreferrer"`; everything else routes through the router's
 * Link. `newTab` is the one override, for an off-site href that starts a flow
 * the reader should stay in. Call-site props apply last, so a passed
 * `target`/`rel` still wins.
 *
 * The router is `next-view-transitions`, imported rather than injected. Every
 * project on this package is a Next app and wants the same link, and a factory
 * bought router-agnosticism nobody used at the price of a component that could
 * not be imported by name — which is how one call site ended up on the unbound
 * version and lost its decoration.
 */
export declare function TypographyLink({ href, children, tone, newTab, addArrow, className, ...props }: TypographyLinkProps): import("react").JSX.Element;
export {};
