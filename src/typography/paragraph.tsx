import { resolveLink, type LinkBehavior } from "../href.js";

import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../cn.js";
import { toneClass, type Tone } from "../tone.js";
import { TextAs, type WithAs } from "./as.js";

/** The body layer: two axes and no more. A paragraph picks a rung and an ink; a
 * caption is always secondary ink and picks a size. `lead` was a third rung a
 * breakpoint away from `prose`, and its standfirst role is now the eyebrow's. */

const pVariants = cva("", {
  variants: {
    /**
     * `ui` is interface copy. `prose` is the reading rung, stated here and
     * nowhere else — it had drifted to five copies once already. `--text-lg`
     * resolves larger on an editorial subtree, by design.
     */
    variant: {
      ui: "text-sm",
      prose: "text-pretty text-lg leading-relaxed",
    },
    tone: {
      default: "text-[color:var(--ink,var(--foreground))]",
      muted: "text-[color:var(--ink-muted,var(--muted-foreground))]",
    },
  },
  defaultVariants: { variant: "ui", tone: "default" },
});

export type ParagraphVariants = VariantProps<typeof pVariants>;

/**
 * `as` is here for the reason the caption has it, one step further on: a
 * component that hands its body to a caller cannot know whether what arrives is
 * a sentence or a list, and a paragraph may hold neither a list nor a div. The
 * HTML parser closes the `<p>` early and React reports a hydration error, so
 * every wrapper of that shape (`Callout` was the one) renders `as="div"`.
 */
export function TypographyP({
  className,
  variant,
  tone,
  as = "p",
  children,
  ...props
}: WithAs<ParagraphVariants>) {
  return (
    <TextAs
      as={as}
      className={cn(pVariants({ variant, tone }), className)}
      {...props}
    >
      {children}
    </TextAs>
  );
}

/** A preset's props: its base's, minus the axes it has decided. `keyof Pins` reads
 * the exclusion off the pinned object the preset also spreads, so the two cannot
 * drift — `<TypographyMuted tone="default">` used to compile and un-mute it. */
type Preset<Base, Pins> = Omit<Base, keyof Pins>;

type ParagraphProps = WithAs<ParagraphVariants>;

/** The UI rung in the secondary ink. */
const MUTED = { tone: "muted" } as const satisfies ParagraphVariants;
export function TypographyMuted(props: Preset<ParagraphProps, typeof MUTED>) {
  return <TypographyP {...props} {...MUTED} />;
}

/** Reading-size body copy. `TypographyMuted` is the same ink one rung down. */
const PROSE = {
  variant: "prose",
  tone: "muted",
} as const satisfies ParagraphVariants;
export function TypographyProse(props: Preset<ParagraphProps, typeof PROSE>) {
  return <TypographyP {...props} {...PROSE} />;
}

/**
 * A list, on the same rung axis as the paragraph beside it, composed from
 * `pVariants` so it cannot drift from the copy above it. `variant` is here for
 * the cases where a tier card sets its paragraphs in `ui`, while a list pinned to
 * `prose` lands two rungs above the sentence introducing it. Tone stays pinned
 * to `muted`.
 */
const listClass = (variant: ParagraphVariants["variant"], ordered?: boolean) =>
  cn(
    "my-4 flex flex-col gap-1 pl-6 [&>li]:pl-1.5",
    ordered ? "list-decimal" : "list-disc",
    pVariants({ variant, tone: "muted" }),
  );

export type ListProps = ComponentProps<"ul"> &
  Pick<ParagraphVariants, "variant"> & { ordered?: boolean };

export function TypographyList({
  className,
  children,
  ordered,
  variant,
  ...props
}: ListProps) {
  const List = ordered ? "ol" : "ul";
  return (
    <List
      className={cn(listClass(variant, ordered), className)}
      {...(props as ComponentProps<"ol">)}
    >
      {children}
    </List>
  );
}

