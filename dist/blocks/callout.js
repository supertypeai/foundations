import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../cn.js";
import { toneClass } from "../tone.js";
import { TypographyCaption, TypographyLabel, TypographyMuted, TypographySmall, } from "../typography/paragraph.js";
// ---------------------------------------------------------------------------
// An inline notice: a titled paragraph that explains something the surface it sits in cannot say
// on its own — why a row was dropped, why a payload is hidden, why a timeline is incomplete.
//
// Extracted because there were six of these hand-rolled across the relay detail sheet and the
// contact record, each re-declaring the same border, the same muted fill, the same `text-xs
// font-medium` title and the same `text-xs text-muted-foreground` body. Three of the six had
// already drifted on the radius. Hand-rolled type styles are also exactly what the project's own
// guidance forbids, and six copies is how a rule like that gets broken without anyone deciding to.
//
// Deliberately not a shadcn Alert. Alert is a page-level, role="alert" affordance for something
// that just happened; these are quiet, permanent explanations sitting inside a panel, and they
// must not announce themselves to a screen reader every time a sheet opens.
// ---------------------------------------------------------------------------
/**
 * No tone table of its own: the same seven `Button` and `TypographyLink` take.
 * The four hand-tuned rows this file used to carry are gone, `accent` among them
 * — it was `--primary` under another name, which is why a "tip" callout and a
 * "primary" one were indistinguishable. `muted` keeps its name and its values.
 * See ../tone.ts.
 *
 * A callout is a panel, so it tints with `--tone-veil` (5%) where a control uses
 * `--tone-wash` (10%). That is the only thing this file knows about colour.
 */
const BOX = "border-(color:--tone-line) bg-(--tone-veil)";
export function Callout({ icon: Icon, title, tone = "muted", density = "compact", bodyClassName, action, children, className, }) {
    const toned = toneClass(tone);
    if (density === "editorial") {
        return (_jsxs("div", { className: cn("relative overflow-hidden rounded-lg border py-3.5 pl-5 pr-4", toned, BOX, className), children: [_jsx("span", { "aria-hidden": true, className: "absolute inset-y-0 left-0 w-[3px] bg-(--tone-line)" }), _jsxs("div", { className: "flex items-start gap-2.5", children: [Icon && (_jsx(Icon, { className: "mt-0.5 size-4 shrink-0 text-(color:--tone-hue)" })), _jsxs("div", { className: "flex min-w-0 flex-col gap-1", children: [title && (_jsx(TypographyLabel, { className: "text-(color:--tone-hue)", children: title })), _jsx(TypographyMuted, { className: cn("leading-relaxed", bodyClassName), children: children }), action && (_jsx("div", { className: "mt-1 flex items-center gap-1", children: action }))] })] })] }));
    }
    return (_jsxs("div", { className: cn("rounded-md border p-3", toned, BOX, className), children: [title && (_jsxs(TypographySmall, { className: "flex items-center gap-1.5 font-medium text-(color:--tone-hue)", children: [Icon && _jsx(Icon, { className: "size-3.5 shrink-0" }), title] })), _jsx(TypographyCaption, { className: cn("mt-1 block leading-relaxed", bodyClassName), children: children }), action && _jsx("div", { className: "mt-2 flex items-center gap-1", children: action })] }));
}
