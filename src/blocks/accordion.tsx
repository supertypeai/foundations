import { Children, cloneElement, isValidElement, type ComponentProps, type ReactNode } from "react";

import { cn } from "../cn.js";
import { INK_ON_CARD } from "../tone.js";

/**
 * A disclosure group: `<details>`/`<summary>`, no JS, correct before hydration.
 *
 * Named for what it is rather than `Accordion`, the interactive Base UI
 * component next door. The two are not variants of each other — this one is a
 * server component an MDX author gets for free, that one animates and manages
 * state. Sharing a name is how a call site ends up with the wrong one.
 */
export function DisclosureGroup({
  className,
  children,
  type = "multiple",
  defaultValue,
  name,
  ...props
}: Omit<ComponentProps<"div">, "defaultValue"> & {
  /** `single` closes siblings when one opens. Defaults to `multiple`. */
  type?: "single" | "multiple";
  /** Title(s) open on first render. */
  defaultValue?: string | string[];
  /** Explicit group name; one is derived from `type` when omitted. */
  name?: string;
}) {
  // Single-open comes from the shared `name` attribute, which browsers implement
  // natively and which degrades to all-open where they do not — a fine failure
  // for a disclosure group, and far cheaper than shipping state for it.
  const open = defaultValue
    ? new Set(Array.isArray(defaultValue) ? defaultValue : [defaultValue])
    : null;

  const groupName =
    type === "single" ? (name ?? deriveGroupName(children)) : undefined;

  // Cloned rather than passed through context: a Provider would have to be a
  // client component, and this whole block exists to stay off that boundary.
  const items = Children.map(children, (child) => {
    if (!isValidElement<DisclosureProps>(child)) return child;
    // defaultValue matches on the title, so it can only match a string one. A
    // JSX title stringifies to "[object Object]" and would match nothing while
    // looking like it should.
    const title = child.props.title;
    const defaultOpen =
      open && typeof title === "string" ? open.has(title) : undefined;

    return cloneElement(child, {
      name: child.props.name ?? groupName,
      open: child.props.open ?? defaultOpen,
    });
  });

  return (
    <div
      className={cn(
        "my-6 divide-y divide-border overflow-hidden rounded-xl border border-border",
        className,
      )}
      {...props}
    >
      {items}
    </div>
  );
}

/**
 * `<details name>` must match across siblings, server and client, and builds — a
 * module counter fails all three, and `useId` is a hook in a server component.
 * Hashing the titles is deterministic; identical groups on one page would merge.
 */
function deriveGroupName(children: ReactNode): string {
  const titles: string[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement<DisclosureProps>(child) && typeof child.props.title === "string") {
      titles.push(child.props.title);
    }
  });

  // djb2. Short, stable, and the collision domain here is one page.
  let hash = 5381;
  const source = titles.join("|");
  for (let i = 0; i < source.length; i++) {
    hash = ((hash << 5) + hash + source.charCodeAt(i)) | 0;
  }
  return `accordion-${(hash >>> 0).toString(36)}`;
}

type DisclosureProps = Omit<ComponentProps<"details">, "title"> & {
  title: ReactNode;
  name?: string;
};

export function Disclosure({
  title,
  children,
  className,
  ...props
}: DisclosureProps) {
  return (
    <details
      className={cn("group bg-card", INK_ON_CARD, className)}
      {...props}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-sm font-medium text-foreground marker:hidden hover:bg-accent [&::-webkit-details-marker]:hidden">
        {title}
        <svg
          aria-hidden="true"
          className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>
      <div className="px-4 pb-4 text-sm text-muted-foreground">{children}</div>
    </details>
  );
}
