import type { ComponentProps } from "react";

import {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
} from "./typography/header.js";
import { cn } from "./cn.js";
import Image from "next/image";
import { Disclosure, DisclosureGroup } from "./blocks/accordion.js";
import { Callout } from "./blocks/callout.js";
import { Card, Cards } from "./blocks/card.js";
import { Step, Steps } from "./blocks/steps.js";
import { TabGroup, Tab } from "./blocks/tabs.js";
import {
  TypographyProse,
  TypographyProseList,
  TypographyLink,
} from "./typography/paragraph.js";

/**
 * Rendered from markdown syntax, so there is no call site and no knob — a knob
 * here is one every project turns differently. Headings carry variants and this
 * map binds them; retune in CSS via `--prose-measure` / `--prose-leading`.
 *
 * A constant rather than a factory: the router and the image component are the
 * package's now, so there is nothing left for a consumer to inject.
 */
export const proseMdxComponents = {
  // Authorable blocks. Unlike the elements below these ARE called by hand in
  // MDX, so they take props — but never a `className`: an author writing
  // <Card> is choosing a component, not restyling one.
  Card,
  Cards,
  Accordions: DisclosureGroup,
  Accordion: Disclosure,
  Banner: (props: ComponentProps<typeof Callout>) => (
    <Callout density="editorial" {...props} />
  ),
  Tabs: TabGroup,
  Tab,
  Steps,
  Step,
  h1: (props: ComponentProps<"h1">) => (
    <TypographyH1 variant="display" {...props} />
  ),
  h2: (props: ComponentProps<"h2">) => <TypographyH2 {...props} />,
  h3: (props: ComponentProps<"h3">) => <TypographyH3 {...props} />,
  h4: (props: ComponentProps<"h4">) => <TypographyH4 {...props} />,
  p: (props: ComponentProps<"p">) => <TypographyProse {...props} />,
  ul: (props: ComponentProps<"ul">) => <TypographyProseList {...props} />,
  ol: (props: ComponentProps<"ol">) => (
    <TypographyProseList ordered {...(props as ComponentProps<"ul">)} />
  ),
  li: (props: ComponentProps<"li">) => (
    <li className="[&>ul]:mt-2 [&>ol]:mt-2" {...props} />
  ),
  // No quotemark glyph: a markdown `>` block is already marked as a quote by
  // its rule and its indent, and a mark on top of that reads as decoration.
  blockquote: ({ className, ...props }: ComponentProps<"blockquote">) => (
    <blockquote
      className={cn(
        "my-6 border-l-[3px] border-border pl-5 text-lg italic leading-relaxed text-foreground",
        className,
      )}
      {...props}
    />
  ),
  a: ({ href = "", children }: ComponentProps<"a">) => (
    <TypographyLink href={href}>{children}</TypographyLink>
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

  img: ({
  alt = "",
  src,
  width,
  height,
  ...props
}: ComponentProps<"img">) => {
  const className = "my-6 h-auto max-w-full rounded-xl border border-border";
  // `next/image` needs a real src and intrinsic dimensions, which a markdown
  // `![](…)` lacks unless a remark plugin measured them. The plain `<img>` is
  // the fallback for when it did not.
  const w = Number(width);
  const h = Number(height);
  if (typeof src === "string" && w > 0 && h > 0) {
    return (
      <Image
        src={src}
        width={w}
        height={h}
        alt={alt}
        className={className}
        {...props}
      />
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={typeof src === "string" ? src : undefined}
      width={width}
      height={height}
      alt={alt}
      className={className}
      {...props}
    />
  );
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
