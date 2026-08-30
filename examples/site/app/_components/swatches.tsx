import { cn, TypographyCaption, TypographyLabel } from "@supertype.ai/foundations";
import { tokenCuts } from "@supertype.ai/foundations/contrast";

/**
 * One grid, one axis: a list of token names. How each one is drawn comes from
 * `tokenCuts`, the same taxonomy `checkSignals` measures against in CI.
 *
 * There used to be three components here — a plain grid, a grid for hues in two
 * cuts, and a grid for a fill with a label printed on it — and the page chose
 * between them. Two things went wrong with that, both of them the same thing:
 *
 *   The categorical hues went through the plain grid, because their ink is named
 *   `--ochre-foreground` and looks like a printed label. It is not; it is checked
 *   at 4.5:1 against the page. So `--ochre` rendered as a lone square and the ink
 *   the marker highlight actually paints with was documented nowhere.
 *
 *   The pair grid repainted its own surface and then put a `TypographyCaption`
 *   on it. That preset *is* the secondary ink — `text-muted-foreground` is the
 *   first class in its `cva` — so it won over the inherited colour and the label
 *   came out invisible on `--destructive` in both themes.
 *
 * Neither is fixed by a colour override. The first is fixed by asking the package
 * which cuts a token has instead of guessing from its suffix; the second by
 * keeping every label on the page, where the presets are correct, and printing
 * nothing on a fill but a specimen glyph that carries no preset at all.
 */

/** The one thing that belongs on a fill: proof that its label is legible there. */
function OnFillSpecimen({ label }: { label: string }) {
  return (
    <span
      // Not a Typography primitive. Every one that pins an ink would win over
      // this surface's colour, which is exactly the bug this file used to have.
      className="font-mono text-xs font-medium"
      style={{ color: `var(${label})` }}
    >
      Aa
    </span>
  );
}

function TokenCard({ token }: { token: string }) {
  const { fill, onFill, asInk } = tokenCuts(token);

  return (
    <li className="min-w-0 space-y-1.5">
      <div
        className={cn(
          "grid h-14 place-items-center rounded-md border border-border",
        )}
        style={{ backgroundColor: `var(${fill})` }}
      >
        {onFill ? <OnFillSpecimen label={onFill} /> : null}
      </div>

      <TypographyLabel as="p" size="xs" className="truncate font-mono">
        {fill}
      </TypographyLabel>

      {onFill ? (
        <TypographyCaption as="p" size="2xs" className="truncate font-mono">
          Aa is {onFill}
        </TypographyCaption>
      ) : null}

      {asInk ? (
        // The ink demonstrates itself, on the page, which is the only place it is
        // ever meant to be read.
        <TypographyLabel
          as="p"
          size="xs"
          className="truncate font-mono"
          style={{ color: `var(${asInk})` }}
        >
          {asInk}
        </TypographyLabel>
      ) : null}
    </li>
  );
}

export function TokenGrid({
  tokens,
  note,
}: {
  tokens: readonly string[];
  note?: string;
}) {
  return (
    <div className="mt-4">
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {tokens.map((token) => (
          <TokenCard key={token} token={token} />
        ))}
      </ul>
      {note ? (
        <TypographyCaption as="p" size="xs" className="mt-4">
          {note}
        </TypographyCaption>
      ) : null}
    </div>
  );
}
