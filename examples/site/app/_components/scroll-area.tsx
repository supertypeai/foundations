"use client";

import type { ComponentProps } from "react";
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import { cn } from "@supertype.ai/foundations";

/**
 * The shadcn scroll area, over the Base UI primitive the package already
 * depends on. A demo wider than the column scrolls inside this rather than on
 * a native `overflow-x-auto`, so the preview carries a thin overlay bar in the
 * design's own tokens instead of the platform's chrome.
 */
export function ScrollArea({
  className,
  children,
  ...props
}: ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  return (
    <ScrollAreaPrimitive.Root className={cn("relative", className)} {...props}>
      <ScrollAreaPrimitive.Viewport className="size-full rounded-[inherit] outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
        <ScrollAreaPrimitive.Content>{children}</ScrollAreaPrimitive.Content>
      </ScrollAreaPrimitive.Viewport>
      <Scrollbar orientation="horizontal" />
      <Scrollbar orientation="vertical" />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

/** Hidden until the pointer is in the area or the viewport is moving. */
function Scrollbar({ orientation }: { orientation: "horizontal" | "vertical" }) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      orientation={orientation}
      className={cn(
        "flex touch-none select-none p-px opacity-0 transition-opacity",
        "data-hovering:opacity-100 data-scrolling:opacity-100 data-scrolling:duration-0",
        orientation === "horizontal" ? "h-2.5 flex-col" : "w-2.5",
      )}
    >
      <ScrollAreaPrimitive.Thumb className="size-full rounded-full bg-border" />
    </ScrollAreaPrimitive.Scrollbar>
  );
}
