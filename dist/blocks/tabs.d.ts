import type { ReactNode } from "react";
import { type VariantProps } from "class-variance-authority";
import { type Tone } from "../tone.js";
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
    size?: "sm" | "md" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
/** One tab, whole: what it is called, what marks it, and what it shows, if anything. */
export type TabItem<V extends string = string> = {
    /** Stable across a relabel — it is what `defaultValue` and `onValueChange` speak. */
    value: V;
    label: ReactNode;
    /**
     * An element, sized by its slot and inked by the trigger. An element and not a component:
     * `TabGroup` is a client component, so a component reference handed to it from a
     * server page crosses the RSC boundary as a function, which React refuses.
     */
    icon?: ReactNode;
    /** The panel. A strip whose tabs have none is a picker: the strip alone, driving state. */
    content?: ReactNode;
};
/**
 * Tabs, as data, and the one way to make them. The parts above are its insides,
 * not exported: every hand-composed strip turned out to be this one with a wrapper
 * in `content`, re-adding the icon, the handler and the stable value by hand. With
 * no `content` on any tab it is a picker, the strip alone, driving state through
 * `value` and `onValueChange`: a chart's metric, a date range.
 */
export declare function TabGroup<V extends string = string>({ tabs, defaultValue, value, onValueChange, variant, size, tone, iconPosition, className, }: {
    /** The values' own type flows to `value` and `onValueChange`, so a picker can drive a union. */
    tabs: readonly TabItem<V>[];
    /** Defaults to the first tab, since a picker with nothing picked is not a state. */
    defaultValue?: V;
    /** Pass with `onValueChange` to drive it from outside. */
    value?: V;
    onValueChange?: (value: V) => void;
    variant?: VariantProps<typeof tabsListVariants>["variant"];
    size?: VariantProps<typeof tabsListVariants>["size"];
    tone?: Tone;
    iconPosition?: "inline-start" | "inline-end";
    className?: string;
}): import("react").JSX.Element;
export {};
