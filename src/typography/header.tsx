import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../cn.js";

/**
 * The heading ladder. Four levels, one rung each.
 *
 * A heading does not pick its size — `--text-h1`…`--text-h4` in type.css do, and
 * `.editorial` retunes all four together. That is the whole design: size is a
 * property of the SURFACE, and level is the only thing a call site knows. When
 * the rungs were shared with body copy the call site had to know both, which is
 * how `larger` and `entry` appeared — variants whose entire job was to climb out
 * of a rung that read fine in the product and landed under the paragraph on a
 * marketing page. Retuning a surface now means editing two lines of CSS.
 *
 * `display` is the one exception, and it is a role rather than a size: the
 * heading on a landing page that has to outrank the same level in the docs. It
 * is spelled in shared rungs on purpose — it is only ever seen on `.editorial`.
 *
 * Tailwind scans comments — never spell a class out here or it becomes a real
 * utility.
 */

/**
 * The heading face, stated once. Anything wearing it composes this rather than
 * respelling it: a second literal here is a level (or a deck) that forked, and a
 * literal weight beside the face survives into `.editorial` and synthesises the
 * single-weight serif. viably asserts there is exactly one of these strings.
 */
const HEADING_FACE = "font-heading font-[number:var(--heading-weight)]";

const HEADING_BASE = `scroll-m-20 ${HEADING_FACE} text-foreground`;

const h1Variants = cva(`${HEADING_BASE} tracking-tight`, {
  variants: {
    variant: {
      /** The page title: 22px in the product, 36 on an editorial surface. */
      default: "text-h1",
      /** A landing hero, drawn to be seen from the top of a scroll. */
      display: "heading-display text-4xl sm:text-5xl",
    },
  },
  defaultVariants: { variant: "default" },
});

export function TypographyH1({
  className,
  variant,
  children,
  ...props
}: React.ComponentProps<"h1"> & VariantProps<typeof h1Variants>) {
  return (
    <h1 className={cn(h1Variants({ variant }), className)} {...props}>
      {children}
    </h1>
  );
}

const h2Variants = cva(`${HEADING_BASE} tracking-[-0.01em] first:mt-0`, {
  variants: {
    variant: {
      /** The section heading: 18px in the product, 30 on an editorial surface. */
      default: "text-h2",
      /** A landing page's section heading, one step over the docs equivalent. */
      display: "heading-display text-3xl sm:text-4xl",
    },
  },
  defaultVariants: { variant: "default" },
});

/** The h2 ramp as a class, for a caller that must render its own element. */
export const headingClass = (
  variant?: VariantProps<typeof h2Variants>["variant"],
) => h2Variants({ variant });

/**
 * `divider` is a rule under the heading, not a size — it used to ride the size
 * axis as `default` vs `unbordered`, which made every call site state a border
 * it had no opinion about in order to reach the size it wanted.
 */
