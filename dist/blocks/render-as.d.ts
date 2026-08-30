import { type ReactElement } from "react";
/**
 * `render={<a href="…" />}` — the component's classes and data marks put onto an element
 * the caller supplies, so a badge or a button can BE a link rather than wrap one. A
 * screen reader announces the element, and the element is the anchor.
 *
 * Shared because Button and Badge both do it, identically, for the same reason; both
 * files' comments used to say so while carrying their own copy. Returns `null` when
 * `render` is not an element, which is the caller's signal to render its own tag.
 */
export declare function renderAs(render: unknown, classes: string, props: Record<string, unknown>): ReactElement | null;
