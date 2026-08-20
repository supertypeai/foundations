import type { ComponentProps, ReactNode } from "react";
import type { InjectedComponent } from "../injection.js";
/** A UI paragraph: interface copy, not something set to be read at length. */
export declare function TypographyP({ className, children, ...props }: ComponentProps<"p">): import("react").JSX.Element;
/** The same rung as `TypographyP`, in the secondary ink. */
export declare function TypographyMuted({ className, children, ...props }: ComponentProps<"p">): import("react").JSX.Element;
/** A paragraph at reading size. `TypographyMuted` is the same ink one rung down. */
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
 * The quotemark is `currentColor`, not a brand variable — tint the whole block.
 * `hideQuotemark` is for a quote its context already introduced.
 */
export declare function TypographyQuote({ className, children, hideQuotemark, ...props }: ComponentProps<"blockquote"> & {
    hideQuotemark?: boolean;
}): import("react").JSX.Element;
/**
 * A statement about the surface, not the link: `foreground` inside a paragraph,
 * `primary` when the link is the point of the line, `muted` beside a CTA.
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
type ProseLinkProps = Omit<ComponentProps<"a">, "href"> & {
    href: string;
    children: ReactNode;
    tone?: LinkTone;
    /** Defaults on for an off-site link. Turn it off for one that starts a flow the reader should stay in. */
    newTab?: boolean;
};
/**
 * A factory, not context: a Provider is a client component and would drag every
 * typography component over the boundary. An href with a scheme renders a plain
 * anchor; the rest route through the injected Link. Call-site props apply last,
 * so a passed `target`/`rel` wins over the defaults.
 */
export declare function createProseLink(LinkComponent: ProseLinkComponent): ({ href, children, tone, newTab, className, ...props }: ProseLinkProps) => import("react").JSX.Element;
/** Off-site link. Inline SVG, not an icon import — one glyph is not a dependency. */
export declare function TypographyExternal({ href, children, className, tone, ...props }: ComponentProps<"a"> & {
    href: string;
    tone?: LinkTone;
}): import("react").JSX.Element;
/** `<kbd>`, not `<code>`: it means "press this", and prose.css leaves it alone. */
export declare function TypographyKeycap({ className, children, ...props }: ComponentProps<"kbd">): import("react").JSX.Element;
export {};
