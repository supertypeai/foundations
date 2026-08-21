import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * The interactive accordion: Base UI, animated, client-side.
 *
 * `Disclosure`/`DisclosureGroup` next door is the `<details>` version an MDX
 * author gets with no JS. Neither is a variant of the other, which is why they
 * no longer share a name.
 */
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { cn } from "../cn.js";
function Accordion({ className, ...props }) {
    return (_jsx(AccordionPrimitive.Root, { "data-slot": "accordion", className: cn("flex w-full flex-col", className), ...props }));
}
function AccordionItem({ className, ...props }) {
    return (_jsx(AccordionPrimitive.Item, { "data-slot": "accordion-item", className: cn("not-last:border-b", className), ...props }));
}
function AccordionTrigger({ className, children, ...props }) {
    return (_jsx(AccordionPrimitive.Header, { className: "flex", children: _jsxs(AccordionPrimitive.Trigger, { "data-slot": "accordion-trigger", className: cn("group/accordion-trigger relative flex flex-1 items-start justify-between rounded-lg border border-transparent py-2.5 text-left text-sm font-medium transition outline-none hover:underline focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:after:border-ring aria-disabled:pointer-events-none aria-disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground", className), ...props, children: [children, _jsx(Chevron, { className: "group-aria-expanded/accordion-trigger:hidden" }), _jsx(Chevron, { up: true, className: "hidden group-aria-expanded/accordion-trigger:inline" })] }) }));
}
function AccordionContent({ className, children, ...props }) {
    return (_jsx(AccordionPrimitive.Panel, { "data-slot": "accordion-content", className: "overflow-hidden text-sm data-open:animate-accordion-down data-closed:animate-accordion-up", ...props, children: _jsx("div", { className: cn("h-(--accordion-panel-height) pt-0 pb-2.5 data-ending-style:h-0 data-starting-style:h-0 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4", className), children: children }) }));
}
/** Inline, not an icon import — one glyph is not a dependency. */
function Chevron({ up, className }) {
    return (_jsx("svg", { "data-slot": "accordion-trigger-icon", "aria-hidden": "true", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: cn("pointer-events-none shrink-0", className), children: _jsx("path", { d: up ? "m18 15-6-6-6 6" : "m6 9 6 6 6-6" }) }));
}
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
