"use client";

import { useId, useState, type ReactNode } from "react";

import { cn } from "../cn.js";

/**
 * The one stateful block, hence the only `"use client"`. Hand-rolled for the same
 * reason as Accordion: the projects are split across Radix and Base UI. Children
 * pair with `items` **by position** — `value` is for readability and is not
 * matched, since matching would silently drop a panel on an edited label.
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

/** `value` names the panel at the call site; it is not used for matching. */
export function Tab({
  children,
}: {
  value?: string;
  children: ReactNode;
}) {
  return <>{children}</>;
}
