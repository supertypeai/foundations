import {
  cn,
  toneClass,
  TypographyCaption,
  TypographyLabel,
  type Tone,
} from "@supertype.ai/foundations";
import { Badge, Button } from "@supertype.ai/foundations/blocks";
import { Icons } from "./icons";

/**
 * The tone vocabulary painted with itself: every square is `bg-(--tone-fill)`
 * under a tone class, so the page shows exactly what the package ships.
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

/** Three cuts per tone: a fill is a mark at 3:1, an ink is words at 4.5:1, and
 *  clearing both takes two values. */
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

/** Names developers reach for that the one-to-one rule leaves out, and the tone
 *  to use instead. Each one is a type error at the call site, and this is the
 *  answer to it. */
const ALIASES: readonly { reached: string; use: Tone; why: string }[] = [
  {
    reached: "neutral",
    use: "muted",
    why: "The package says muted everywhere: --muted-foreground, TypographyMuted. Same register, one name.",
  },
  {
    reached: "accent",
    use: "primary",
    why: "--accent is the hover tint --primary casts. tone=\"primary\" with variant=\"soft\" is the colour you were after.",
  },
  {
    reached: "info",
    use: "secondary",
    why: "--info is a status token, spent on messages rather than controls. For a quiet coloured mark, use secondary.",
  },
] as const;

export function ToneAliases() {
  return (
    <ul className="mt-4 grid gap-4 sm:grid-cols-3">
      {ALIASES.map(({ reached, use, why }) => (
        <li
          key={reached}
          // The row is set in the tone it points at, so the replacement is shown as
          // well as named. `--tone-hue` has to be declared to be read.
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
              <Icons.ArrowRight
                aria-hidden
                className="mr-1 inline size-3 align-baseline text-muted-foreground"
              />
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
