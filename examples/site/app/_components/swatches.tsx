import { cn, TypographyLabel, TypographyCaption } from "@supertype/foundations";

/**
 * A swatch reads its colour through the token, never a literal — which is the
 * point: flip the theme switch and every square here re-points without this file
 * knowing a single hex value.
 */
function Swatch({ token, on }: { token: string; on?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn("size-9 shrink-0 rounded-md border border-border", on)}
        style={{ backgroundColor: `var(--${token})` }}
      />
      <div className="min-w-0">
        <TypographyLabel as="p" size="xs" className="truncate font-mono">
          --{token}
        </TypographyLabel>
      </div>
    </div>
  );
}

export function SwatchGrid({ tokens, note }: { tokens: readonly string[]; note?: string }) {
  return (
    <div className="mt-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {tokens.map((token) => (
          <Swatch key={token} token={token} />
        ))}
      </div>
      {note ? (
        <TypographyCaption as="p" size="xs" className="mt-4">
          {note}
        </TypographyCaption>
      ) : null}
    </div>
  );
}

/** A role and the ink meant to sit on it — the pairing a token set exists to keep. */
export function PairGrid({ pairs }: { pairs: readonly (readonly [string, string])[] }) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {pairs.map(([bg, fg]) => (
        <div
          key={bg}
          className="rounded-lg border border-border p-4"
          style={{ backgroundColor: `var(--${bg})`, color: `var(--${fg})` }}
        >
          <TypographyLabel as="p" size="xs" className="font-mono">
            --{bg}
          </TypographyLabel>
          <TypographyCaption as="p" size="2xs" className="font-mono opacity-80">
            on --{fg}
          </TypographyCaption>
        </div>
      ))}
    </div>
  );
}
