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
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
/** One tab, whole: what it is called, what marks it, and what it shows. */
export type TabItem = {
    /** Stable across a relabel — it is what `defaultValue` and `onValueChange` speak. */
    value: string;
    label: ReactNode;
    /**
     * An element, sized by its slot and inked by the trigger. An element and not a component:
     * `TabGroup` is a client component, so a component reference handed to it from a
     * server page crosses the RSC boundary as a function, which React refuses.
     */
    icon?: ReactNode;
    content: ReactNode;
};
/**
 * Tabs, as data, and the one way to make them. The parts above are its insides,
 * not exported: every hand-composed strip turned out to be this one with a wrapper
 * in `content`, re-adding the icon, the handler and the stable value by hand.
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
export {};
