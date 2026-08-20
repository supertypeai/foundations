import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../cn.js";
/**
 * The reading rung, for every prose block on an editorial surface: essay
 * paragraphs, hero ledes, the lists below. Stated once, because a second copy of
 * this string is how two pages that should read alike stop doing so.
 */
const READING_RUNG = "text-pretty text-lg leading-relaxed";
/** A UI paragraph: interface copy, not something set to be read at length. */
export function TypographyP({ className, children, ...props }) {
    return (_jsx("p", { className: cn("text-sm text-foreground", className), ...props, children: children }));
}
/** The same rung as `TypographyP`, in the secondary ink. */
export function TypographyMuted({ className, children, ...props }) {
    return (_jsx("p", { className: cn("text-sm text-muted-foreground", className), ...props, children: children }));
}
/**
 * A paragraph at reading size, which is a size to read rather than an interface
 * size. `TypographyMuted` is the same ink one rung down, for a note beside a
 * control; this is what a page written to be read from the top is set in.
 */
export function TypographyProse({ className, children, ...props }) {
    return (_jsx(TypographyMuted, { className: cn(READING_RUNG, className), ...props, children: children }));
}
/** A list at the prose rung, so it reads as body copy and not an aside. */
export function TypographyProseList({ className, children, ordered, ...props }) {
    const List = ordered ? "ol" : "ul";
    return (_jsx(List, { className: cn("my-4 flex flex-col gap-1 pl-6 text-muted-foreground [&>li]:pl-1.5", ordered ? "list-decimal" : "list-disc", READING_RUNG, className), ...props, children: children }));
}
/** Meta beside content: timestamps, counts, bylines. Always the secondary ink. */
export function TypographyCaption({ className, children, ...props }) {
    return (_jsx("span", { className: cn("text-xs leading-normal text-muted-foreground", className), ...props, children: children }));
}
export function TypographySmall({ className, children, ...props }) {
    return (_jsx("small", { className: cn("text-xs leading-normal text-muted-foreground", className), ...props, children: children }));
}
/** A parenthetical inside a heading or label — quieter than what it qualifies. */
export function Descriptor({ className, children, ...props }) {
    return (_jsx("span", { className: cn("font-normal text-muted-foreground", className), ...props, children: children }));
}
export function TypographyInlineCode({ className, children, ...props }) {
    return (_jsx("code", { className: cn("rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground", className), ...props, children: children }));
}
/**
 * A pull quote.
 *
 * The quotemark is optional and drawn in `currentColor`, not a brand variable:
 * the package has no brand colours, and a consumer that wants its own tints the
 * whole block. `hideQuotemark` is for a quote already introduced by its context,
 * where a second mark reads as decoration.
 */
export function TypographyQuote({ className, children, hideQuotemark, ...props }) {
    return (_jsxs("blockquote", { className: cn("my-6 border-l-[3px] border-border pl-5 text-lg italic leading-relaxed text-foreground", className), ...props, children: [!hideQuotemark && (_jsx("svg", { className: "mb-3 h-6 w-6 opacity-40", "aria-hidden": "true", xmlns: "http://www.w3.org/2000/svg", fill: "currentColor", viewBox: "0 0 18 14", children: _jsx("path", { d: "M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" }) })), children] }));
}
/**
 * The three inks an inline link is set in, which is a statement about the
 * surface it sits on rather than about the link. `foreground` is a link inside a
 * paragraph the reader is already in; `primary` is a link that is the point of
 * the line it closes; `muted` is one in a note beneath a hero, where primary
 * would compete with the call to action beside it.
 */
export const LINK_TONES = {
    foreground: "font-medium text-foreground",
    primary: "font-medium text-primary",
    muted: "text-muted-foreground",
};
const LINK_DECORATION = "underline decoration-dotted decoration-1 decoration-muted-foreground decoration-skip-ink-none underline-offset-2 hover:decoration-solid hover:decoration-current/70";
export function proseLinkClass(tone = "foreground", className) {
    return cn(LINK_TONES[tone], LINK_DECORATION, className);
}
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
export function createProseLink(LinkComponent) {
    return function TypographyLink({ href, children, tone = "foreground", newTab, className, }) {
        const style = proseLinkClass(tone, className);
        const external = /^[a-z][a-z0-9+.-]*:/i.test(href);
        if (external) {
            const away = newTab ?? href.startsWith("http");
            return (_jsx("a", { href: href, className: style, ...(away ? { target: "_blank", rel: "noopener noreferrer" } : {}), children: children }));
        }
        return (_jsx(LinkComponent, { href: href, className: style, children: children }));
    };
}
/**
 * An off-site link with the arrow affordance, for prose where the reader should
 * know before clicking that the link leaves. The arrow is inline SVG rather than
 * an icon-library import: the package carries no dependencies beyond clsx and
 * tailwind-merge, and one glyph is not worth breaking that for.
 */
export function TypographyExternal({ href, children, className, tone = "foreground", ...props }) {
    return (_jsxs("a", { href: href, target: "_blank", rel: "noopener noreferrer", className: cn(proseLinkClass(tone), "inline", className), ...props, children: [children, _jsx("svg", { "aria-hidden": "true", className: "ml-0.5 inline h-3.5 w-3.5 align-baseline", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "M7 17 17 7M7 7h10v10" }) })] }));
}
/**
 * A keyboard key. `<kbd>` rather than `<code>`: the element means "the user
 * presses this", which is what a shortcut in prose is saying, and it keeps the
 * inline-code CSS rule in prose.css from claiming it.
 */
export function TypographyKeycap({ className, children, ...props }) {
    return (_jsx("kbd", { className: cn("rounded-sm border border-border bg-muted px-1.5 py-0.5 font-mono text-2xs font-semibold text-foreground", className), ...props, children: children }));
}
