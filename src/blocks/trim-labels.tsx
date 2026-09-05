import { Children, type ReactNode } from "react";

import { CAP_TRIM } from "../typography/align.js";

/**
 * Wrap a control's string labels so the row centres on the letters, not the line
 * box. The trim is the browser's own arithmetic on its own metrics, where a model
 * of it needs a metrics table that can disagree. Not for a label that also clips:
 * see ../typography/align.ts.
 */
export function trimLabels(children: ReactNode): ReactNode {
  return Children.map(children, (child) =>
    typeof child === "string" || typeof child === "number" ? (
      <span data-slot="label" className={CAP_TRIM}>
        {child}
      </span>
    ) : (
      child
    ),
  );
}
