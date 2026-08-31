import type { ComponentProps, ReactNode } from "react";

import { cn } from "../cn.js";
import { FOCUS_RING } from "./focus.js";
import { inkOnSurface, toneClass } from "../tone.js";
import { resolveLink, type LinkBehavior } from "../href.js";

/** Two columns from `sm` up: a pair reads as a set rather than two panels. */
export function Cards({ className, children, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("my-6 grid gap-4 sm:grid-cols-2", className)} {...props}>
      {children}
    </div>
  );
}

/**
 * `ring-1` not `border`: a ring draws outside the box, so a card sits flush in a
 * grid and `overflow-hidden` clips a bleed image cleanly. Padding is vertical
 * only — the horizontal inset belongs to the slots, so bands can run edge to edge.
 */
const CARD_CLASS =
  `flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-sm text-card-foreground ring-1 ring-border ${inkOnSurface("--card-foreground")} ` +
  "has-[>img:first-child]:pt-0 " +
  "*:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl";

/**
 * What a card does when it is a link, which is the only time it does anything: two pixels
 * up, a shadow under it, the ring firming from `--border` to a cut of the page's own ink.
 * Following a link is not a colour, so nothing here is one — `--elevation-raised` is the
 * token for a layer leaving the page plane, and that is the whole gesture. The lift is
 * `motion-safe:` and the shadow is not, so reduced motion keeps the affordance.
 *
 * `toneClass` is declared here so the icon below can take `--tone-hue` rather than naming
 * a token, the way every other tinted role in the package reads it.
 */
const CARD_LINK_CLASS = cn(
  toneClass("primary"),
  FOCUS_RING,
  "group/card no-underline transition duration-200 ease-out",
  "hover:shadow-raised hover:ring-foreground/15 motion-safe:hover:-translate-y-0.5",
);

export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("grid auto-rows-min items-start gap-1 px-4 [.border-b]:pb-4", className)}
      {...props}
    />
  );
}

/**
 * No `font-heading`, and no rung off the heading ladder. That role is the
 * editorial display face — `.editorial` hands it to the serif and drops the
 * weight to 400 — and a card is chrome, not prose: dropped into a docs page it
 * wore a serif title over a sans description and lost the weight that separated
 * the two. Rank inside a card is weight and size, the way a callout title does
 * it. The face is whatever the card inherits.
 */
export function CardTitle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("text-base leading-snug font-medium", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-4", className)}
      {...props}
    />
  );
}

type CardShorthand = {
  /** Shorthand header: 52 MDX files use it, and no compiler checks those. */
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
};

/**
 * Takes either shape: `title`/`href` fills the header, or compose the slots
 * directly. Unrecognised props pass through — MDX authors reach for the whole
 * HTML surface. Where the href goes is ../href.ts's call, the same one Button
 * and TypographyLink make.
 */
export function Card({
  href,
  className,
  external,
  newTab,
  title,
  description,
  icon,
  children,
  ...rest
}: CardShorthand &
  LinkBehavior & { href?: string; children?: ReactNode } & Omit<
    ComponentProps<"a">,
    keyof CardShorthand | keyof LinkBehavior | "href" | "children"
  >) {
  const header =
    title || description || icon ? (
      <CardHeader>
        {icon || title ? (
          // The icon sits on the title's line and is its mark; stacked, it read as a
          // decoration the title happened to follow. `gap-2` is a gap between two
          // objects, not the header's `gap-1` between two lines.
          <div className="flex items-center gap-2">
            {icon ? (
              // Sized here, not at the call site, so two cards cannot disagree about how
              // big an icon is. On a link card it takes the tone as the card lifts.
              <span className="shrink-0 text-muted-foreground transition-colors group-hover/card:text-(color:--tone-hue) [&_svg]:size-4 [&_svg]:shrink-0">
                {icon}
              </span>
            ) : null}
            {title ? <CardTitle>{title}</CardTitle> : null}
          </div>
        ) : null}
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
    ) : null;

  // Bare children compose; children under a shorthand header are body copy.
  const body = header ? (
    <>
      {header}
      {children ? <CardContent>{children}</CardContent> : null}
    </>
  ) : (
    children
  );

  const shared = { "data-slot": "card" };

  if (!href) {
    return (
      <div className={cn(CARD_CLASS, className)} {...shared} {...(rest as ComponentProps<"div">)}>
        {body}
      </div>
    );
  }

  const { Component, props: link } = resolveLink(href, { external, newTab });

  return (
    <Component className={cn(CARD_CLASS, CARD_LINK_CLASS, className)} {...link} {...shared} {...rest}>
      {body}
    </Component>
  );
}
