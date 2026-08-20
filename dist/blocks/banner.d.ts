import type { ComponentProps } from "react";
declare const TONES: {
    readonly info: "border-border bg-muted text-foreground";
    readonly warn: "border-border bg-accent text-accent-foreground";
    readonly danger: "border-destructive/40 bg-destructive/10 text-foreground";
};
/** A callout inside prose: a note, a caveat, a deprecation. */
export declare function Banner({ className, tone, children, ...props }: ComponentProps<"div"> & {
    tone?: keyof typeof TONES;
}): import("react").JSX.Element;
export {};
