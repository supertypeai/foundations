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
     * A fenced code block.
     *
     * Only the frame: the colours are already on the token spans as custom
     * properties, resolved by shiki.css. Nothing here may set a `color`, or it
     * would win over the highlighting on every unstyled token.
     *
     * `tabIndex` is not decoration — a block that scrolls horizontally must be
     * reachable by keyboard, or its right-hand side is unreadable without a mouse.
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
