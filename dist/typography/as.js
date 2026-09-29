import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../cn.js";
import { Mark, shown } from "./mark.js";
/* A leading mark starts the line and the words fill the rest; an end mark follows
 * the words, so their column is only as wide as they are. */
const COLUMNS = {
    start: "grid-cols-[auto_minmax(0,1fr)]",
    end: "grid-cols-[minmax(0,max-content)_auto]",
    both: "grid-cols-[auto_minmax(0,max-content)_auto]",
};
/** Words that may hold blocks, which a phrasing element may not. */
const WORDS_MAY_BE_BLOCKS = new Set(["div"]);
/** The cast lives here once instead of in each primitive; a per-tag generic would
 * only narrow `ref`, at the price of a generic in four public signatures. `as`
 * is not forwarded — on the DOM node it is an unknown attribute.
 *
 * `display` is the role's own display, which a marked row replaces with a grid.
 * The caller's `className` outranks both, so `inline-flex` or `hidden sm:flex`
 * still stand; the row's alignment is always the mark's. */
export function TextAs({ as = "span", display, mark, markEnd, truncate = false, className, children, ...props }) {
    const As = as;
    const start = shown(mark);
    const end = shown(markEnd);
    if (!start && !end) {
        return _jsx(As, { className: cn(display, className, truncate && "truncate"), ...props, children: children });
    }
    const columns = COLUMNS[start && end ? "both" : start ? "start" : "end"];
    const Words = WORDS_MAY_BE_BLOCKS.has(as) ? "div" : "span";
    return (_jsxs(As, { className: cn("grid gap-x-2", columns, className, "items-baseline"), ...props, children: [start && _jsx(Mark, { children: mark }), _jsx(Words, { className: cn("min-w-0", truncate && "truncate"), children: children }), end && _jsx(Mark, { children: markEnd })] }));
}
