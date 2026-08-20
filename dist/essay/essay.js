import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../cn.js";
import { headingClass, TypographyEyebrow, TypographyH1, TypographyH2, TypographyH3, } from "../typography/header.js";
import { TypographyCaption, TypographyMuted, TypographyProse, } from "../typography/paragraph.js";
import { EssayColumns } from "./layout.js";
import { TableOfContents } from "./contents.js";
/** Pass-through: keeps the className the shell relies on for layout. */
const PlainReveal = ({ children, className, }) => _jsx("div", { className: className, children: children });
const NoGlow = () => null;
// Apostrophes are dropped rather than treated as a separator, so "What we don't
// collect" anchors at `what-we-dont-collect` the way a reader would type it.
const slugify = (heading) => heading
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
/**
 * Resolved for the whole document, since only the full list settles two cases:
 * a heading with no ASCII slugs to "" (which `useScrollSpy` discards), and two
 * differing only in case collide. An explicit `id` is always honoured.
 */
const anchorIds = (sections) => {
    const seen = new Map();
    return sections.map((section, i) => {
        const base = section.id ?? (slugify(section.heading) || `section-${i + 1}`);
        const taken = seen.get(base) ?? 0;
        seen.set(base, taken + 1);
        return taken ? `${base}-${taken + 1}` : base;
    });
};
export function createEssay({ Reveal = PlainReveal, Glow = NoGlow, } = {}) {
    /** Left aligned: the eye has to reach the first line of prose either way. */
    function EssayHeader({ eyebrow, title, lede, byline, }) {
        return (_jsxs("header", { className: "relative overflow-hidden pb-12 pt-16 sm:pt-24", children: [_jsx(Glow, { className: "-top-40 left-1/2 -translate-x-1/2", intensity: 0.16 }), _jsx(EssayColumns, { children: _jsxs(Reveal, { eager: true, className: "flex flex-col gap-6", children: [_jsx(TypographyEyebrow, { children: eyebrow }), _jsx(TypographyH1, { variant: "display", className: "text-balance", children: title }), lede && (_jsx(TypographyMuted, { className: "text-pretty text-xl leading-relaxed", children: lede })), byline && (_jsx(TypographyMuted, { className: "border-t border-border/60 pt-5 text-base", children: byline }))] }) })] }));
    }
    /** The reading column, with the sticky index sitting in its left margin. */
    function EssayLayout({ index, children, }) {
        return (_jsx(EssayColumns, { className: "pb-16 sm:pb-24", aside: _jsx("div", { className: "sticky top-24", children: _jsx(TableOfContents, { sections: index }) }), children: _jsx("div", { className: "flex flex-col gap-16 border-t border-border pt-12 lg:border-t-0 lg:pt-0", children: children }) }));
    }
    /** The heading carries the anchor, offset so it lands under the sticky nav. */
    function EssaySection({ id, heading, children, }) {
        return (_jsx("section", { id: id, className: "scroll-mt-24", children: _jsxs(Reveal, { className: "flex flex-col gap-5", children: [_jsx(TypographyH2, { variant: "essay", className: "text-balance", children: heading }), children] }) }));
    }
    /** One per essay: a page with three of them has decided nothing. */
    function EssayPullQuote({ children }) {
        return (_jsx(Reveal, { children: _jsx("blockquote", { className: cn(headingClass("essay"), "text-balance border-l-2 border-primary/40 py-1 pl-6 leading-snug"), children: children }) }));
    }
    /** Generic on purpose: a page hands it anything; this decides only the fit. */
    function EssayFigure({ children, caption, }) {
        return (_jsx(Reveal, { variant: "scale", children: _jsxs("figure", { className: "flex flex-col gap-3", children: [children, _jsx(TypographyCaption, { className: "text-pretty", children: caption })] }) }));
    }
    /**
       * A grid says the items are interchangeable; these hand output to each other.
       * An ordered list says that without an arrow — the ordinal is the ornament.
       */
    function EssayMovements({ items }) {
        return (_jsx("ol", { className: "flex flex-col", children: items.map(({ title, body }, i) => (_jsxs("li", { className: "border-t border-border/60 py-8 first:border-t-0 first:pt-0 last:pb-0 sm:grid sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-6", children: [_jsx(TypographyCaption, { className: "block pt-2 font-mono tabular-nums text-primary max-sm:mb-2", children: String(i + 1).padStart(2, "0") }), _jsxs("div", { className: "flex flex-col gap-3", children: [_jsx(TypographyH3, { variant: "essay", children: title }), body] })] }, title))) }));
    }
    /**
     * A reference document as data: the index derives from the sections, so a
     * retitling cannot leave the rail scrolling to nothing.
     */
    function EssayDocument({ sections, ...header }) {
        // Resolved once and shared, so the index and the sections cannot disagree
        // about what a section is called.
        const ids = anchorIds(sections);
        return (_jsxs("article", { children: [_jsx(EssayHeader, { ...header }), _jsx(EssayLayout, { index: sections.map((s, i) => ({ id: ids[i], label: s.heading })), children: sections.map((s, i) => (_jsx(EssaySection, { id: ids[i], heading: s.heading, children: typeof s.body === "string" ? (_jsx(TypographyProse, { children: s.body })) : (s.body) }, ids[i]))) })] }));
    }
    return {
        EssayHeader,
        EssayLayout,
        EssaySection,
        EssayPullQuote,
        EssayFigure,
        EssayMovements,
        EssayDocument,
    };
}
