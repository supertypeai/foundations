import { jsx as _jsx } from "react/jsx-runtime";
import { Children } from "react";
import { CAP_TRIM } from "../typography/align.js";
const isText = (child) => typeof child === "string" || typeof child === "number";
/**
 * Wrap a control's text so the row centres on the letters, not the line box.
 * Adjacent strings are one label: `{count} to act on` stays one run of words
 * rather than two flex items with a gap between them. The trim is the
 * browser's own arithmetic on its own metrics. Not for a label that also clips:
 * see ../typography/align.ts.
 */
export function trimLabels(children) {
    const out = [];
    let run = [];
    const flush = () => {
        if (!run.length)
            return;
        out.push(_jsx("span", { "data-slot": "label", className: CAP_TRIM, children: run.join("") }, `label-${out.length}`));
        run = [];
    };
    // toArray keys every element, as map did; the labels take their own.
    for (const child of Children.toArray(children)) {
        if (isText(child))
            run.push(child);
        else {
            flush();
            out.push(child);
        }
    }
    flush();
    return out;
}
