import { type ReactNode } from "react";
/**
 * Wrap a control's string labels so the row centres on the letters, not the line
 * box. The trim is the browser's own arithmetic on its own metrics, where a model
 * of it needs a metrics table that can disagree. Not for a label that also clips:
 * see ../typography/align.ts.
 */
export declare function trimLabels(children: ReactNode): ReactNode;
