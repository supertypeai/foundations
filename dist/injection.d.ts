import type { ComponentType } from "react";
/**
 * A component the app injects — its Link, its Image. Untyped in its props on
 * purpose: no hand-written signature accepts `next/link`, `next/image` and
 * react-router at once, and tightening it only moves the cast to every consumer.
 * What must hold is checked where these are rendered, against a fixed prop set.
 */
export type InjectedComponent = ComponentType<any>;
