import type { ComponentType } from "react";

/**
 * A component the consuming app injects — its router Link, its image component.
 *
 * Deliberately untyped in its props, and only once, here, so the reason is
 * written down in a single place rather than restated at each injection point.
 *
 * Every framework types these differently and none of them structurally match a
 * hand-written signature: `next/link` takes `href: Url` (a string OR a
 * UrlObject) behind a generic, `next/image` is a ForwardRefExoticComponent whose
 * props omit and then redeclare half of `<img>`, react-router takes `to`.
 * Writing `{ href: string }` here does not accept any of them, and tightening it
 * only moves the cast out to every consumer's call site, where the reason for it
 * is no longer visible.
 *
 * What actually has to hold is checked where these are used: each is rendered
 * with a small, fixed set of props, and nothing else.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InjectedComponent = ComponentType<any>;
