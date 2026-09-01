import { Button } from "@supertype.ai/foundations/blocks";

/** Columns are variants, rows are tones: ink spent down, meaning across. */
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
      <table className="border-separate border-spacing-3">
        <thead>
          <tr>
            <th />
            {VARIANTS.map((variant) => (
              <th
                key={variant}
                className="text-left text-xs text-muted-foreground"
              >
                {variant}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TONES.map((tone) => (
            <tr key={tone}>
              <th className="pr-2 text-left text-xs text-muted-foreground">
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

      {/* One ladder, 24px to 40px. `md` is the product default. */}
      <div className="flex flex-wrap items-center gap-3">
        <Button size="xs">xs</Button>
        <Button size="sm">sm</Button>
        <Button size="md">md</Button>
        <Button size="lg">lg</Button>
        <Button size="xl">xl</Button>
      </div>

      {/* `icon` squares whichever rung you are on, leaving one size ladder. */}
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
