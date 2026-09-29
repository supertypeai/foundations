import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../cn.js";
import { toneClass } from "../tone.js";
import { TypographyCaption, TypographyLabel, TypographyMuted, } from "../typography/paragraph.js";
import { Marked } from "../typography/mark.js";
// An inline notice explaining something the surface it sits in cannot say on its
// own. The body is a slot and renders as a div, since a caller passes lists and
// mono blocks that may not sit inside a <p>. Deliberately not a shadcn Alert:
// these are permanent, and must not announce themselves every time a sheet opens.
/**
 * No tone table of its own: the same seven `Button` and `TypographyLink` take, in
 * ../tone.ts. A callout is a panel, so it tints with `--tone-veil` (5%) where a
 * control uses `--tone-wash` (10%). That is all this file knows about colour.
 */
const BOX = "border-(color:--tone-line) bg-(--tone-veil)";
export function Callout({ icon: Icon, title, tone = "muted", density = "compact", bodyClassName, action, children, className, }) {
    const toned = toneClass(tone);
    const mark = Icon && _jsx(Icon, { className: "text-(color:--tone-hue)" });
    const body = (_jsx(TypographyMuted, { as: "div", className: cn("leading-relaxed", bodyClassName), children: children }));
    if (density === "editorial") {
        return (_jsxs("div", { className: cn("relative overflow-hidden rounded-lg border py-3.5 pl-5 pr-4", toned, BOX, className), children: [_jsx("span", { "aria-hidden": true, className: "absolute inset-y-0 left-0 w-[3px] bg-(--tone-line)" }), _jsxs(Marked, { className: "gap-x-2.5 gap-y-1", mark: mark, title: title ? _jsx(TypographyLabel, { className: "text-(color:--tone-hue)", children: title }) : body, children: [title && body, action && _jsx("div", { className: "mt-1 flex items-center gap-1", children: action })] })] }));
    }
    return (_jsxs("div", { className: cn("rounded-md border p-3", toned, BOX, className), children: [title && (_jsx(TypographyCaption, { as: "p", className: "gap-x-1.5 font-medium text-(color:--tone-hue)", mark: mark, children: title })), _jsx(TypographyCaption, { as: "div", className: cn("mt-1 leading-relaxed", bodyClassName), children: children }), action && _jsx("div", { className: "mt-2 flex items-center gap-1", children: action })] }));
}
