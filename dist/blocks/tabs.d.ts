import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import type { ReactNode } from "react";
import { type VariantProps } from "class-variance-authority";
import { type Tone } from "../tone.js";
declare function Tabs({ className, orientation, ...props }: TabsPrimitive.Root.Props): import("react").JSX.Element;
/**
 * Surfaces come from SEGMENT, so this and marketing/segmented-control cannot drift: a
 * reader who meets the picker on a docs page and again on the usage dashboard should not
 * have to learn it twice. Layout stays local, since only this one has orientation to serve.
 *
 * Each variant states its own box, rather than sharing a base tuned for the boxed track
 * that `line` then had to undo at the call site.
 */
declare const tabsListVariants: (props?: ({
    variant?: "line" | "default" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
/**
 * `tone` inks the marker, and only the marker. On `line` that is the underline and the
 * active tab's icon; the boxed track's marker is a card surface and a hairline, which
 * SEGMENT keeps deliberately flat, so a tone there would be a colour with nothing to
 * paint. The label stays `--foreground` in both: it is read, not signalled.
 */
declare function TabsList({ className, variant, tone, children, ...props }: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants> & {
    tone?: Tone;
}): import("react").JSX.Element;
declare function TabsTrigger({ className, children, ...props }: TabsPrimitive.Tab.Props): import("react").JSX.Element;
declare function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props): import("react").JSX.Element;
/** One tab, whole: what it is called, what marks it, and what it shows. */
export type TabItem = {
    /** Stable across a relabel — it is what `defaultValue` and `onValueChange` speak. */
    value: string;
    label: ReactNode;
    /**
     * An element — `<Icons.Mic />`, `<PriceChip />` — sized and inked by the trigger.
     *
     * An element and not a component, which this briefly also took. `TabGroup` is a client
     * component, so a component reference handed to it from a server page is a function
     * crossing the RSC boundary, which React refuses at render; an element is already
     * rendered and crosses fine. One accepted shape also spares the slot a branch, and
     * matches what `Card`'s `icon` has always taken.
     */
    icon?: ReactNode;
    content: ReactNode;
};
/**
 * The declarative shorthand: the tabs as data. `TabGroup` is to `Tabs` what
 * `DisclosureGroup` is to `Accordion`: the shape to reach for. An app that rebuilds it
 * over the primitives ends up re-adding the icon, the change handler and the stable value
 * by hand.
 *
 * Everything below the adapter is the same component the product surfaces use, so a tab
 * strip in the docs and one on a dashboard behave identically. The positional
 * `items`-plus-children shape lives in the MDX map, the only thing that speaks it.
 */
export declare function TabGroup({ tabs, defaultValue, value, onValueChange, variant, tone, iconPosition, className, }: {
    tabs: readonly TabItem[];
    /** Defaults to the first tab, since a picker with nothing picked is not a state. */
    defaultValue?: string;
    /** Pass with `onValueChange` to drive it from outside. */
    value?: string;
    onValueChange?: (value: string) => void;
    variant?: VariantProps<typeof tabsListVariants>["variant"];
    tone?: Tone;
    iconPosition?: "inline-start" | "inline-end";
    className?: string;
}): import("react").JSX.Element;
export { Tabs, TabsList, TabsTrigger, TabsContent };
