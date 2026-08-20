import type { ComponentProps, ReactNode } from "react";
import type { InjectedComponent } from "../injection.js";
/** A UI paragraph: interface copy, not something set to be read at length. */
export declare function TypographyP({ className, children, ...props }: ComponentProps<"p">): import("react").JSX.Element;
/** The same rung as `TypographyP`, in the secondary ink. */
export declare function TypographyMuted({ className, children, ...props }: ComponentProps<"p">): import("react").JSX.Element;
/**
 * A paragraph at reading size, which is a size to read rather than an interface
 * size. `TypographyMuted` is the same ink one rung down, for a note beside a
 * control; this is what a page written to be read from the top is set in.
 */
export declare function TypographyProse({ className, children, ...props }: ComponentProps<"p">): import("react").JSX.Element;
/** A list at the prose rung, so it reads as body copy and not an aside. */
export declare function TypographyProseList({ className, children, ordered, ...props }: ComponentProps<"ul"> & {
    ordered?: boolean;
}): import("react").JSX.Element;
/** Meta beside content: timestamps, counts, bylines. Always the secondary ink. */
export declare function TypographyCaption({ className, children, ...props }: ComponentProps<"span">): import("react").JSX.Element;
export declare function TypographySmall({ className, children, ...props }: ComponentProps<"small">): import("react").JSX.Element;
/** A parenthetical inside a heading or label — quieter than what it qualifies. */
export declare function Descriptor({ className, children, ...props }: ComponentProps<"span">): import("react").JSX.Element;
export declare function TypographyInlineCode({ className, children, ...props }: ComponentProps<"code">): import("react").JSX.Element;
/**
 * A pull quote.
 *
 * The quotemark is optional and drawn in `currentColor`, not a brand variable:
 * the package has no brand colours, and a consumer that wants its own tints the
 * whole block. `hideQuotemark` is for a quote already introduced by its context,
 * where a second mark reads as decoration.
 */
export declare function TypographyQuote({ className, children, hideQuotemark, ...props }: ComponentProps<"blockquote"> & {
    hideQuotemark?: boolean;
}): import("react").JSX.Element;
/**
 * The three inks an inline link is set in, which is a statement about the
 * surface it sits on rather than about the link. `foreground` is a link inside a
 * paragraph the reader is already in; `primary` is a link that is the point of
 * the line it closes; `muted` is one in a note beneath a hero, where primary
 * would compete with the call to action beside it.
 */
export declare const LINK_TONES: {
    readonly foreground: "font-medium text-foreground";
    readonly primary: "font-medium text-primary";
    readonly muted: "text-muted-foreground";
};
export type LinkTone = keyof typeof LINK_TONES;
export declare function proseLinkClass(tone?: LinkTone, className?: string): string;
/** The app's router Link. See {@link InjectedComponent} for why it is loose. */
export type ProseLinkComponent = InjectedComponent;
type ProseLinkProps = {
    href: string;
    children: ReactNode;
    tone?: LinkTone;
    /** Defaults on for an off-site link. Turn it off for one that starts a flow the reader should stay in. */
    newTab?: boolean;
    className?: string;
};
/**
 * Builds the inline link component, bound to the router Link of the consuming app.
 *
 * A factory rather than React context on purpose: a context Provider has to be a
 * client component, and every typography component that read from it would be
 * dragged over the client boundary with it. This stays server-safe, and it keeps
 * `next` out of the package's dependencies — consumers pass their own Link
 * (`next/link`, `next-view-transitions`, or anything with the same shape).
 *
 *     export const TypographyLink = createProseLink(Link);
 *
 * Anything with a scheme (mailto:, an external site) renders as a plain anchor
 * and opens away from the app; everything else routes through the injected Link.
 * That is the distinction call sites otherwise each make by hand, occasionally
 * getting it wrong.
 */
export declare function createProseLink(LinkComponent: ProseLinkComponent): ({ href, children, tone, newTab, className, }: ProseLinkProps) => import("react").JSX.Element;
/**
 * An off-site link with the arrow affordance, for prose where the reader should
 * know before clicking that the link leaves. The arrow is inline SVG rather than
 * an icon-library import: the package carries no dependencies beyond clsx and
 * tailwind-merge, and one glyph is not worth breaking that for.
 */
export declare function TypographyExternal({ href, children, className, tone, ...props }: ComponentProps<"a"> & {
    href: string;
    tone?: LinkTone;
}): import("react").JSX.Element;
/**
 * A keyboard key. `<kbd>` rather than `<code>`: the element means "the user
 * presses this", which is what a shortcut in prose is saying, and it keeps the
 * inline-code CSS rule in prose.css from claiming it.
 */
export declare function TypographyKeycap({ className, children, ...props }: ComponentProps<"kbd">): import("react").JSX.Element;
export {};
