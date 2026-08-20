import type { ComponentProps } from "react";
import type { InjectedComponent } from "./injection.js";
import { Accordion, Accordions } from "./blocks/accordion.js";
import { Banner } from "./blocks/banner.js";
import { Cards } from "./blocks/card.js";
import { Step, Steps } from "./blocks/steps.js";
import { Tab, Tabs } from "./blocks/tabs.js";
import { type ProseLinkComponent } from "./typography/paragraph.js";
/**
 * Rendered from markdown syntax, so there is no call site and no knob — a knob
 * here is one every project turns differently. Headings carry variants and this
 * map binds them; retune in CSS via `--prose-measure` / `--prose-leading`.
 */
export type ProseMdxOptions = {
    /** Internal hrefs route through it; a scheme renders a plain anchor. */
    Link: ProseLinkComponent;
    /**
     * Optional; without it images render as a plain `<img>`. `next/image` needs
     * intrinsic dimensions a markdown `![](…)` lacks, so the fallback covers a
     * remark plugin not having supplied them.
     */
    Image?: InjectedComponent;
};
export declare function createProseMdxComponents({ Link, Image }: ProseMdxOptions): {
    Card: ({ href, className, external, title, description, icon, size, children, ...rest }: {
        title?: import("react").ReactNode;
        description?: import("react").ReactNode;
        icon?: import("react").ReactNode;
        external?: boolean;
        size?: import("./index.js").CardSize;
    } & {
        href?: string;
        children?: import("react").ReactNode;
    } & Omit<ComponentProps<"a">, keyof {
        title?: import("react").ReactNode;
        description?: import("react").ReactNode;
        icon?: import("react").ReactNode;
        external?: boolean;
        size?: import("./index.js").CardSize;
    } | "href" | "children">) => import("react").JSX.Element;
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
     * The frame only — never set `color`, or it beats shiki's token spans.
     * `tabIndex` keeps a horizontally scrolling block reachable by keyboard.
     */
    pre: ({ className, ...props }: ComponentProps<"pre">) => import("react").JSX.Element;
    img: ({ alt, ...props }: ComponentProps<"img">) => import("react").JSX.Element;
    hr: () => import("react").JSX.Element;
    strong: (props: ComponentProps<"strong">) => import("react").JSX.Element;
    table: (props: ComponentProps<"table">) => import("react").JSX.Element;
    th: (props: ComponentProps<"th">) => import("react").JSX.Element;
    td: (props: ComponentProps<"td">) => import("react").JSX.Element;
};
