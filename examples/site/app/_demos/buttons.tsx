import { Button } from "@supertype.ai/foundations/blocks";

/**
 * The grid is the argument: every column is one variant, every row one tone, and
 * nothing in the package declares a cell. Reading down a column shows how much
 * ink a variant spends; reading across a row shows what the ink means. The tones
 * are the package's, not this component's — Callout and TypographyLink take the
 * same seven.
 */
const VARIANTS = ["solid", "soft", "outline", "ghost", "link"] as const;
const TONES = [
  "muted",
  "primary",
  "secondary",
  "brand",
  "success",
  "warn",
  "destructive",
] as const;

export default function Buttons() {
  return (
    <div className="space-y-8">
      <div className="overflow-x-auto">
        <table className="border-separate border-spacing-3">
          <thead>
            <tr>
              <th />
              {VARIANTS.map((variant) => (
                <th
                  key={variant}
                  className="text-left text-xs font-medium text-muted-foreground"
                >
                  {variant}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TONES.map((tone) => (
              <tr key={tone}>
                <th className="pr-2 text-left text-xs font-medium text-muted-foreground">
                  {tone}
                </th>
                {VARIANTS.map((variant) => (
                  <td key={variant}>
                    <Button variant={variant} tone={tone} size="sm">
                      Deploy
                    </Button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* One ladder, 24px to 40px on a 4px step. `md` is the product default. */}
      <div className="flex flex-wrap items-center gap-3">
        <Button size="xs">xs</Button>
        <Button size="sm">sm</Button>
        <Button size="md">md</Button>
        <Button size="lg">lg</Button>
        <Button size="xl">xl</Button>
      </div>

      {/* `icon` squares whichever rung you are on, rather than forking the ladder. */}
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm" icon variant="ghost" aria-label="Add">
          +
        </Button>
        <Button size="md" icon variant="outline" aria-label="Add">
          +
        </Button>
        <Button size="lg" icon aria-label="Add">
          +
        </Button>
        <Button size="lg" pill>
          A pill, for marketing surfaces
        </Button>
      </div>
    </div>
  );
}
