import type { EssayIndexEntry } from "./essay.js";
/**
 * The margin index, with the section you are in marked. Separate from
 * `EssayLayout` so only this nav crosses the client boundary.
 */
export declare function TableOfContents({ sections, label, }: {
    sections: readonly EssayIndexEntry[];
    /** The rail's own heading. Set it to `null` to render the links alone. */
    label?: React.ReactNode;
}): import("react").JSX.Element | null;
