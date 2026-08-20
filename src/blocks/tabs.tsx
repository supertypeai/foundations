"use client";

import { useId, useState, type ReactNode } from "react";

import { cn } from "../cn.js";

/**
 * A tab group.
 *
 * The one block in the package that carries state, and therefore the one marked
 * `"use client"`. It is hand-rolled on buttons and `role="tabpanel"` rather than
 * taken from Radix or Base UI for the same reason as Accordion: the consuming
 * projects are split across those two libraries, and a shared package that picked
 * one would force a migration for a widget this small.
 *
 * Children are `<Tab>` elements, paired with `items` **by position**. `Tab` takes
 * an optional `value` for readability at the call site; it is not matched against
 * `items`, because doing so would silently drop a panel whose label was edited in
 * one place and not the other. Position is the contract, and it is the one the
 * markup already makes obvious.
 */
export function Tabs({
  items,
  children,
  className,
}: {
  /** Tab labels, in order. Paired with the children by position. */
  items: string[];
  children: ReactNode;
  className?: string;
}) {
  const [active, setActive] = useState(0);
  const id = useId();

  const panels = Array.isArray(children) ? children : [children];

  return (
    <div className={cn("my-6", className)}>
      <div role="tablist" className="flex gap-1 border-b border-border">
        {items.map((label, i) => (
          <button
            key={label}
            role="tab"
            type="button"
            id={`${id}-tab-${i}`}
            aria-selected={active === i}
            aria-controls={`${id}-panel-${i}`}
            onClick={() => setActive(i)}
            className={cn(
              "-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors",
              active === i
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>
      {panels.map((panel, i) => (
        <div
          key={i}
          role="tabpanel"
          id={`${id}-panel-${i}`}
          aria-labelledby={`${id}-tab-${i}`}
          hidden={active !== i}
          className="pt-4 text-sm text-muted-foreground"
        >
          {panel}
        </div>
      ))}
    </div>
  );
}

/**
 * One panel inside `Tabs`.
 *
 * `value` is documentation at the call site — it names the panel next to its
 * content — and is intentionally not used for matching. See `Tabs`.
 */
export function Tab({
  children,
}: {
  value?: string;
  children: ReactNode;
}) {
  return <>{children}</>;
}
