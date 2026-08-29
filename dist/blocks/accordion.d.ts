import { type ComponentProps, type ReactNode } from "react";
/**
 * A disclosure group: `<details>`/`<summary>`, no JS, correct before hydration.
 *
 * Named for what it is rather than `Accordion`, the interactive Base UI
 * component next door. The two are not variants of each other — this one is a
 * server component an MDX author gets for free, that one animates and manages
 * state. Sharing a name is how a call site ends up with the wrong one.
 */
export declare function DisclosureGroup({ className, children, type, defaultValue, name, ...props }: Omit<ComponentProps<"div">, "defaultValue"> & {
    /** `single` closes siblings when one opens. Defaults to `multiple`. */
    type?: "single" | "multiple";
    /** Title(s) open on first render. */
    defaultValue?: string | string[];
    /** Explicit group name; one is derived from `type` when omitted. */
    name?: string;
}): import("react").JSX.Element;
type DisclosureProps = Omit<ComponentProps<"details">, "title"> & {
    title: ReactNode;
    name?: string;
};
export declare function Disclosure({ title, children, className, ...props }: DisclosureProps): import("react").JSX.Element;
export {};
