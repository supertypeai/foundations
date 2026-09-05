import { Children, cloneElement, isValidElement, type ComponentProps, type ReactNode } from "react";

import { cn } from "../cn.js";
import { toneClass, type Tone } from "../tone.js";
import { DISCLOSURE, DisclosureChevron } from "./disclosure.js";

/**
 * A disclosure group: `<details>`/`<summary>`, no JS, correct before hydration.
 * Named for what it is rather than `Accordion`, the interactive Base UI component
 * next door. Sharing a name is how a call site ends up with the wrong one.
 */
export function DisclosureGroup({
  className,
  children,
  type = "multiple",
  defaultValue,
  name,
  tone = "primary",
  ...props
}: Omit<ComponentProps<"div">, "defaultValue"> & {
  /** `single` closes siblings when one opens. Defaults to `multiple`. */
  type?: "single" | "multiple";
  /** Title(s) open on first render. */
  defaultValue?: string | string[];
  /** Explicit group name; one is derived from `type` when omitted. */
  name?: string;
  /**
   * Inks the open mark, and only it — the same contract `TabsList` states. The
   * label is read rather than signalled, so it stays on the page's ink ladder.
   */
  tone?: Tone;
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
      className={cn(toneClass(tone), DISCLOSURE.group, className)}
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
      className={cn("group/disclosure", DISCLOSURE.item, className)}
      {...props}
    >
      {/* `list-none` plus the WebKit pseudo is the whole marker suppression: the
          chevron below is the mark, and a browser triangle beside it is two. */}
      <summary
        className={cn(
          DISCLOSURE.row,
          "list-none marker:hidden [&::-webkit-details-marker]:hidden",
        )}
      >
        {title}
        <DisclosureChevron />
      </summary>
      <div className={DISCLOSURE.panel}>{children}</div>
    </details>
  );
}
