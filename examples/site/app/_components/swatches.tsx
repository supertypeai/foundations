import { cn, TypographyCaption, TypographyLabel } from "@supertype.ai/foundations";
import { tokenCuts } from "@supertype.ai/foundations/contrast";

/**
 * One grid, one axis: token names. `tokenCuts` decides how each is drawn, since
 * the suffix lies, and every label stays on the page rather than on a fill.
 */

/** The one thing that belongs on a fill: proof that its label is legible there. */
function OnFillSpecimen({ label }: { label: string }) {
  return (
    <span
      // Plain classes on purpose: a Typography preset pins its own ink, which
      // would win over this surface's colour.
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
