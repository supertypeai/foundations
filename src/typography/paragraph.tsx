import { Link } from "next-view-transitions";

import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../cn.js";
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
      default: "text-foreground",
      muted: "text-muted-foreground",
    },
  },
  defaultVariants: { variant: "ui", tone: "default" },
});

export type ParagraphVariants = VariantProps<typeof pVariants>;

export function TypographyP({
  className,
  variant,
  tone,
  children,
  ...props
}: ComponentProps<"p"> & ParagraphVariants) {
  return (
    <p className={cn(pVariants({ variant, tone }), className)} {...props}>
      {children}
    </p>
  );
}

/** A preset's props: its base's, minus the axes it has decided. `keyof Pins` reads
 * the exclusion off the pinned object the preset also spreads, so the two cannot
 * drift — `<TypographyMuted tone="default">` used to compile and un-mute it. */
type Preset<Base, Pins> = Omit<Base, keyof Pins>;

type ParagraphProps = ComponentProps<"p"> & ParagraphVariants;

/** The UI rung in the secondary ink. */
const MUTED = { tone: "muted" } as const satisfies ParagraphVariants;
export function TypographyMuted(props: Preset<ParagraphProps, typeof MUTED>) {
  return <TypographyP {...props} {...MUTED} />;
}

/** Reading-size body copy. `TypographyMuted` is the same ink one rung down. */
const PROSE = { variant: "prose", tone: "muted" } as const satisfies ParagraphVariants;
export function TypographyProse(props: Preset<ParagraphProps, typeof PROSE>) {
  return <TypographyP {...props} {...PROSE} />;
}

/**
 * A list, on the same rung axis as the paragraph beside it.
 *
 * The rung composes `pVariants` rather than restating one, so a list cannot
 * drift from the copy it sits under. The old `proseClass` held that property for
 * the prose rung alone.
 *
 * `variant` is here because a list is not always reading copy. A tier card or a
 * bento cell sets its paragraphs in `ui`, and a list pinned to `prose` inside one
 * lands two rungs above the sentence introducing it, with no prop to say so. Call
 * sites answered that by hand-rolling `<ul className="list-disc text-sm">`, which
 * is the shape this replaces.
 *
 * Tone stays pinned to `muted`: a list is body copy, secondary for the same
 * reason the paragraph presets are, and a weight-or-ink argument at the marker
 * is not a thing a call site should be able to start.
 */
const listClass = (
  variant: ParagraphVariants["variant"],
  ordered?: boolean,
) =>
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
export function TypographyProseList(props: Preset<ListProps, typeof PROSE_LIST>) {
  return <TypographyList {...props} {...PROSE_LIST} />;
}

/**
 * Meta beside content: timestamps, counts, bylines, the key in a key-value row.
 *
 * Always the secondary ink and never a weight — a caption is secondary because
 * it is muted, and 500 on top would have the colour and the weight arguing.
 * `sm` is the default because meta is separated from body by ink, not size;
 * the smaller rungs are a deliberate step down, not the norm.
 *
 * Leading is pinned per size rather than left to the rung. Plenty of captions
 * are a wrapped sentence, and the ramp's tight setting sets those cramped —
 * descenders nearly on the caps below. `leading-normal` writes `--tw-leading`,
 * the variable the `text-*` step reads, so 1.5 wins at every rung.
 *
 * `inherit` is the parenthetical inside a heading, an eyebrow or a stat. It
 * takes the size of whatever set it and resets the weight, because the only
 * reason to sit there is to be quieter than the thing you qualify — and every
 * container that sets a size for you sets a weight too.
 */
const captionVariants = cva("text-muted-foreground", {
  variants: {
    size: {
      sm: "text-sm leading-normal",
      xs: "text-xs leading-normal",
      "2xs": "text-2xs leading-normal",
      inherit: "font-normal",
    },
  },
  defaultVariants: { size: "sm" },
});

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
    <TextAs as={as} className={cn(captionVariants({ size }), className)} {...props}>
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
 * The label role: a form label, a column header, the key a reader scans for.
 * 500 is the only weight bump a dense surface needs below a heading.
 *
 * The rungs are the caption's, deliberately. A label and a caption are one pair
 * — the key and the value, the name and the note — and a pair that cannot be set
 * at one size is not a pair. Pinning the label to `sm` while the caption had an
 * axis is what sent a key next to an `xs` value out to `font-medium text-xs` in
 * a className, leaving the weight arguing with the rung it landed on.
 *
 * `as` is here for the same reason it is on `TypographyEyebrow`: a config panel
 * names its sections at this size, and those names are the page's outline.
 */
