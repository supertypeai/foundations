import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "../cn.js";
const TONES = {
    info: "border-border bg-muted text-foreground",
    warn: "border-border bg-accent text-accent-foreground",
    danger: "border-destructive/40 bg-destructive/10 text-foreground",
};
/** A callout inside prose: a note, a caveat, a deprecation. */
export function Banner({ className, tone = "info", children, ...props }) {
    return (_jsx("div", { className: cn("my-6 rounded-xl border px-4 py-3 text-sm leading-relaxed", TONES[tone], className), ...props, children: children }));
}
