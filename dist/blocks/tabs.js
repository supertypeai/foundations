"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cva } from "class-variance-authority";
import { cn } from "../cn.js";
import { SEGMENT } from "./segment.js";
function Tabs({ className, orientation = "horizontal", ...props }) {
    return (_jsx(TabsPrimitive.Root, { "data-slot": "tabs", "data-orientation": orientation, className: cn(
        // Base UI writes the orientation as `data-orientation="horizontal|vertical"`, so
        // the variant has to read that attribute's value. A bare `data-horizontal:` compiles
        // to `[data-horizontal]`, which nothing ever sets: the root silently stayed a row
        // flex container and laid its panels out beside the tab strip.
        "group/tabs flex gap-2 data-[orientation=horizontal]:flex-col", className), ...props }));
}
// Surfaces come from SEGMENT, so this and marketing/segmented-control cannot drift: a
// reader who meets the picker on a docs page and again on the usage dashboard should not
// have to learn it twice. Layout stays local, since only this one has orientation to serve.
const tabsListVariants = cva("group/tabs-list inline-flex w-fit items-center justify-center text-muted-foreground group-data-[orientation=horizontal]/tabs:h-8 group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col data-[variant=line]:rounded-none", {
    variants: {
        variant: {
            default: SEGMENT.track,
            line: "gap-1 border-0 bg-transparent",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});
function TabsList({ className, variant = "default", ...props }) {
    return (_jsx(TabsPrimitive.List, { "data-slot": "tabs-list", "data-variant": variant, className: cn(tabsListVariants({ variant }), className), ...props }));
}
function TabsTrigger({ className, ...props }) {
    return (_jsx(TabsPrimitive.Tab, { "data-slot": "tabs-trigger", className: cn(SEGMENT.item, SEGMENT.dataActiveSurface, "rounded-md text-muted-foreground hover:text-foreground", 
        // A trigger fills its share of the track and may carry an icon, neither of which a
        // standalone picker button has to do.
        "h-[calc(100%-1px)] flex-1 justify-center px-1.5 py-0.5 text-sm whitespace-nowrap group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", 
        // SEGMENT.dataIdleHover, scoped to the boxed variant. Spelled out rather than
        // interpolated: an interpolated class is invisible to Tailwind's scanner and would
        // compile to nothing at all.
        "group-data-[variant=default]/tabs-list:not-data-active:hover:bg-muted/60", 
        // The line variant wears no surface at all; the underline below is its whole signal.
        "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent group-data-[variant=line]/tabs-list:data-active:ring-0", 
        // That underline carries the accent rather than plain ink, so it reads as the
        // brand's marker and not as a bold rule.
        "after:absolute after:bg-primary after:opacity-0 after:transition-opacity group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-[-5px] group-data-[orientation=horizontal]/tabs:after:h-0.5 group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1 group-data-[orientation=vertical]/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-active:after:opacity-100", className), ...props }));
}
function TabsContent({ className, ...props }) {
    return (_jsx(TabsPrimitive.Panel, { "data-slot": "tabs-content", className: cn("flex-1 text-sm outline-none", className), ...props }));
}
/**
* The declarative shorthand: `items` plus a `<Tab>` per panel. `TabGroup` is to
 * `Tabs` what `DisclosureGroup` is to `Accordion` — the shape you reach for when
 * the tabs are data, and what an MDX author writes as `<Tabs>`.
 *
 * A caller passing data has no value to bind, so children pair with `items`
 * **by position** — `value` on a `<Tab>` is for readability and is not matched,
 * since matching would silently drop a panel on an edited label. Everything
 * below the adapter is the same component the product surfaces use, so a tab
 * strip in the docs and one on a dashboard behave identically.
 */
export function TabGroup({ items, children, className, }) {
    const panels = Array.isArray(children) ? children : [children];
    return (_jsxs(Tabs, { defaultValue: 0, className: cn("my-6", className), children: [_jsx(TabsList, { children: items.map((label, i) => (_jsx(TabsTrigger, { value: i, children: label }, label))) }), panels.map((panel, i) => (_jsx(TabsContent, { value: i, className: "pt-2 text-muted-foreground", children: panel }, i)))] }));
}
/** `value` names the panel at the call site; it is not used for matching. */
export function Tab({ children }) {
    return _jsx(_Fragment, { children: children });
}
export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
