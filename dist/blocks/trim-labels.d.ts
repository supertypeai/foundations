import { type ReactNode } from "react";
/**
 * Wrap a control's text so the row centres on the letters, not the line box.
 * Adjacent strings are one label: `{count} to act on` stays one run of words
 * rather than two flex items with a gap between them. The trim is the
 * browser's own arithmetic on its own metrics. Not for a label that also clips:
 * see ../typography/align.ts.
 */
export declare function trimLabels(children: ReactNode): ReactNode;
