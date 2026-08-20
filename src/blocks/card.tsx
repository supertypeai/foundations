import type { ComponentProps, ReactNode } from "react";

import { cn } from "../cn.js";
import type { ProseLinkComponent } from "../typography/paragraph.js";

/**
 * A grid of cards. Two columns from `sm` up, which is the density that keeps a
 * pair of cards reading as a set rather than as two unrelated panels.
 */
export function Cards({ className, children, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("my-6 grid gap-4 sm:grid-cols-2", className)}
      {...props}
    >
      {children}
    </div>
  );
}

type CardBaseProps = {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
  /**
   * Force the off-site treatment. Normally inferred from the href having a
   * scheme, which is right for almost every case; this is the override for an
   * absolute URL back to your own site, or a relative one that leaves the app.
   */
  external?: boolean;
};

const CARD_CLASS =
  "block rounded-xl border border-border bg-card p-4 text-card-foreground no-underline transition-colors";

function CardBody({
  title,
  description,
  icon,
  children,
}: Pick<CardBaseProps, "title" | "description" | "icon" | "children">) {
  return (
    <>
      {icon ? <div className="mb-2 text-muted-foreground">{icon}</div> : null}
      <div className="font-semibold text-foreground">{title}</div>
      {description ? (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      ) : null}
      {children ? (
        <div className="mt-2 text-sm text-muted-foreground">{children}</div>
      ) : null}
    </>
  );
}

/**
 * Builds the Card component, bound to the consuming app's router Link.
 *
 * Same factory shape as `createProseLink`, for the same reason: a card with an
 * `href` has to route through the app's Link, and the package does not depend on
 * a router. A card without one renders as a plain div, so a Card is not silently
 * a dead link.
 */
/**
 * Builds the Card component, bound to the consuming app's router Link.
 *
 * Same factory shape as `createProseLink`, for the same reason: a card with an
 * `href` has to route through the app's Link, and the package does not depend on
 * a router. A card without one renders as a plain div, so a Card is not silently
 * a dead link.
 *
 * Unrecognised props pass straight through to the rendered element. Card is one
 * of the few blocks authored by hand in MDX and in page code, and callers
 * legitimately reach for `id`, `width`, `color` and the rest of the HTML surface;
 * enumerating that surface in the type buys nothing and breaks a build every time
 * someone uses an attribute the package had not thought of.
 */
export function createCard(LinkComponent: ProseLinkComponent) {
  return function Card({
    href,
    className,
    external,
    title,
    description,
    icon,
    children,
    ...rest
  }: CardBaseProps & { href?: string } & Omit<
      ComponentProps<"a">,
      keyof CardBaseProps | "href"
    >) {
    const body = <CardBody title={title} description={description} icon={icon}>{children}</CardBody>;

    if (!href) {
      return (
        <div className={cn(CARD_CLASS, className)} {...(rest as ComponentProps<"div">)}>
          {body}
        </div>
      );
    }

    const leavesApp = external ?? /^[a-z][a-z0-9+.-]*:/i.test(href);
    const classes = cn(CARD_CLASS, "hover:bg-accent", className);

    if (leavesApp) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
          {...rest}
        >
          {body}
        </a>
      );
    }

    return (
      <LinkComponent href={href} className={classes} {...rest}>
        {body}
      </LinkComponent>
    );
  };
}
