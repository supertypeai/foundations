import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../cn.js";
/** The reading rung. Stated once — a second copy is how two pages drift apart. */
const READING_RUNG = "text-pretty text-lg leading-relaxed";
/** A UI paragraph: interface copy, not something set to be read at length. */
export function TypographyP({ className, children, ...props }) {
    return (_jsx("p", { className: cn("text-sm text-foreground", className), ...props, children: children }));
}
/** The same rung as `TypographyP`, in the secondary ink. */
export function TypographyMuted({ className, children, ...props }) {
    return (_jsx("p", { className: cn("text-sm text-muted-foreground", className), ...props, children: children }));
}
/** A paragraph at reading size. `TypographyMuted` is the same ink one rung down. */
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
 * The quotemark is `currentColor`, not a brand variable — tint the whole block.
 * `hideQuotemark` is for a quote its context already introduced.
 */
export function TypographyQuote({ className, children, hideQuotemark, ...props }) {
    return (_jsxs("blockquote", { className: cn("my-6 border-l-[3px] border-border pl-5 text-lg italic leading-relaxed text-foreground", className), ...props, children: [!hideQuotemark && (_jsx("svg", { className: "mb-3 h-6 w-6 opacity-40", "aria-hidden": "true", xmlns: "http://www.w3.org/2000/svg", fill: "currentColor", viewBox: "0 0 18 14", children: _jsx("path", { d: "M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" }) })), children] }));
}
/**
 * A statement about the surface, not the link: `foreground` inside a paragraph,
 * `primary` when the link is the point of the line, `muted` beside a CTA.
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
 * A factory, not context: a Provider is a client component and would drag every
 * typography component over the boundary. An href with a scheme renders a plain
 * anchor; the rest route through the injected Link. Call-site props apply last,
 * so a passed `target`/`rel` wins over the defaults.
 */
export function createProseLink(LinkComponent) {
    return function TypographyLink({ href, children, tone = "foreground", newTab, className, ...props }) {
        const style = proseLinkClass(tone, className);
        const external = /^[a-z][a-z0-9+.-]*:/i.test(href);
        if (external) {
            const away = newTab ?? href.startsWith("http");
            return (_jsx("a", { href: href, className: style, ...(away ? { target: "_blank", rel: "noopener noreferrer" } : {}), ...props, children: children }));
        }
        return (_jsx(LinkComponent, { href: href, className: style, ...props, children: children }));
    };
}
/** Off-site link. Inline SVG, not an icon import — one glyph is not a dependency. */
export function TypographyExternal({ href, children, className, tone = "foreground", ...props }) {
    return (_jsxs("a", { href: href, target: "_blank", rel: "noopener noreferrer", className: cn(proseLinkClass(tone), "inline", className), ...props, children: [children, _jsx("svg", { "aria-hidden": "true", className: "ml-0.5 inline h-3.5 w-3.5 align-baseline", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "M7 17 17 7M7 7h10v10" }) })] }));
}
/** `<kbd>`, not `<code>`: it means "press this", and prose.css leaves it alone. */
export function TypographyKeycap({ className, children, ...props }) {
    return (_jsx("kbd", { className: cn("rounded-sm border border-border bg-muted px-1.5 py-0.5 font-mono text-2xs font-semibold text-foreground", className), ...props, children: children }));
}
