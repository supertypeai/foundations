import { type ComponentProps, type ReactNode } from "react";
/**
 * `<details>`/`<summary>`, not a headless primitive: no JS, correct before
 * hydration, and it keeps both Radix and Base UI out of the package — the
 * consuming projects are split across them.
 */
export declare function Accordions({ className, children, type, defaultValue, name, ...props }: Omit<ComponentProps<"div">, "defaultValue"> & {
    /** `single` closes siblings when one opens. Defaults to `multiple`. */
    type?: "single" | "multiple";
    /** Title(s) open on first render. */
    defaultValue?: string | string[];
    /** Explicit group name; one is derived from `type` when omitted. */
    name?: string;
}): import("react").JSX.Element;
type AccordionProps = Omit<ComponentProps<"details">, "title"> & {
    title: ReactNode;
    name?: string;
};
export declare function Accordion({ title, children, className, ...props }: AccordionProps): import("react").JSX.Element;
export {};
