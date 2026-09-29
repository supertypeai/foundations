import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Children, } from "react";
import { TypographyH1, TypographyH2, TypographyH3, TypographyH4, } from "./typography/header.js";
import { cn } from "./cn.js";
import Image from "next/image";
import { Disclosure, DisclosureGroup } from "./blocks/accordion.js";
import { Callout } from "./blocks/callout.js";
import { Card, Cards } from "./blocks/card.js";
import { Step, Steps } from "./blocks/steps.js";
import { TabGroup } from "./blocks/tabs.js";
import { TypographyProse, TypographyProseList, TypographyLink, } from "./typography/paragraph.js";
/**
 * The tab shape an MDX author writes, and the only place in the package that
 * speaks it. Children pair with `items` by position, since a caller writing
 * markdown has no value to bind; matching `value` would drop a panel the moment a
 * label was edited. This lived in `TabGroup` and made it unusable everywhere else.
 */
function MdxTabs({ items, children }) {
    const panels = Children.toArray(children);
    return (_jsx(TabGroup, { tabs: items.map((label, i) => ({
            value: label,
            label,
            content: panels[i],
        })) }));
}
/** `value` names the panel at the call site; it is not used for matching. */
function MdxTab({ children }) {
    return _jsx(_Fragment, { children: children });
}
/**
 * A heading with an id links to itself, so a reader can copy a section's address.
 * The anchor keeps the heading's ink: routed through `a` below, it painted every
 * heading as a body link. `rehype-slug` supplies the ids. Drop
 * `rehype-autolink-headings`, whose anchor would nest inside this one.
 */
function selfLinked(Heading) {
    return function SelfLinked({ children, ...props }) {
        return (_jsx(Heading, { ...props, children: props.id ? (_jsx("a", { href: `#${props.id}`, className: "decoration-border decoration-1 underline-offset-4 hover:underline", children: children })) : (children) }));
    };
}
/**
 * Rendered from markdown syntax, so there is no call site and no knob — a knob
 * here is one every project turns differently. Headings carry variants and this
 * map binds them; retune in CSS by moving the `--text-*` rung, or with
 * `.editorial` over the subtree.
 *
 * No element here carries a margin. The body goes inside `ProseFlow`, which
 * spaces each block by the one before it.
 *
 * A constant rather than a factory: the router and the image component are the
 * package's now, so there is nothing left for a consumer to inject.
 */
export const proseMdxComponents = {
    // Authorable blocks. Unlike the elements below these ARE called by hand in
    // MDX, so they take props — but never a `className`: an author writing
    // <Card> is choosing a component, not restyling one.
    Card,
    Cards,
    Accordions: DisclosureGroup,
    Accordion: Disclosure,
    Banner: (props) => (_jsx(Callout, { density: "editorial", ...props })),
    Tabs: MdxTabs,
    Tab: MdxTab,
    Steps,
    Step,
    h1: (props) => (_jsx(TypographyH1, { variant: "display", ...props })),
    h2: selfLinked(TypographyH2),
    h3: selfLinked(TypographyH3),
    h4: selfLinked(TypographyH4),
    p: (props) => _jsx(TypographyProse, { ...props }),
    ul: (props) => _jsx(TypographyProseList, { ...props }),
    ol: (props) => (_jsx(TypographyProseList, { ordered: true, ...props })),
    li: (props) => (_jsx("li", { className: "[&>ul]:mt-2 [&>ol]:mt-2", ...props })),
    // No quotemark glyph: a markdown `>` block is already marked as a quote by
    // its rule and its indent, and a mark on top of that reads as decoration.
    blockquote: ({ className, ...props }) => (_jsx("blockquote", { className: cn("border-l-[3px] border-border pl-5 text-lg italic leading-relaxed text-foreground", className), ...props })),
    // The rest of the props carry what remark-gfm's footnotes link by: the id a
    // backref points at, `data-footnote-ref`, and the backref's aria-label.
    a: ({ href = "", children, ...props }) => (_jsx(TypographyLink, { href: href, ...props, children: children })),
    /**
     * The frame only — never set `color`, or it beats shiki's token spans.
     * `tabIndex` keeps a horizontally scrolling block reachable by keyboard.
     */
    pre: ({ className, ...props }) => (_jsx("pre", { tabIndex: 0, className: cn("overflow-x-auto rounded-xl border border-border p-4 text-sm leading-relaxed", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className), ...props })),
    img: ({ alt = "", src, width, height, ...props }) => {
        const className = "h-auto max-w-full rounded-xl border border-border";
        // `next/image` needs a real src and intrinsic dimensions, which a markdown
        // `![](…)` lacks unless a remark plugin measured them. The plain `<img>` is
        // the fallback for when it did not.
        const w = Number(width);
        const h = Number(height);
        if (typeof src === "string" && w > 0 && h > 0) {
            return (_jsx(Image, { src: src, width: w, height: h, alt: alt, className: className, ...props }));
        }
        // eslint-disable-next-line @next/next/no-img-element
        return (_jsx("img", { src: typeof src === "string" ? src : undefined, width: width, height: height, alt: alt, className: className, ...props }));
    },
    hr: () => _jsx("hr", { className: "border-border" }),
    strong: (props) => (_jsx("strong", { className: "font-semibold text-foreground", ...props })),
    table: (props) => (_jsx("div", { className: "overflow-x-auto rounded-xl border border-border", children: _jsx("table", { className: "w-full border-collapse text-sm", ...props }) })),
    th: (props) => (_jsx("th", { className: "border-b border-border bg-muted/40 px-4 py-2.5 text-left font-semibold text-foreground", ...props })),
    td: (props) => (_jsx("td", { className: "border-b border-border/60 px-4 py-2.5 align-top text-muted-foreground", ...props })),
};
