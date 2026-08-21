import type { ComponentProps } from "react";
import { Disclosure, DisclosureGroup } from "./blocks/accordion.js";
import { Callout } from "./blocks/callout.js";
import { Card, Cards } from "./blocks/card.js";
import { Step, Steps } from "./blocks/steps.js";
import { TabGroup, Tab } from "./blocks/tabs.js";
/**
 * Rendered from markdown syntax, so there is no call site and no knob — a knob
 * here is one every project turns differently. Headings carry variants and this
 * map binds them; retune in CSS via `--prose-measure` / `--prose-leading`.
 *
 * A constant rather than a factory: the router and the image component are the
 * package's now, so there is nothing left for a consumer to inject.
 */
export declare const proseMdxComponents: {
    Card: typeof Card;
    Cards: typeof Cards;
    Accordions: typeof DisclosureGroup;
    Accordion: typeof Disclosure;
    Banner: (props: ComponentProps<typeof Callout>) => import("react").JSX.Element;
    Tabs: typeof TabGroup;
    Tab: typeof Tab;
    Steps: typeof Steps;
    Step: typeof Step;
    h1: (props: ComponentProps<"h1">) => import("react").JSX.Element;
    h2: (props: ComponentProps<"h2">) => import("react").JSX.Element;
    h3: (props: ComponentProps<"h3">) => import("react").JSX.Element;
    h4: (props: ComponentProps<"h4">) => import("react").JSX.Element;
    p: (props: ComponentProps<"p">) => import("react").JSX.Element;
    ul: (props: ComponentProps<"ul">) => import("react").JSX.Element;
    ol: (props: ComponentProps<"ol">) => import("react").JSX.Element;
    li: (props: ComponentProps<"li">) => import("react").JSX.Element;
    blockquote: ({ className, ...props }: ComponentProps<"blockquote">) => import("react").JSX.Element;
    a: ({ href, children }: ComponentProps<"a">) => import("react").JSX.Element;
    /**
     * The frame only — never set `color`, or it beats shiki's token spans.
     * `tabIndex` keeps a horizontally scrolling block reachable by keyboard.
     */
    pre: ({ className, ...props }: ComponentProps<"pre">) => import("react").JSX.Element;
    img: ({ alt, src, width, height, ...props }: ComponentProps<"img">) => import("react").JSX.Element;
    hr: () => import("react").JSX.Element;
    strong: (props: ComponentProps<"strong">) => import("react").JSX.Element;
    table: (props: ComponentProps<"table">) => import("react").JSX.Element;
    th: (props: ComponentProps<"th">) => import("react").JSX.Element;
    td: (props: ComponentProps<"td">) => import("react").JSX.Element;
};
