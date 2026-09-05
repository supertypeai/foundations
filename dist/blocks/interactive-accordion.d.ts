/**
 * The interactive accordion: Base UI, animated, client-side.
 *
 * `Disclosure`/`DisclosureGroup` next door is the `<details>` version an MDX
 * author gets with no JS. Neither is a variant of the other, so they no longer
 * share a name — but they are one control, so every surface here comes from
 * `DISCLOSURE` and the two look identical on the page.
 */
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { type Tone } from "../tone.js";
/** `tone` inks the open mark, and only it. See `TabsList`, which states the same. */
declare function Accordion({ className, tone, ...props }: AccordionPrimitive.Root.Props & {
    tone?: Tone;
}): import("react").JSX.Element;
declare function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props): import("react").JSX.Element;
declare function AccordionTrigger({ className, children, ...props }: AccordionPrimitive.Trigger.Props): import("react").JSX.Element;
declare function AccordionContent({ className, children, ...props }: AccordionPrimitive.Panel.Props): import("react").JSX.Element;
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
