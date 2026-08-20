import { jsx as _jsx } from "react/jsx-runtime";
import { TypographyH1, TypographyH2, TypographyH3, TypographyH4, } from "./typography/header.js";
import { cn } from "./cn.js";
import { Accordion, Accordions } from "./blocks/accordion.js";
import { Banner } from "./blocks/banner.js";
import { Cards, createCard } from "./blocks/card.js";
import { Step, Steps } from "./blocks/steps.js";
import { Tab, Tabs } from "./blocks/tabs.js";
import { TypographyProse, TypographyProseList, TypographyQuote, createProseLink, } from "./typography/paragraph.js";
export function createProseMdxComponents({ Link, Image }) {
    const ProseLink = createProseLink(Link);
    const Card = createCard(Link);
    return {
        // Authorable blocks. Unlike the elements below these ARE called by hand in
        // MDX, so they take props — but never a `className`: an author writing
        // <Card> is choosing a component, not restyling one.
        Card,
        Cards,
        Accordion,
        Accordions,
        Banner,
        Tabs,
        Tab,
        Steps,
        Step,
        h1: (props) => (_jsx(TypographyH1, { variant: "display", ...props })),
        h2: (props) => (_jsx(TypographyH2, { variant: "essay", ...props })),
        h3: (props) => (_jsx(TypographyH3, { variant: "essay", ...props })),
        h4: (props) => _jsx(TypographyH4, { ...props }),
        p: (props) => _jsx(TypographyProse, { ...props }),
        ul: (props) => _jsx(TypographyProseList, { ...props }),
        ol: (props) => (_jsx(TypographyProseList, { ordered: true, ...props })),
        li: (props) => (_jsx("li", { className: "[&>ul]:mt-2 [&>ol]:mt-2", ...props })),
        blockquote: ({ children, ...props }) => (
        // No quotemark: a markdown `>` block is already marked as a quote by its
        // rule and indent, and the glyph on top of that reads as decoration.
        _jsx(TypographyQuote, { hideQuotemark: true, ...props, children: children })),
        a: ({ href = "", children }) => (_jsx(ProseLink, { href: href, children: children })),
        /**
         * The frame only — never set `color`, or it beats shiki's token spans.
         * `tabIndex` keeps a horizontally scrolling block reachable by keyboard.
         */
        pre: ({ className, ...props }) => (_jsx("pre", { tabIndex: 0, className: cn("my-6 overflow-x-auto rounded-xl border border-border p-4 text-sm leading-relaxed", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className), ...props })),
        img: ({ alt = "", ...props }) => {
            const className = "my-6 h-auto max-w-full rounded-xl border border-border";
            if (Image && props.width && props.height) {
                return _jsx(Image, { alt: alt, className: className, ...props });
            }
            // eslint-disable-next-line @next/next/no-img-element
            return _jsx("img", { alt: alt, className: className, ...props });
        },
        hr: () => _jsx("hr", { className: "my-12 border-border" }),
        strong: (props) => (_jsx("strong", { className: "font-semibold text-foreground", ...props })),
        table: (props) => (_jsx("div", { className: "mt-6 overflow-x-auto rounded-xl border border-border", children: _jsx("table", { className: "w-full border-collapse text-sm", ...props }) })),
        th: (props) => (_jsx("th", { className: "border-b border-border bg-muted/40 px-4 py-2.5 text-left font-semibold text-foreground", ...props })),
        td: (props) => (_jsx("td", { className: "border-b border-border/60 px-4 py-2.5 align-top text-muted-foreground", ...props })),
    };
}
