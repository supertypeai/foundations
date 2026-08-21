import type { ComponentType, ReactNode } from "react";
declare const TONE: {
    /** The default: an explanation, not a problem. */
    readonly muted: {
        readonly box: "border-border bg-muted/40";
        readonly title: "text-foreground";
        readonly icon: "text-muted-foreground";
        readonly rail: "bg-border";
    };
    /** Something failed and the reader needs to see that it did. */
    readonly destructive: {
        readonly box: "border-destructive/40 bg-destructive/5";
        readonly title: "text-destructive";
        readonly icon: "text-destructive";
        readonly rail: "bg-destructive/60";
    };
    /** A prerequisite or a footgun: the reader can still proceed, but not blindly. */
    readonly warn: {
        readonly box: "border-warn/25 bg-warn/5";
        readonly title: "text-warn-foreground";
        readonly icon: "text-warn";
        readonly rail: "bg-warn/60";
    };
    /** A detail that rewards the reader rather than warning them. */
    readonly accent: {
        readonly box: "border-primary/25 bg-primary/5";
        readonly title: "text-foreground";
        readonly icon: "text-primary";
        readonly rail: "bg-primary/60";
    };
};
/**
 * Two densities, because this notice serves two ramps. `compact` is the product
 * default (12px title over 12px body, no rail) that the relay sheet and the contact
 * record already render. `editorial` is the docs form: body copy at reading size,
 * and a 3px accent rail carrying the tone so the surface itself can stay quiet.
 * Splitting on a prop rather than forking the component is the point of the file.
 */
export declare function Callout({ icon: Icon, title, tone, density, bodyClassName, action, children, className, }: {
    /** Injected, so the package needs no icon set. Optional: a notice whose title already reads as a label
     *  ("Replied into Norman's thread") gains nothing from a glyph beside it. */
    icon?: ComponentType<{
        className?: string;
    }>;
    title?: ReactNode;
    tone?: keyof typeof TONE;
    density?: "compact" | "editorial";
    /** For the one body that is not prose — a raw delivery error, which needs mono and its own
     *  line breaks preserved. */
    bodyClassName?: string;
    /** A link or buttons under the body. The only interactive slot: a notice that explains
     *  something usually also knows the one place to go and do something about it. */
    action?: ReactNode;
    children: ReactNode;
    className?: string;
}): import("react").JSX.Element;
export {};
