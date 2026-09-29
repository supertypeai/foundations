import { type ComponentProps, type ReactNode } from "react";
import { type Tone } from "../tone.js";
/**
 * The disclosure: `<details>`/`<summary>`, no JS, correct before hydration, and
 * available to an MDX author. The one way to show and hide a row; an animated
 * client-side accordion beside it was the same control twice.
 *
 * The look is the tab strip's `line` variant: no box, no fill, a hairline between
 * rows, and one 2px mark in `--tone-hue` naming what is open. Ink carries the state,
 * muted at rest and `--foreground` open, exactly as a tab label does, since an open
 * row is being read rather than signalled. The mark is per row and scales in, where
 * the tab strip's slides: any number of rows can be open, and one element cannot be
 * in two of them.
 *
 * Everything moves on one 200ms ease-out, the tab marker's, because the mark, the
 * ink and the panel are one gesture.
 */
export declare function DisclosureGroup({ className, children, type, defaultValue, name, tone, ...props }: Omit<ComponentProps<"div">, "defaultValue"> & {
    /** `single` closes siblings when one opens. Defaults to `multiple`. */
    type?: "single" | "multiple";
    /** Title(s) open on first render. */
    defaultValue?: string | string[];
    /** Explicit group name; one is derived from `type` when omitted. */
    name?: string;
    /**
     * Inks the open mark, and only it, the same contract `TabGroup` states. The
     * label is read rather than signalled, so it stays on the page's ink ladder.
     */
    tone?: Tone;
}): import("react").JSX.Element;
type DisclosureProps = Omit<ComponentProps<"details">, "title"> & {
    title: ReactNode;
    name?: string;
};
export declare function Disclosure({ title, children, className, ...props }: DisclosureProps): import("react").JSX.Element;
export {};
