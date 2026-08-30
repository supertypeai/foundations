import { Badge } from "@supertype.ai/foundations/blocks";

/** The same grid as the button demo, and deliberately so: one vocabulary means
 *  one thing to learn, and a badge reads its column and row exactly as a button does. */
const VARIANTS = ["solid", "soft", "outline", "ghost"] as const;
const TONES = [
  "muted",
  "primary",
  "secondary",
  "brand",
  "success",
  "warn",
  "destructive",
] as const;

export default function Badges() {
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
                    <Badge variant={variant} tone={tone}>
                      Queued
                    </Badge>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Badge size="xs">7</Badge>
        <Badge size="xs" variant="soft" tone="destructive">
          3
        </Badge>
        <Badge pill variant="soft" tone="brand">
          A pill
        </Badge>
      </div>
    </div>
  );
}
