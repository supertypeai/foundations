import type { ComponentType, ReactNode } from "react";
import { type Tone } from "../tone.js";
export declare function Callout({ icon: Icon, title, tone, density, bodyClassName, action, children, className, }: {
    /** Injected, so the package needs no icon set. Optional: a notice whose title already reads as a label
     *  ("Replied into Norman's thread") gains nothing from a glyph beside it. */
    icon?: ComponentType<{
        className?: string;
    }>;
    title?: ReactNode;
    tone?: Tone;
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
