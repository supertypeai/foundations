"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@supertype/foundations/blocks";

/** Base UI, animated, client-side. Its keyframes come from theme.css. */
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
