import { cloneElement, isValidElement, type ReactElement } from "react";

import { cn } from "../cn.js";

/**
 * The component's classes and data marks put onto an element the caller supplies,
 * so a badge or a button can BE a link rather than wrap one. Shared because Button
 * and Badge both do it identically. Returns `null` when `render` is not an
 * element, which is the caller's signal to render its own tag.
 */
export function renderAs(
  render: unknown,
  classes: string,
  props: Record<string, unknown>,
): ReactElement | null {
  // `unknown`, because Base UI's `render` is an element OR a render function; only the
  // element half is ours to clone, and `isValidElement` is the narrowing.
  if (!isValidElement(render)) return null;
  const { className } = render.props as { className?: string };
  return cloneElement(render, {
    ...props,
    className: cn(classes, className),
  } as Record<string, unknown>);
}
