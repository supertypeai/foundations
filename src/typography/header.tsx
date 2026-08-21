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

const HEADING_BASE =
  "scroll-m-20 font-heading font-[number:var(--heading-weight)] text-foreground";

const h1Variants = cva(`${HEADING_BASE} tracking-tight`, {
  variants: {
    variant: {
      /** The page title: 22px in the product, 36 on an editorial surface. */
      default: "text-h1",
      /** A landing hero, drawn to be seen from the top of a scroll. */
      display: "text-4xl sm:text-5xl",
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
      display: "text-3xl sm:text-4xl",
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

/** The subhead: 16px in the product, 24 on an editorial surface. */
export function TypographyH3({
  className,
  children,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3 className={cn(HEADING_BASE, "text-h3", className)} {...props}>
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

/** An all-caps micro-label above a stat or a group of controls. */
export function TypographyEyebrow({
  className,
  tone,
  children,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof eyebrowVariants>) {
  return (
    <span className={cn(eyebrowVariants({ tone }), className)} {...props}>
      {children}
    </span>
  );
}
