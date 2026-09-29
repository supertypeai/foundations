import { Children, type ReactNode } from "react";

import { CAP_TRIM } from "../typography/align.js";

const isText = (child: ReactNode) => typeof child === "string" || typeof child === "number";

/**
 * Wrap a control's text so the row centres on the letters, not the line box.
 * Adjacent strings are one label: `{count} to act on` stays one run of words
 * rather than two flex items with a gap between them. The trim is the
 * browser's own arithmetic on its own metrics. Not for a label that also clips:
 * see ../typography/align.ts.
 */
export function trimLabels(children: ReactNode): ReactNode {
  const out: ReactNode[] = [];
  let run: (string | number)[] = [];
  const flush = () => {
    if (!run.length) return;
    out.push(
      <span key={`label-${out.length}`} data-slot="label" className={CAP_TRIM}>
        {run.join("")}
      </span>,
    );
    run = [];
  };
  // toArray keys every element, as map did; the labels take their own.
  for (const child of Children.toArray(children)) {
    if (isText(child)) run.push(child as string | number);
    else {
      flush();
      out.push(child);
    }
  }
  flush();
  return out;
}
