import {
  cn,
  toneClass,
  TypographyCaption,
  TypographyLabel,
  type Tone,
} from "@supertype.ai/foundations";
import { Badge, Button } from "@supertype.ai/foundations/blocks";

/**
 * The tone vocabulary, painted with itself. Every square below is a
 * `bg-(--tone-fill)` inside a `TONE[…]` class — the same two lines the button
 * beside it uses. No hex, no token name repeated in a style attribute, so this
 * page cannot claim a colour the package no longer ships.
 */

const ROWS: readonly { tone: Tone; token: string; means: string }[] = [
  { tone: "muted", token: "--muted", means: "Chrome. Says nothing on purpose." },
  { tone: "primary", token: "--primary", means: "The one action on the page." },
  { tone: "secondary", token: "--secondary", means: "The warm accent beside it." },
  { tone: "brand", token: "--brand", means: "Whatever the app calls its own." },
  { tone: "success", token: "--success", means: "It worked." },
  { tone: "warn", token: "--warn", means: "You can still get this wrong." },
  { tone: "destructive", token: "--destructive", means: "It deletes, or it failed." },
];

/** Three cuts per tone, because a fill is a mark at 3:1 and an ink is words at
 *  4.5:1, and no single value clears both. */
const CUTS = [
  { label: "fill", className: "bg-(--tone-fill)" },
  { label: "ink", className: "bg-(--tone-hue)" },
  { label: "wash", className: "bg-(--tone-wash)" },
];

export function ToneLedger() {
  return (
    <ul className="mt-4 overflow-hidden rounded-xl border border-border">
      {ROWS.map(({ tone, token, means }) => (
        <li
          key={tone}
          className={cn(
            toneClass(tone),
            "grid grid-cols-1 items-center gap-x-6 gap-y-4 border-b border-border px-4 py-5 last:border-0",
            "sm:grid-cols-[8rem_8rem_1fr] lg:grid-cols-[8rem_8rem_10rem_1fr]",
          )}
        >
          <div>
            <TypographyLabel as="p" className="text-(color:--tone-hue)">
              {tone}
            </TypographyLabel>
            <TypographyCaption as="p" size="2xs" className="font-mono">
              {token}
            </TypographyCaption>
          </div>

          <ul className="flex gap-1.5">
            {CUTS.map(({ label, className }) => (
              <li key={label}>
                <span
                  className={cn(
                    "block size-9 rounded-md border border-border",
                    className,
                  )}
                />
                <TypographyCaption as="p" size="2xs" className="text-center">
                  {label}
                </TypographyCaption>
              </li>
            ))}
          </ul>

          <TypographyCaption as="p" className="hidden lg:block">
            {means}
          </TypographyCaption>

          <div className="flex flex-wrap items-center gap-2">
            <Button tone={tone} size="sm">
              Publish
            </Button>
            <Button tone={tone} variant="soft" size="sm">
              Publish
            </Button>
            <Button tone={tone} variant="outline" size="sm">
              Publish
            </Button>
            <Badge tone={tone} variant="soft">
              Queued
            </Badge>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Names developers reach for that the one-to-one rule does not ship, and the
 *  tone to use instead. Each of these is a type error at the call site; this is
 *  the answer to it. */
const ALIASES: readonly { reached: string; use: Tone; why: string }[] = [
  {
    reached: "neutral",
    use: "muted",
    why: "The package says muted everywhere — --muted-foreground, TypographyMuted. Same register, one name.",
  },
  {
    reached: "accent",
    use: "primary",
    why: "--accent is the hover tint --primary casts. tone=\"primary\" with variant=\"soft\" is the colour you were after.",
  },
  {
    reached: "info",
    use: "secondary",
    why: "--info exists as a status token, but it is not a tone: nothing renders a button or badge in it. For a neutral-but-coloured mark, use secondary.",
  },
] as const;

export function ToneAliases() {
  return (
    <ul className="mt-4 grid gap-4 sm:grid-cols-3">
      {ALIASES.map(({ reached, use, why }) => (
        <li
          key={reached}
          // The row is set in the tone it points at, so the replacement is shown and
          // not just named. `--tone-hue` has to be declared to be read.
          className={cn(
            toneClass(use),
            "flex flex-col gap-2 rounded-xl border border-border p-4",
          )}
        >
          <div className="flex flex-col gap-0.5 font-mono">
            <TypographyLabel as="p" className="text-muted-foreground line-through">
              tone=&quot;{reached}&quot;
            </TypographyLabel>
            <TypographyLabel as="p" className="text-(color:--tone-hue)">
              <span aria-hidden className="pr-1 text-muted-foreground">
                &rarr;
              </span>
              tone=&quot;{use}&quot;
            </TypographyLabel>
          </div>
          <TypographyCaption as="p" className="leading-relaxed">
            {why}
          </TypographyCaption>
        </li>
      ))}
    </ul>
  );
}
