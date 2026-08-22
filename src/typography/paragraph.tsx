import { Link } from "next-view-transitions";

import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../cn.js";

/**
 * The body layer: one paragraph, one caption, one link.
 *
 * Two axes and no more. A paragraph picks a rung (interface copy or reading
 * copy) and an ink; a caption is always the secondary ink and picks a size.
 * Anything that was a separate component for one class is a preset below.
 */

const pVariants = cva("", {
  variants: {
    /**
     * `ui` is interface copy. `prose` is the reading rung, stated here and
     * nowhere else — it had drifted to five copies once already. Note that
     * `--text-lg` resolves larger on an editorial subtree, which is the point.
     */
    variant: {
      ui: "text-sm",
      prose: "text-pretty text-lg leading-relaxed",
      /**
       * The intro under a page title, and the only rung that steps with the
       * viewport. `prose` is a rung and holds still; this one is a ROLE, and the
       * role is "the paragraph a reader meets before the page has earned any
       * scrolling" — reading size on a phone, one step up once there is a column
       * to set it in. Every hand-rolled copy of it spelled exactly that pair of
       * sizes and nothing else.
       */
      lead: "text-pretty text-base leading-relaxed md:text-lg",
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

/** The UI rung in the secondary ink. */
export function TypographyMuted(props: ComponentProps<"p"> & ParagraphVariants) {
  return <TypographyP tone="muted" {...props} />;
}

/** Reading-size body copy. `TypographyMuted` is the same ink one rung down. */
export function TypographyProse(props: ComponentProps<"p"> & ParagraphVariants) {
  return <TypographyP variant="prose" tone="muted" {...props} />;
}

/** The deck's body-copy counterpart: the intro paragraph under a page title. */
export function TypographyLead(props: ComponentProps<"p"> & ParagraphVariants) {
  return <TypographyP variant="lead" tone="muted" {...props} />;
}

/** The reading rung as a class, so the list below composes it instead of restating it. */
const proseClass = pVariants({ variant: "prose", tone: "muted" });

/** A list at the prose rung, so it reads as body copy and not an aside. */
export function TypographyProseList({
  className,
  children,
  ordered,
  ...props
}: ComponentProps<"ul"> & { ordered?: boolean }) {
  const List = ordered ? "ol" : "ul";
  return (
    <List
      className={cn(
        "my-4 flex flex-col gap-1 pl-6 [&>li]:pl-1.5",
        ordered ? "list-decimal" : "list-disc",
        proseClass,
        className,
      )}
      {...(props as ComponentProps<"ol">)}
    >
      {children}
    </List>
  );
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
 * which is the variable the `text-*` step reads, so 1.5 wins at every rung.
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
 * the run is inline beside its subject or a block under it. The classes do not
 * change with it, so it is an element choice rather than a second component.
 */
export function TypographyCaption({
  className,
  size,
  as = "span",
  children,
  ...props
}: ComponentProps<"span"> & CaptionVariants & { as?: "span" | "p" | "small" }) {
  // The three elements share every attribute; only the ref's element type
  // differs, and narrowing it per tag would need a generic for no call site.
  const As = as as "span";
  return (
    <As className={cn(captionVariants({ size }), className)} {...props}>
      {children}
    </As>
  );
}

/**
 * Small print set as a block: a note under the thing it annotates, rather than
 * an aside inline with it. Same rung and same ink as the caption — small print
 * is small because it is muted, and dropping it a rung as well is what made
 * both apps hand-roll their own.
 */
export function TypographySmall(
  props: ComponentProps<"span"> & CaptionVariants,
) {
  return <TypographyCaption as="p" {...props} />;
}

/**
 * The label role: a form label, a column header, the key a reader scans for.
 * 500 is the only weight bump a dense surface needs below a heading.
 *
 * `as` is here for the same reason it is on `TypographyEyebrow`: a config panel
 * names its sections at this size, and those names are the page's outline. The
 * alternative a consumer reaches for is a hand-rolled `<h2>` wearing these two
 * classes, which is how a label drifts from the ones beside it. The classes do
 * not change with the element.
 */
export function TypographyLabel({
  className,
  as = "span",
  children,
  ...props
}: ComponentProps<"span"> & {
  as?: "span" | "p" | "div" | "label" | "h1" | "h2" | "h3" | "h4";
}) {
  const As = as as "span";
  return (
    <As
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    >
      {children}
    </As>
  );
}

/**
 * A numeric readout. Size and colour ride in via className per use.
 *
 * Tabular is right in a column and wrong in a headline: even advances are what
 * stop a value jittering as it refreshes, and they cost a headline figure the
 * spacing its designer drew, since a lone 1 carries the side bearings of an 8.
 * Keep `tabular` anywhere a value updates in place.
 */
export function TypographyStat({
  className,
  figures = "tabular",
  children,
  ...props
}: ComponentProps<"span"> & { figures?: "tabular" | "proportional" }) {
  return (
    <span
      className={cn(
        "font-semibold tracking-tight",
        figures === "proportional" ? "proportional-nums" : "tabular-nums",
        className,
      )}
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
 * beneath a hero where `primary` would compete with the CTA beside it, `muted`
 * for a link that sits under one.
 */
const LINK_TONES = {
  foreground: "font-medium text-foreground",
  primary: "font-medium text-primary",
  secondary: "text-secondary-ink",
  muted: "text-muted-foreground",
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
 * not be imported by name — which is how one call site ended up on the unbound
 * version and lost its decoration.
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
          className="ml-1 inline size-3.5 align-baseline"
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