const labelVariants = cva("font-medium text-foreground", {
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
});

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
 * A numeric readout. Size and colour ride in via className per use.
 *
 * Tabular is right in a column and wrong in a headline, so it is an axis rather
 * than a constant. Keep `tabular` anywhere a value updates in place.
 */
const statVariants = cva("font-semibold tracking-tight", {
  variants: {
    /**
     * Named rungs, because the ramp was reachable only by spelling a class. The
     * three here are the ones call sites actually converged on: `display` is the
     * figure a section is built around, `page` and `panel` ride the heading
     * ladder so a stat and the heading beside it step together — and therefore
     * retune together on an editorial surface, which a literal never would.
     *
     * `inherit` is the default and writes nothing: a stat inside a heading, a
     * chip or a sentence takes the size that set it, and every existing call
     * site keeps the size it passed.
     */
    size: {
      inherit: "",
      card: "text-h4",
      panel: "text-h3",
      page: "text-h1",
      display: "text-6xl font-black",
    },
    figures: {
      /** Even advances stop a value jittering as it refreshes. */
      tabular: "tabular-nums",
      /** A headline figure wants its drawn spacing: a lone 1 is not an 8. */
      proportional: "proportional-nums",
    },
  },
  defaultVariants: { size: "inherit", figures: "tabular" },
});

export type StatVariants = VariantProps<typeof statVariants>;

export function TypographyStat({
  className,
  size,
  figures,
  children,
  ...props
}: ComponentProps<"span"> & StatVariants) {
  return (
    <span
      className={cn(statVariants({ size, figures }), className)}
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
        "rounded-[3px] bg-foreground/[0.03] px-[0.3em] py-[0.1em] font-mono text-[0.9em] text-secondary-ink",
        className,
      )}
      {...props}
    >
      {children}
    </code>
  );
}

/**
 * A statement about the surface, not the link: `foreground` inside a paragraph,
 * `primary` when the link is the point of the line, `secondary` for a note
 * beneath a hero where `primary` would compete with the CTA beside it.
 */
const LINK_TONES = {
  foreground: "font-medium text-foreground",
  primary: "font-medium text-primary",
  secondary: "text-secondary-ink",
} as const;

const LINK_DECORATION =
  "underline decoration-dotted decoration-1 decoration-muted-foreground decoration-skip-ink-none underline-offset-2 hover:decoration-solid hover:decoration-current/70";

export type LinkTone = keyof typeof LINK_TONES;

const linkClass = (tone: LinkTone = "foreground", className?: string) =>
  cn(LINK_TONES[tone], LINK_DECORATION, className);

type TypographyLinkProps = Omit<ComponentProps<"a">, "href"> & {
  href: string;
  children: ReactNode;
  tone?: LinkTone;
  /** Defaults on for an off-site link. Turn it off for one that starts a flow the reader should stay in. */
  newTab?: boolean;
  /**
   * A trailing arrow, for a link that ends a sentence and leads somewhere. The
   * glyph follows the href: `↗` when the link leaves the site, `→` when it does
   * not. That is the convention, and it is not a call site's to get wrong.
   */
  addArrow?: boolean;
};

/**
 * The inline link.
 *
 * Internal and external are decided from the href, never at the call site: an
 * href with a scheme renders a plain anchor and, if it is http(s), opens away
 * with `rel="noopener noreferrer"`; everything else routes through the router's
 * Link. `newTab` is the one override, for an off-site href that starts a flow
 * the reader should stay in. Call-site props apply last, so a passed
 * `target`/`rel` still wins.
 *
 * The router is `next-view-transitions`, imported rather than injected. Every
 * project on this package is a Next app and wants the same link, and a factory
 * bought router-agnosticism nobody used at the price of a component that could
 * not be imported by name. One call site ended up on the unbound version that
 * way and lost its decoration.
 */
export function TypographyLink({
  href,
  children,
  tone = "foreground",
  newTab,
  addArrow,
  className,
  ...props
}: TypographyLinkProps) {
  const style = linkClass(tone, className);
  const external = /^[a-z][a-z0-9+.-]*:/i.test(href);
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
          <path d={external ? "M7 17 17 7M7 7h10v10" : "M5 12h14M12 5l7 7-7 7"} />
        </svg>
      )}
    </>
  );

  if (external) {
    const away = newTab ?? href.startsWith("http");
    return (
      <a
        href={href}
        className={style}
        {...(away ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...props}
      >
        {body}
      </a>
    );
  }

  return (
    <Link href={href} className={style} {...props}>
      {body}
    </Link>
  );
}
