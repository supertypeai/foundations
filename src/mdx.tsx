import type { ComponentProps } from "react";

import {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
} from "./typography/header.js";
import { cn } from "./cn.js";
import type { InjectedComponent } from "./injection.js";
import { Accordion, Accordions } from "./blocks/accordion.js";
import { Banner } from "./blocks/banner.js";
import { Cards, createCard } from "./blocks/card.js";
import { Step, Steps } from "./blocks/steps.js";
import { Tab, Tabs } from "./blocks/tabs.js";
import {
  type ProseLinkComponent,
  TypographyProse,
  TypographyProseList,
  TypographyQuote,
  createProseLink,
} from "./typography/paragraph.js";

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

export function createProseMdxComponents({ Link, Image }: ProseMdxOptions) {
  const ProseLink = createProseLink(Link);
  const Card = createCard(Link);

  return {
    // Authorable blocks. Unlike the elements below these ARE called by hand in
    // MDX, so they take props — but never a `className`: an author writing
    // <Card> is choosing a component, not restyling one.
    Card,
    Cards,
    Accordion,
    Accordions,
    Banner,
    Tabs,
    Tab,
    Steps,
    Step,
    h1: (props: ComponentProps<"h1">) => (
      <TypographyH1 variant="display" {...props} />
    ),
    h2: (props: ComponentProps<"h2">) => (
      <TypographyH2 variant="essay" {...props} />
    ),
    h3: (props: ComponentProps<"h3">) => (
      <TypographyH3 variant="essay" {...props} />
    ),
    h4: (props: ComponentProps<"h4">) => <TypographyH4 {...props} />,
    p: (props: ComponentProps<"p">) => <TypographyProse {...props} />,
    ul: (props: ComponentProps<"ul">) => <TypographyProseList {...props} />,
    ol: (props: ComponentProps<"ol">) => (
      <TypographyProseList ordered {...(props as ComponentProps<"ul">)} />
    ),
    li: (props: ComponentProps<"li">) => (
      <li className="[&>ul]:mt-2 [&>ol]:mt-2" {...props} />
    ),
    blockquote: ({ children, ...props }: ComponentProps<"blockquote">) => (
      // No quotemark: a markdown `>` block is already marked as a quote by its
      // rule and indent, and the glyph on top of that reads as decoration.
      <TypographyQuote hideQuotemark {...props}>
        {children}
      </TypographyQuote>
    ),
    a: ({ href = "", children }: ComponentProps<"a">) => (
      <ProseLink href={href}>{children}</ProseLink>
    ),
    /**
     * The frame only — never set `color`, or it beats shiki's token spans.
     * `tabIndex` keeps a horizontally scrolling block reachable by keyboard.
     */
    pre: ({ className, ...props }: ComponentProps<"pre">) => (
      <pre
        tabIndex={0}
        className={cn(
          "my-6 overflow-x-auto rounded-xl border border-border p-4 text-sm leading-relaxed",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className,
        )}
        {...props}
      />
    ),

    img: ({ alt = "", ...props }: ComponentProps<"img">) => {
      const className = "my-6 h-auto max-w-full rounded-xl border border-border";
      if (Image && props.width && props.height) {
        return <Image alt={alt} className={className} {...props} />;
      }
      // eslint-disable-next-line @next/next/no-img-element
      return <img alt={alt} className={className} {...props} />;
    },

    hr: () => <hr className="my-12 border-border" />,
    strong: (props: ComponentProps<"strong">) => (
      <strong className="font-semibold text-foreground" {...props} />
    ),
    table: (props: ComponentProps<"table">) => (
      <div className="mt-6 overflow-x-auto rounded-xl border border-border">
        <table className="w-full border-collapse text-sm" {...props} />
      </div>
    ),
    th: (props: ComponentProps<"th">) => (
      <th
        className="border-b border-border bg-muted/40 px-4 py-2.5 text-left font-semibold text-foreground"
        {...props}
      />
    ),
    td: (props: ComponentProps<"td">) => (
      <td
        className="border-b border-border/60 px-4 py-2.5 align-top text-muted-foreground"
        {...props}
      />
    ),
  };
}
