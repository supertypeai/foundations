"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../cn.js";
import { Rail, RailLink } from "./rail.js";
import { useReadingProgress, useScrollSpy } from "./scroll.js";
/**
 * Hairline progress bar, rendered even where the rail is hidden. A CSS
 * transition, not a spring: the value only feeds a transform, and this keeps the
 * essay layer from dragging in an animation runtime.
 */
export function ReadingProgressBar({ className }) {
    const progress = useReadingProgress();
    return (_jsx("div", { "aria-hidden": true, className: cn("fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-primary", "transition-transform duration-150 ease-out", className), style: { transform: `scaleX(${progress})` } }));
}
/** Circular percentage indicator at the head of the rail. */
function ProgressDonut({ progress }) {
    const radius = 16;
    const circumference = 2 * Math.PI * radius;
    return (_jsxs("div", { className: "relative grid size-10 place-items-center", children: [_jsxs("svg", { viewBox: "0 0 40 40", className: "size-10 -rotate-90", "aria-hidden": true, children: [_jsx("circle", { cx: "20", cy: "20", r: radius, fill: "none", strokeWidth: "3", className: "stroke-border" }), _jsx("circle", { cx: "20", cy: "20", r: radius, fill: "none", strokeWidth: "3", strokeLinecap: "round", className: "stroke-primary transition-[stroke-dashoffset] duration-150 ease-out", strokeDasharray: circumference, strokeDashoffset: circumference * (1 - progress) })] }), _jsx("span", { className: "absolute font-mono text-3xs font-medium tabular-nums text-muted-foreground", children: Math.round(progress * 100) })] }));
}
/**
 * Sticky rail with live scroll-spy. Both it and `ReadingProgressBar` read shared
 * stores, so mounting them together costs one scroll subscription, not two.
 */
export function ReadingRail({ headings, className, }) {
    const progress = useReadingProgress();
    const active = useScrollSpy(headings.map((h) => h.id));
    if (headings.length === 0)
        return null;
    return (_jsxs("nav", { "aria-label": "On this page", className: cn("flex flex-col gap-4", className), children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(ProgressDonut, { progress: progress }), _jsx("p", { className: "text-xs font-medium uppercase tracking-widest text-muted-foreground", children: "On this page" })] }), _jsx(Rail, { children: headings.map(({ id, label, depth }) => (_jsx(RailLink, { href: `#${id}`, active: active === id, nested: depth === 3, children: label }, id))) })] }));
}
