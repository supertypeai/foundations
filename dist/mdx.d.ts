import type { ComponentProps } from "react";
import type { InjectedComponent } from "./injection.js";
import { Accordion, Accordions } from "./blocks/accordion.js";
import { Banner } from "./blocks/banner.js";
import { Cards } from "./blocks/card.js";
import { Step, Steps } from "./blocks/steps.js";
import { Tab, Tabs } from "./blocks/tabs.js";
import { type ProseLinkComponent } from "./typography/paragraph.js";
/**
 * The MDX component map.
 *
 * These are the elements MDX renders *automatically* from markdown syntax, and
 * they are the one place the prose system takes no options: no `variant`, no
 * `className`, nothing a call site can reach. There is no call site — the author
 * writes a paragraph, and what it looks like is a decision the design system
 * already made. A knob here would be a knob every consuming project turns
 * differently, which is the drift this package exists to stop.
 *
 * Headings are the exception that proves it: they *do* carry variants, and this
 * map binds them (`essay`) rather than exposing the choice. A document's heading
 * rung belongs to the document, not to each heading in it.
 *
 * Retuning is done in CSS, through `--prose-measure` / `--prose-leading` /
 * `--prose-gap` and the colour tokens.
 */
export type ProseMdxOptions = {
    /**
     * The consuming app's router Link. Internal hrefs route through it; anything
     * with a scheme renders as a plain anchor that opens away from the app.
     */
    Link: ProseLinkComponent;
    /**
     * The app's optimising image component, e.g. `next/image`.
     *
     * Optional: without it markdown images render as a plain `<img>`, which is
     * correct but unoptimised. Injected rather than imported for the usual reason —
     * the package has no framework dependency — and note that `next/image` needs
     * intrinsic dimensions, which a markdown `![](…)` does not carry. A remark
     * plugin that measures the file (fumadocs-mdx ships one) has to supply them,
     * so the fallback below also covers the case where it has not.
     */
    Image?: InjectedComponent;
};
export declare function createProseMdxComponents({ Link, Image }: ProseMdxOptions): {
    Card: ({ href, className, external, title, description, icon, children, ...rest }: {
        title: import("react").ReactNode;
        description?: import("react").ReactNode;
        icon?: import("react").ReactNode;
        children?: import("react").ReactNode;
        className?: string;
        external?: boolean;
    } & {
        href?: string;
    } & Omit<ComponentProps<"a">, keyof {
        title: import("react").ReactNode;
        description?: import("react").ReactNode;
        icon?: import("react").ReactNode;
        children?: import("react").ReactNode;
        className?: string;
        external?: boolean;
    } | "href">) => import("react").JSX.Element;
    Cards: typeof Cards;
    Accordion: typeof Accordion;
    Accordions: typeof Accordions;
    Banner: typeof Banner;
    Tabs: typeof Tabs;
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
    blockquote: ({ children, ...props }: ComponentProps<"blockquote">) => import("react").JSX.Element;
    a: ({ href, children }: ComponentProps<"a">) => import("react").JSX.Element;
    /**
     * A fenced code block.
     *
     * Only the frame: the colours are already on the token spans as custom
     * properties, resolved by shiki.css. Nothing here may set a `color`, or it
     * would win over the highlighting on every unstyled token.
     *
     * `tabIndex` is not decoration — a block that scrolls horizontally must be
     * reachable by keyboard, or its right-hand side is unreadable without a mouse.
     */
    pre: ({ className, ...props }: ComponentProps<"pre">) => import("react").JSX.Element;
    img: ({ alt, ...props }: ComponentProps<"img">) => import("react").JSX.Element;
    hr: () => import("react").JSX.Element;
    strong: (props: ComponentProps<"strong">) => import("react").JSX.Element;
    table: (props: ComponentProps<"table">) => import("react").JSX.Element;
    th: (props: ComponentProps<"th">) => import("react").JSX.Element;
    td: (props: ComponentProps<"td">) => import("react").JSX.Element;
};
