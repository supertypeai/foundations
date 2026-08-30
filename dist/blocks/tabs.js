"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cva } from "class-variance-authority";
import { cn } from "../cn.js";
import { toneClass } from "../tone.js";
import { SEGMENT } from "./segment.js";
function Tabs({ className, orientation = "horizontal", ...props }) {
    return (_jsx(TabsPrimitive.Root, { "data-slot": "tabs", "data-orientation": orientation, className: cn(
        // Base UI writes the orientation as `data-orientation="horizontal|vertical"`, so
        // the variant has to read that attribute's value. A bare `data-horizontal:` compiles
        // to `[data-horizontal]`, which nothing ever sets: the root silently stayed a row
        // flex container and laid its panels out beside the tab strip.
        "group/tabs flex gap-2 data-[orientation=horizontal]:flex-col", className), ...props }));
}
/**
 * Surfaces come from SEGMENT, so this and marketing/segmented-control cannot drift: a
 * reader who meets the picker on a docs page and again on the usage dashboard should not
 * have to learn it twice. Layout stays local, since only this one has orientation to serve.
 *
 * Each variant states its own box, rather than sharing a base tuned for the boxed track
 * that `line` then had to undo at the call site.
 */
const tabsListVariants = cva("group/tabs-list inline-flex w-fit items-center text-muted-foreground", {
    variants: {
        variant: {
            /** The boxed track: one fixed-height rail, segments splitting it evenly. */
            default: cn(SEGMENT.track, "h-8 justify-center"),
            /**
             * A strip of labels over a rule. Free to wrap, so no fixed height — and `pb-2` is
             * the marker's own room (6px offset plus its 2px), so the list's box contains
             * everything the list draws and the gaps below measure from the right edge. The
             * row gap clears the same 8px, or a wrapped row wears the rule above it.
             */
            line: "flex-wrap justify-start gap-x-1 gap-y-3 rounded-none border-0 bg-transparent pb-2",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});
/**
 * The marker: one element, positioned by Base UI from `--active-tab-left/top/width/height`
 * on the list, dressed by the variant it is in. It outlives the selection, so it carries
 * the answer from the old tab to the new instead of being destroyed and rebuilt.
 *
 * `data-activation-direction` is `none` before anything is picked, and that is the one case
 * that must not animate — without the guard every strip on the page slides in from its left
 * edge on hydration.
 */
const tabsIndicatorVariants = cva("pointer-events-none absolute left-0 top-0 w-(--active-tab-width) transition-[translate,width] duration-200 ease-out data-[activation-direction=none]:transition-none motion-reduce:transition-none", {
    variants: {
        variant: {
            /** The pill, on the page plane. The rail below it is what carries the depth. */
            default: cn(SEGMENT.activeSurface, "h-(--active-tab-height) translate-x-(--active-tab-left) translate-y-(--active-tab-top)"),
            /**
             * A rule under the label, clear of the descenders, in the list's tone. The 6px
             * offset plus its own 2px is the `pb-2` the line list reserves — the two are one
             * measurement, and changing either alone puts the rule back outside its box.
             */
            line: "h-0.5 translate-x-(--active-tab-left) translate-y-[calc(var(--active-tab-top)+var(--active-tab-height)+6px)] rounded-full bg-(--tone-hue)",
        },
    },
    defaultVariants: { variant: "default" },
});
/**
 * `tone` inks the marker, and only the marker. On `line` that is the underline and the
 * active tab's icon; the boxed track's marker is a card surface and a hairline, which
 * SEGMENT keeps deliberately flat, so a tone there would be a colour with nothing to
 * paint. The label stays `--foreground` in both: it is read, not signalled.
 */
function TabsList({ className, variant = "default", tone = "primary", children, ...props }) {
    return (_jsxs(TabsPrimitive.List, { "data-slot": "tabs-list", "data-variant": variant, className: cn("relative", toneClass(tone), tabsListVariants({ variant }), className), ...props, children: [_jsx(TabsPrimitive.Indicator, { renderBeforeHydration: true, className: tabsIndicatorVariants({ variant }) }), children] }));
}
function TabsTrigger({ className, ...props }) {
    return (_jsx(TabsPrimitive.Tab, { "data-slot": "tabs-trigger", className: cn(SEGMENT.item, 
        // Ink only — the surface and the underline belong to the indicator. The radius is
        // for the hover wash, and matches the marker that wash previews.
        "rounded-sm text-muted-foreground hover:text-foreground data-active:text-foreground", "px-1.5 py-0.5 text-sm whitespace-nowrap disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", 
        // An icon sits inside the label's gap, so the padding on that side comes off.
        // `TabGroup` writes the `data-icon` these two read.
        "has-data-[icon=inline-start]:pl-1 has-data-[icon=inline-end]:pr-1", 
        // Filling the track is the boxed variant's business; a line tab is as wide as its
        // label. The variant is read off the list's `data-variant` rather than taken as a
        // prop, so a caller states it once on `TabsList` and not on every trigger.
        // Selectors are spelled out, never interpolated: Tailwind's scanner cannot see an
        // interpolated class and would compile nothing.
        "group-data-[variant=default]/tabs-list:h-full group-data-[variant=default]/tabs-list:flex-1 group-data-[variant=default]/tabs-list:justify-center", 
        // Hover moves toward the marker's surface, so it previews the selection.
        "group-data-[variant=default]/tabs-list:not-data-active:hover:bg-card/60", 
        // The active icon takes the ink the marker is drawn in.
        "group-data-[variant=line]/tabs-list:data-active:[&_[data-icon]]:text-(color:--tone-hue)", className), ...props }));
}
function TabsContent({ className, ...props }) {
    return (_jsx(TabsPrimitive.Panel, { "data-slot": "tabs-content", className: cn("flex-1 text-sm outline-none", className), ...props }));
}
/** `data-icon` is the hook the trigger's padding and tone selectors read. */
function TabIconSlot({ icon, position, }) {
    return (_jsx("span", { "data-icon": position, className: "flex items-center transition-colors [&_svg]:size-4 [&_svg]:shrink-0", children: icon }));
}
/**
 * The declarative shorthand: the tabs as data. `TabGroup` is to `Tabs` what
 * `DisclosureGroup` is to `Accordion`, and it is the shape to reach for — an app that
 * rebuilds it over the primitives ends up re-adding the icon, the change handler and the
 * stable value by hand.
 *
 * Everything below the adapter is the same component the product surfaces use, so a tab
 * strip in the docs and one on a dashboard behave identically. The positional
 * `items`-plus-children shape lives in the MDX map, the only thing that speaks it.
 */
export function TabGroup({ tabs, defaultValue, value, onValueChange, variant, tone, iconPosition = "inline-start", className, }) {
    return (
    // The handler is adapted rather than wrapped when absent: an arrow declared
    // unconditionally is a function crossing the server boundary on every page that
    // renders tabs without one.
    _jsxs(Tabs, { defaultValue: defaultValue ?? tabs[0]?.value, value: value, onValueChange: onValueChange && ((next) => onValueChange(String(next))), className: cn("my-6", className), children: [_jsx(TabsList, { variant: variant, tone: tone, children: tabs.map(({ value: tabValue, label, icon }) => (_jsxs(TabsTrigger, { value: tabValue, children: [icon && iconPosition === "inline-start" && (_jsx(TabIconSlot, { icon: icon, position: "inline-start" })), label, icon && iconPosition === "inline-end" && (_jsx(TabIconSlot, { icon: icon, position: "inline-end" }))] }, tabValue))) }), tabs.map(({ value: tabValue, content }) => (_jsx(TabsContent, { value: tabValue, className: "pt-2 text-muted-foreground", children: content }, tabValue)))] }));
}
export { Tabs, TabsList, TabsTrigger, TabsContent };
