import type { ComponentProps } from "react";

/** One union, not a bespoke one per component: the narrow ones only decided, for
 * the reader, that a caption could not be a heading. Classes never change with
 * the tag, so the tag is a prop rather than three more components. */
export type TypographyTag =
  | "span"
  | "p"
  | "div"
  | "small"
  | "label"
  | "h1"
  | "h2"
  | "h3"
  | "h4";

/** A primitive's own props, plus the element choice. */
export type WithAs<Own = unknown> = ComponentProps<"span"> &
  Own & { as?: TypographyTag };

/** The cast lives here once instead of in each primitive; a per-tag generic would
 * only narrow `ref`, at the price of a generic in four public signatures. `as`
 * is not forwarded — on the DOM node it is an unknown attribute. */
export function TextAs({
  as = "span",
  ...props
}: ComponentProps<"span"> & { as?: TypographyTag }) {
  const As = as as "span";
  return <As {...props} />;
}
