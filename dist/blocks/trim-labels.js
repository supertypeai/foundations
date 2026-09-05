import { jsx as _jsx } from "react/jsx-runtime";
import { Children } from "react";
import { CAP_TRIM } from "../typography/align.js";
/**
 * Wrap a control's string labels so the row centres on the letters, not the line
 * box. The trim is the browser's own arithmetic on its own metrics, where a model
 * of it needs a metrics table that can disagree. Not for a label that also clips:
 * see ../typography/align.ts.
 */
export function trimLabels(children) {
    return Children.map(children, (child) => typeof child === "string" || typeof child === "number" ? (_jsx("span", { "data-slot": "label", className: CAP_TRIM, children: child })) : (child));
}
