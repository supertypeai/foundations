import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import type { ReactNode } from "react";
import { type VariantProps } from "class-variance-authority";
declare function Tabs({ className, orientation, ...props }: TabsPrimitive.Root.Props): import("react").JSX.Element;
declare const tabsListVariants: (props?: ({
    variant?: "line" | "default" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare function TabsList({ className, variant, ...props }: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>): import("react").JSX.Element;
declare function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props): import("react").JSX.Element;
declare function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props): import("react").JSX.Element;
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
export declare function TabGroup({ items, children, className, }: {
    items: string[];
    children: ReactNode;
    className?: string;
}): import("react").JSX.Element;
/** `value` names the panel at the call site; it is not used for matching. */
export declare function Tab({ children }: {
    value?: string;
    children: ReactNode;
}): import("react").JSX.Element;
export { Tabs, TabsList, TabsTrigger, TabsContent };
