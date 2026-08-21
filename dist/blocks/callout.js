import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../cn.js";
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
const TONE = {
    /** The default: an explanation, not a problem. */
    muted: {
        box: "border-border bg-muted/40",
        title: "text-foreground",
        icon: "text-muted-foreground",
        rail: "bg-border",
    },
    /** Something failed and the reader needs to see that it did. */
    destructive: {
        box: "border-destructive/40 bg-destructive/5",
        title: "text-destructive",
        icon: "text-destructive",
        rail: "bg-destructive/60",
    },
    /** A prerequisite or a footgun: the reader can still proceed, but not blindly. */
    warn: {
        box: "border-warn/25 bg-warn/5",
        title: "text-warn-foreground",
        icon: "text-warn",
        rail: "bg-warn/60",
    },
    /** A detail that rewards the reader rather than warning them. */
    accent: {
        box: "border-primary/25 bg-primary/5",
        title: "text-foreground",
        icon: "text-primary",
        rail: "bg-primary/60",
    },
};
/**
 * Two densities, because this notice serves two ramps. `compact` is the product
 * default (12px title over 12px body, no rail) that the relay sheet and the contact
 * record already render. `editorial` is the docs form: body copy at reading size,
 * and a 3px accent rail carrying the tone so the surface itself can stay quiet.
 * Splitting on a prop rather than forking the component is the point of the file.
 */
export function Callout({ icon: Icon, title, tone = "muted", density = "compact", bodyClassName, action, children, className, }) {
    const t = TONE[tone];
    if (density === "editorial") {
        return (_jsx("div", { className: cn("relative overflow-hidden rounded-lg border py-3.5 pl-5 pr-4", t.box, className), children: _jsxs("div", { className: "flex items-start gap-2.5", children: [Icon && _jsx(Icon, { className: cn("mt-0.5 size-4 shrink-0", t.icon) }), _jsxs("div", { className: "flex min-w-0 flex-col gap-1", children: [title && (_jsx(TypographyLabel, { className: t.title, children: title })), _jsx(TypographyMuted, { className: cn("leading-relaxed", bodyClassName), children: children }), action && (_jsx("div", { className: "mt-1 flex items-center gap-1", children: action }))] })] }) }));
    }
    return (_jsxs("div", { className: cn("rounded-md border p-3", t.box, className), children: [title && (_jsxs(TypographySmall, { className: cn("flex items-center gap-1.5 font-medium", t.title), children: [Icon && _jsx(Icon, { className: cn("size-3.5 shrink-0", t.icon) }), title] })), _jsx(TypographyCaption, { className: cn("mt-1 block leading-relaxed", bodyClassName), children: children }), action && _jsx("div", { className: "mt-2 flex items-center gap-1", children: action })] }));
}
