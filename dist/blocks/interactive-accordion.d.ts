/**
 * The interactive accordion: Base UI, animated, client-side.
 *
 * `Disclosure`/`DisclosureGroup` next door is the `<details>` version an MDX
 * author gets with no JS. Neither is a variant of the other, which is why they
 * no longer share a name.
 */
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
declare function Accordion({ className, ...props }: AccordionPrimitive.Root.Props): import("react").JSX.Element;
declare function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props): import("react").JSX.Element;
declare function AccordionTrigger({ className, children, ...props }: AccordionPrimitive.Trigger.Props): import("react").JSX.Element;
declare function AccordionContent({ className, children, ...props }: AccordionPrimitive.Panel.Props): import("react").JSX.Element;
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
