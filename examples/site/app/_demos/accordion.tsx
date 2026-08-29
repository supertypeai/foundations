"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@supertype.ai/foundations/blocks";

/**
 * A client component built on Base UI. The open and close keyframes come from
 * theme.css.
 */
export default function AccordionDemo() {
  return (
    <Accordion>
      <AccordionItem value="seat">
        <AccordionTrigger>What counts as a seat?</AccordionTrigger>
        <AccordionContent>Anyone who signs in during the billing period.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="proration">
        <AccordionTrigger>Are seats prorated?</AccordionTrigger>
        <AccordionContent>To the day, on the next invoice.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
