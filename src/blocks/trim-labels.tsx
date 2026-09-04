import { Children, type ReactNode } from "react";

import { CAP_TRIM } from "../typography/align.js";

/**
 * Wrap a control's string labels so the row centres on the letters, not the line box.
 *
 * `items-center` centres the anonymous flex item a bare string generates, and that box
 * carries leading the string never uses, so a mark beside it lands low. The trim is the
 * browser's own arithmetic on its own metrics, which is the point: a model of the same
 * sum needs a metrics table, and a table that disagrees with the browser reports a rung
 * as flat when it is half a pixel out. Only strings are wrapped, so an icon or an
 * element the caller passes is left alone.
 *
 * The wrapper is stamped `data-slot="label"`, like the axes Button already marks: it is
 * part of the control's anatomy rather than a surprise in the tree, so a selector or a
 * test has something stable to hold.
 *
 * Not for a label that also clips. The trimmed box ends at the baseline, so `truncate`
 * over it shears the descenders; see ../typography/align.ts.
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
