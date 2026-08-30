import { cloneElement, isValidElement } from "react";
import { cn } from "../cn.js";
/**
 * `render={<a href="…" />}` — the component's classes and data marks put onto an element
 * the caller supplies, so a badge or a button can BE a link rather than wrap one. A
 * screen reader announces the element, and the element is the anchor.
 *
 * Shared because Button and Badge both do it, identically, for the same reason; both
 * files' comments used to say so while carrying their own copy. Returns `null` when
 * `render` is not an element, which is the caller's signal to render its own tag.
 */
export function renderAs(render, classes, props) {
    // `unknown`, because Base UI's `render` is an element OR a render function; only the
    // element half is ours to clone, and `isValidElement` is the narrowing.
    if (!isValidElement(render))
        return null;
    const { className } = render.props;
    return cloneElement(render, {
        ...props,
        className: cn(classes, className),
    });
}
