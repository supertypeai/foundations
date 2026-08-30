import type { ComponentProps, ReactElement } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../cn.js";
import { renderAs } from "./render-as.js";
import { FOCUS_RING } from "./focus.js";
import { TONE, TONE_SURFACE, impliedTone } from "../tone.js";

// ---------------------------------------------------------------------------
// A label that is not a control. Same two axes as Button, and for the same
// reason: the two apps had each grown their own list, and the lists disagreed
// with each other and with the rest of the package.
//
// ssite's read `default | secondary | destructive | outline | success | warning
// | supertype | tint`. Two of those are the package's tones under invented
// spellings — `warning` for `warn`, `supertype` for `brand` — which is precisely
// the second vocabulary a design system exists to prevent. `secondary` was
// `bg-muted/80 text-foreground` against a `default` of `bg-muted
// text-muted-foreground`: a distinction no reader could name, let alone use.
//
// viably's read `default | secondary | destructive | outline | ghost | link`,
// which is a copy of the button list it was cargo-culted from — including the
// `link` variant, which no badge has ever used, because a badge is not a link.
//
// So: `variant` for how much ink, `tone` for what it means, both spelled exactly
// as Button spells them. `link` is absent because it was never real; everything
// else about the vocabulary is the same list, so knowing one component's axes is
// knowing this one's.
// ---------------------------------------------------------------------------

const badge = cva(
  cn(
    "inline-flex w-fit shrink-0 items-center justify-center gap-1",
    "overflow-hidden border border-transparent font-medium whitespace-nowrap",
    cn("transition focus-visible:border-ring", FOCUS_RING),
    "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
    "[&>svg]:pointer-events-none [&>svg]:size-3!",
    TONE_SURFACE,
  ),
  {
    // Same cascade order as Button: `pill` beats `size` on radius.
    variants: {
      tone: TONE,
      /**
       * Two rungs, because a badge has two jobs. `sm` is the label riding beside
       * a title; `xs` is the figure riding beside a toolbar control — a filter
       * tally, an unread count.
       *
       * `leading-none` restates the default on purpose: `text-3xs` carries a
       * line-height of its own, which lands after the base class and wins.
       * Stating it per size is what keeps `!leading-none` out of call sites.
       */
      size: {
        xs: "h-4 min-w-4 rounded px-1 text-3xs leading-none",
        sm: "h-5 rounded-md px-2 py-0.5 text-xs leading-none",
      },
      pill: { true: "rounded-full", false: "" },
      variant: {
        solid: "bg-(--tone-fill) text-(color:--tone-ink) [a]:hover:bg-(--tone-fill-hover)",
        soft: "bg-(--tone-wash) text-(color:--tone-hue) [a]:hover:bg-(--tone-wash-hover)",
        outline:
          "border-(color:--tone-line) text-(color:--tone-hue) [a]:hover:bg-(--tone-wash)",
        ghost: "text-(color:--tone-hue) hover:bg-(--tone-wash)",
      },
    },
    defaultVariants: { variant: "solid", size: "sm", pill: false },
  },
);

export type BadgeLook = VariantProps<typeof badge>;

export function badgeVariants(props: Parameters<typeof badge>[0] = {}) {
  return badge({ tone: props?.tone ?? impliedTone(props?.variant), ...props });
}

/**
 * A `span` unless `render` says otherwise — cloned rather than run through a
 * `useRender` hook, which is what viably's badge did. A hook would make every
 * badge in the tree a client component to serve the one call site that renders
 * an anchor, and a badge is a label: it should cost nothing on the server. This
 * is the same mechanism `Button` uses for the same reason.
 *
 * The `[a]:hover` rules above light up on their own when an anchor is the parent
 * or the rendered element.
 */
export function Badge({
  className,
  variant,
  tone,
  size,
  pill,
  render,
  ...props
}: ComponentProps<"span"> & BadgeLook & { render?: ReactElement }) {
  const resolved = tone ?? impliedTone(variant);
  const classes = cn(badge({ variant, tone: resolved, size, pill, className }));
  const marks = {
    "data-slot": "badge",
    "data-variant": variant ?? "solid",
    "data-tone": resolved,
  };

  const as = renderAs(render, classes, { ...marks, ...props });
  if (as) return as;

  return <span {...marks} className={classes} {...props} />;
}
