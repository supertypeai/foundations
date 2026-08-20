import { type ComponentProps, type ReactNode } from "react";
/**
 * A disclosure group.
 *
 * Built on `<details>`/`<summary>` rather than a headless primitive: it needs no
 * JavaScript, works before hydration, is keyboard- and screen-reader-correct for
 * free, and — the reason that matters here — it keeps the package free of both
 * Radix and Base UI. Those diverge across the consuming projects, and a shared
 * prose package that picked one would force a migration on the others for the
 * sake of a widget the platform already ships.
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