/**
 * The reading rung, pinned. The name predates the axis and keeps every call site
 * that already had it; `Preset` stops one re-opening the rung it names.
 */
const PROSE_LIST = { variant: "prose" } as const satisfies Pick<
  ParagraphVariants,
  "variant"
>;
export function TypographyProseList(
  props: Preset<ListProps, typeof PROSE_LIST>,
) {
  return <TypographyList {...props} {...PROSE_LIST} />;
}

/**
 * Meta beside content: timestamps, counts, bylines, the key in a key-value row.
 * Always secondary ink and never a weight, since colour and weight both saying
 * "secondary" is one arguing with the other. `inherit` is the parenthetical
 * inside a heading or a stat, taking the size that set it.
 */
const captionVariants = cva(
  "text-[color:var(--ink-muted,var(--muted-foreground))]",
  {
    variants: {
      size: {
        sm: "text-sm",
        xs: "text-xs",
        "2xs": "text-2xs",
        inherit: "font-normal",
      },
    },
    defaultVariants: { size: "sm" },
  },
);

export type CaptionVariants = VariantProps<typeof captionVariants>;

/**
 * `as` covers the one thing that genuinely differs between call sites: whether
 * the run is inline beside its subject or a block under it.
 */
export function TypographyCaption({
  className,
  size,
  as,
  children,
  ...props
}: WithAs<CaptionVariants>) {
  return (
    <TextAs
      as={as}
      className={cn(captionVariants({ size }), className)}
      {...props}
    >
      {children}
    </TextAs>
  );
}

/**
 * Small print set as a block: a note under the thing it annotates, rather than
 * an aside inline with it. Same rung and same ink as the caption — small print
 * is small because it is muted, and dropping it a rung as well is what made
 * both apps hand-roll their own.
 */
const BLOCK = { as: "p" } as const satisfies Pick<WithAs, "as">;
export function TypographySmall(
  props: Preset<WithAs<CaptionVariants>, typeof BLOCK>,
) {
  return <TypographyCaption {...props} {...BLOCK} />;
}

/**
 * The label role: a form label, a column header, the key a reader scans for. The
 * rungs are the caption's, deliberately, since a label and a caption are one pair
 * and a pair that cannot be set at one size is not a pair.
 */
const labelVariants = cva(
  "font-medium text-[color:var(--ink,var(--foreground))]",
  {
    variants: {
      size: {
        sm: "text-sm",
        xs: "text-xs",
        "2xs": "text-2xs",
        /** Inside a heading or a chip, where the container has already set one. */
        inherit: "",
      },
    },
    defaultVariants: { size: "sm" },
  },
);

export type LabelVariants = VariantProps<typeof labelVariants>;

export function TypographyLabel({
  className,
  size,
  as,
  children,
  ...props
}: WithAs<LabelVariants>) {
  return (
    <TextAs
      as={as}
      className={cn(labelVariants({ size }), className)}
      {...props}
    >
      {children}
    </TextAs>
  );
}

/**
 * A numeric readout. Tabular is right in a column and wrong in a headline, so it
 * is an axis. Leading is pinned tight: a value has no line following it, so the
 * body ramp's ratio lands as dead space.
 */
const statVariants = cva("tracking-tight leading-none", {
  variants: {
    /**
     * Two ladders: the body rungs for a value beside interface copy, the surface
     * names for a figure that is itself the headline. The heading half shipped
     * alone and covered three call sites in eighteen. `inherit` writes nothing.
     */
    size: {
      inherit: "",
      "3xs": "text-3xs",
      "2xs": "text-2xs",
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      card: "text-h4",
      panel: "text-h3",
      section: "text-h2",
      page: "text-h1",
      display: "text-6xl font-black",
    },
    /**
     * How loud the value is. `muted` is the qualifier following a figure, "of
     * 2,000" beside "1,284". `default` states no ink on purpose, so a stat takes
     * the ink around it rather than repainting one that inherits a quieter one.
     */
    tone: {
      default: "font-semibold",
      muted:
        "font-normal text-[color:var(--ink-muted,var(--muted-foreground))]",
    },
    figures: {
      /** Even advances stop a value jittering as it refreshes. */
      tabular: "tabular-nums",
      /** A headline figure wants its drawn spacing: a lone 1 is not an 8. */
      proportional: "proportional-nums",
    },
  },
  defaultVariants: { size: "inherit", figures: "tabular", tone: "default" },
});

