/**
 * The interactive accordion: Base UI, animated, client-side.
 *
 * `Disclosure`/`DisclosureGroup` next door is the `<details>` version an MDX
 * author gets with no JS. Neither is a variant of the other, so they no longer
 * share a name — but they are one control, so every surface here comes from
 * `DISCLOSURE` and the two look identical on the page.
 */
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"

import { cn } from "../cn.js"
import { toneClass, type Tone } from "../tone.js"
import { DISCLOSURE, DisclosureChevron } from "./disclosure.js"

/** `tone` inks the open mark, and only it. See `TabsList`, which states the same. */
function Accordion({
  className,
  tone = "primary",
  ...props
}: AccordionPrimitive.Root.Props & { tone?: Tone }) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn(toneClass(tone), DISCLOSURE.group, className)}
      {...props}
    />
  )
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(DISCLOSURE.item, className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          DISCLOSURE.row,
          "flex-1 aria-disabled:pointer-events-none aria-disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
        <DisclosureChevron />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="overflow-hidden data-open:animate-accordion-down data-closed:animate-accordion-up"
      {...props}
    >
      <div
        className={cn(
          DISCLOSURE.panel,
          "h-(--accordion-panel-height) data-ending-style:h-0 data-starting-style:h-0",
          "[&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
