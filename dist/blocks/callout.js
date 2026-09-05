import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../cn.js";
import { toneClass } from "../tone.js";
import { TypographyCaption, TypographyLabel, TypographyMuted, TypographySmall, } from "../typography/paragraph.js";
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
    if (density === "editorial") {
        return (_jsxs("div", { className: cn("relative overflow-hidden rounded-lg border py-3.5 pl-5 pr-4", toned, BOX, className), children: [_jsx("span", { "aria-hidden": true, className: "absolute inset-y-0 left-0 w-[3px] bg-(--tone-line)" }), _jsxs("div", { className: "flex items-start gap-2.5", children: [Icon && (_jsx(Icon, { className: "mt-0.5 size-4 shrink-0 text-(color:--tone-hue)" })), _jsxs("div", { className: "flex min-w-0 flex-col gap-1", children: [title && (_jsx(TypographyLabel, { className: "text-(color:--tone-hue)", children: title })), _jsx(TypographyMuted, { as: "div", className: cn("leading-relaxed", bodyClassName), children: children }), action && (_jsx("div", { className: "mt-1 flex items-center gap-1", children: action }))] })] })] }));
    }
    return (_jsxs("div", { className: cn("rounded-md border p-3", toned, BOX, className), children: [title && (_jsxs(TypographySmall, { className: "flex items-center gap-1.5 font-medium text-(color:--tone-hue)", children: [Icon && _jsx(Icon, { className: "size-3.5 shrink-0" }), title] })), _jsx(TypographyCaption, { as: "div", className: cn("mt-1 leading-relaxed", bodyClassName), children: children }), action && _jsx("div", { className: "mt-2 flex items-center gap-1", children: action })] }));
}