export function TypographyH2({
  className,
  variant,
  divider,
  children,
  ...props
}: React.ComponentProps<"h2"> &
  VariantProps<typeof h2Variants> & { divider?: boolean }) {
  return (
    <h2
      className={cn(
        h2Variants({ variant }),
        divider && "w-fit border-b pb-2",
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

const h3Variants = cva(HEADING_BASE, {
  variants: {
    variant: {
      /** The subhead: 16px in the product, 24 on an editorial surface. */
      default: "text-h3",
      /**
       * The lead card in a grid — a featured post, a pinned series. Present at
       * this rung and not below it: h4 is a panel title, and a panel title that
       * reaches for a display size is a section heading wearing the wrong tag.
       */
      display: "heading-display text-2xl sm:text-3xl",
    },
  },
  defaultVariants: { variant: "default" },
});

export function TypographyH3({
  className,
  variant,
  children,
  ...props
}: React.ComponentProps<"h3"> & VariantProps<typeof h3Variants>) {
  return (
    <h3 className={cn(h3Variants({ variant }), className)} {...props}>
      {children}
    </h3>
  );
}

/** The card / panel title: 14px in the product, 20 on an editorial surface. */
export function TypographyH4({
  className,
  children,
  ...props
}: React.ComponentProps<"h4">) {
  return (
    <h4 className={cn(HEADING_BASE, "text-h4", className)} {...props}>
      {children}
    </h4>
  );
}

const deckVariants = cva(
  `${HEADING_FACE} heading-display text-foreground`,
  {
    variants: {
      size: {
        /** Under a section heading. */
        sm: "text-base lg:text-lg",
        /** The page-title deck: the default, and the only one most pages need. */
        md: "text-lg lg:text-xl",
        /** A hero that carries the deck instead of body copy beneath it. */
        lg: "text-lg lg:text-xl xl:text-2xl",
      },
    },
    defaultVariants: { size: "md" },
  },
);

/**
 * The deck: the line of standfirst that sits with a page title and finishes the
 * thought the title started.
 *
 * It belongs to the heading layer rather than the paragraph's, even though it
 * renders a paragraph element — it takes the surface's heading family, weight
 * and slant, which is what every hand-rolled copy of it restated by hand, down
 * to a literal weight that `.editorial` was already overriding to 400.
 *
 * The box shrink-wraps its text by default, because a deck is usually painted:
 * a gradient clipped to the glyphs, a marker behind them. A full-width box
 * paints the line's empty remainder too. The trailing padding goes with it —
 * an italic's last glyph overhangs its advance width, and a box shrunk to that
 * advance clips the overhang out of whatever is doing the painting.
 */
export function TypographyDeck({
  className,
  size,
  children,
  ...props
}: React.ComponentProps<"p"> & VariantProps<typeof deckVariants>) {
  return (
    <p
      className={cn(deckVariants({ size }), "w-fit pr-2", className)}
      {...props}
    >
      {children}
    </p>
  );
}

const eyebrowVariants = cva("block uppercase tracking-wider", {
  variants: {
    tone: {
      /**
       * Weight is load-bearing here: uppercase at this size loses shape at 400.
       * Primary ink, stated not inherited — an eyebrow names the section under it,
       * and one that turns red from its surroundings is not a heading.
       */
      heading: "text-xs font-semibold text-foreground",
      /** Stat cards invert it: the figure is the headline, so the label yields. */
      label: "text-2xs font-medium text-accent-foreground",
    },
  },
  defaultVariants: { tone: "heading" },
});

/**
 * The eyebrow's ramp as a class, for a caller that cannot render our element —
 * a dialog title primitive, a motion element. Same escape hatch as
 * `headingClass`, and it exists so that a consumer needing the class does not
 * hand-roll a second copy of it that then drifts from the component.
 */
export const eyebrowClass = (
  tone?: VariantProps<typeof eyebrowVariants>["tone"],
) => eyebrowVariants({ tone });

/**
 * An all-caps micro-label above a stat or a group of controls.
 *
 * `as` exists for the one case the span cannot serve: an eyebrow that is also
 * the section's heading. A surface that labels its sections this way still owes
 * a screen reader the outline, and the alternative — a hand-rolled `<h2>`
 * wearing these classes — is how the label drifts from the ones beside it.
 * The classes do not change with the element, so it is an element choice
 * rather than a second component, the same call `TypographyCaption` makes.
 */
export function TypographyEyebrow({
  className,
  tone,
  as = "span",
  children,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof eyebrowVariants> & {
    as?: "span" | "p" | "div" | "h1" | "h2" | "h3" | "h4";
  }) {
  // Every accepted tag shares the attribute surface used here; narrowing the
  // ref per tag would need a generic no call site asks for.
  const As = as as "span";
  return (
    <As className={cn(eyebrowVariants({ tone }), className)} {...props}>
      {children}
    </As>
  );
}
