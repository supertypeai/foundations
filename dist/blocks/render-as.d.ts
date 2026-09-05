import { type ReactElement } from "react";
/**
 * The component's classes and data marks put onto an element the caller supplies,
 * so a badge or a button can BE a link rather than wrap one. Shared because Button
 * and Badge both do it identically. Returns `null` when `render` is not an
 * element, which is the caller's signal to render its own tag.
 */
export declare function renderAs(render: unknown, classes: string, props: Record<string, unknown>): ReactElement | null;