export type StatVariants = VariantProps<typeof statVariants>;

export function TypographyStat({
  className,
  size,
  figures,
  tone,
  children,
  ...props
}: ComponentProps<"span"> & StatVariants) {
  return (
    <span
      className={cn(statVariants({ size, figures, tone }), className)}
      {...props}
    >
      {children}
    </span>
  );
}

/**
 * A run of code inside a sentence: a command, a field name, a trigger.
 *
 * Everything is in `em`, not a rung: the chip has to sit in whatever size the
 * sentence around it is set at, and the ramp differs per surface. The 0.9 is an
 * optical correction — the mono face carries a taller x-height than the sans.
 */
export function TypographyInlineCode({
  className,
  children,
  ...props
}: ComponentProps<"code">) {
  return (
    <code
      className={cn(
        "rounded-[3px] bg-current/[0.06] px-[0.3em] py-[0.1em] font-mono text-[0.9em] text-[color:var(--ink,var(--secondary-ink))]",
        className,
      )}
      {...props}
    >
      {children}
    </code>
  );
}

/**
 * A statement about the surface, not the link: `muted` inside a paragraph,
 * `primary` when the link is the main thing on the line, `secondary` for a note
 * beneath a hero. The other four come free from ../tone.ts.
 */
const INHERITED_INK = "text-[color:var(--ink,var(--foreground))]";

const LINK_DECORATION =
  "underline decoration-dotted decoration-1 decoration-muted-foreground decoration-skip-ink-none underline-offset-2 hover:decoration-solid hover:decoration-current/70";

/**
 * No tone stated means "read the surface": the ink comes from whatever painted
 * the ground, which on a page is `--foreground` and inside a filled control is
 * that control's label ink. The old default spelled this `muted`, whose hue is
 * `--foreground` — identical on a page, and 2.28:1 on a filled button.
 */
const linkClass = (tone: Tone | undefined, className?: string) =>
  cn(
    tone ? cn(toneClass(tone), "text-(color:--tone-hue)") : INHERITED_INK,
    "font-medium",
    LINK_DECORATION,
    className,
  );

type TypographyLinkProps = Omit<ComponentProps<"a">, "href"> &
  LinkBehavior & {
    href: string;
    children: ReactNode;
    tone?: Tone;
    /**
     * A trailing arrow, for a link that ends a sentence and leads somewhere. The
     * glyph follows the href: `↗` when the link leaves the site, `→` when it does
     * not. The href picks it, so a call site never has to.
     */
    addArrow?: boolean;
  };

/**
 * The inline link. Internal and external are decided from the href in ../href.ts,
 * never at the call site; `newTab` and `external` are the overrides, and call-site
 * props apply last. The router is `next-view-transitions`, imported by name.
 */
export function TypographyLink({
  href,
  children,
  tone = "muted",
  external: leavesApp,
  newTab,
  addArrow,
  className,
  ...props
}: TypographyLinkProps) {
  const style = linkClass(tone, className);
  const {
    Component,
    props: link,
    external,
  } = resolveLink(href, {
    external: leavesApp,
    newTab,
  });
  const body = (
    <>
      {children}
      {addArrow && (
        <svg
          aria-hidden="true"
          className="ml-1 inline size-3.5 align-middle"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d={external ? "M7 17 17 7M7 7h10v10" : "M5 12h14M12 5l7 7-7 7"}
          />
        </svg>
      )}
    </>
  );

  return (
    <Component className={style} {...link} {...props}>
      {body}
    </Component>
  );
}
