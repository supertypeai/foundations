import { type ComponentProps, type ReactNode } from "react";
import { type Tone } from "../tone.js";
/**
 * A disclosure group: `<details>`/`<summary>`, no JS, correct before hydration.
 * Named for what it is rather than `Accordion`, the interactive Base UI component
 * next door. Sharing a name is how a call site ends up with the wrong one.
 */
export declare function DisclosureGroup({ className, children, type, defaultValue, name, tone, ...props }: Omit<ComponentProps<"div">, "defaultValue"> & {
    /** `single` closes siblings when one opens. Defaults to `multiple`. */
    type?: "single" | "multiple";
    /** Title(s) open on first render. */
    defaultValue?: string | string[];
    /** Explicit group name; one is derived from `type` when omitted. */
    name?: string;
    /**
     * Inks the open mark, and only it — the same contract `TabsList` states. The
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
