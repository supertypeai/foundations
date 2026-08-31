import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  contrast,
  lc,
  parseColor,
  resolveTokens,
  type Rgb,
  type Theme,
} from "@supertype.ai/foundations/contrast";
import {
  cn,
  TypographyCaption,
  TypographyLabel,
  TypographyStat,
} from "@supertype.ai/foundations";

/**
 * Every figure here is measured at build time by the package's own `contrast`,
 * `lc` and `resolveTokens`, off the stylesheet this site installs.
 */

const INSTALLED = join(
  process.cwd(),
  "node_modules/@supertype.ai/foundations/src",
);

const THEME_CSS = ["tokens.css", "theme.css"]
  .map((file) => readFileSync(join(INSTALLED, file), "utf8"))
  .join("\n");

const rgb = (value: string): Rgb => parseColor(value)!;

/** Hand-written, since both polarities belong on the page whichever theme the reader is in. */
const SPECIMENS = [
  { label: "Light", ink: "hsl(30 6% 42%)", ground: "hsl(43 33% 96%)" },
  { label: "Dark", ink: "hsl(40 8% 49%)", ground: "hsl(30 10% 7%)" },
] as const;

/** The three rungs a page reads down, from the palette this site installs. */
const RAMP = [
  { token: "--foreground", role: "Body" },
  { token: "--muted-foreground", role: "Secondary" },
  { token: "--subtle-foreground", role: "Tertiary" },
] as const;

const measureRamp = (theme: Theme) => {
  const tokens = resolveTokens(THEME_CSS, theme);
  const ground = rgb(tokens["--background"]);
  return RAMP.map(({ token, role }) => {
    const ink = rgb(tokens[token]);
    return {
      token,
      role,
      ratio: contrast(ink, ground),
      lightness: lc(ink, ground),
    };
  });
};

const RAMPS = [
  { theme: "light" as const, label: "Light", rungs: measureRamp("light") },
  { theme: "dark" as const, label: "Dark", rungs: measureRamp("dark") },
];

/** Distance between the rungs, which is the thing a ratio hides. */
const steps = (rungs: { lightness: number }[]) =>
  rungs.slice(1).map((rung, i) => rungs[i].lightness - rung.lightness);

const Figures = ({
  ratio,
  lightness,
}: {
  ratio: number;
  lightness: number;
}) => (
  <span className="text-xs tabular-nums">
    <span className="text-muted-foreground">ratio</span> {ratio.toFixed(2)}:1
    <span className="text-muted-foreground"> · Lc</span> {lightness.toFixed(1)}
  </span>
);

/** Two specimens a WCAG ratio scores alike and a reader reads apart. */
export function PolarityPair() {
  const measured = SPECIMENS.map((specimen) => ({
    ...specimen,
    ratio: contrast(rgb(specimen.ink), rgb(specimen.ground)),
    lightness: lc(rgb(specimen.ink), rgb(specimen.ground)),
  }));

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {measured.map(({ label, ink, ground, ratio, lightness }) => (
        <figure
          key={label}
          className="overflow-hidden rounded-lg border border-border"
        >
          <div className="p-5" style={{ background: ground, color: ink }}>
            <p className="text-sm">
              Six weeks after the migration the queue drained on its own, which
              nobody had predicted and nobody could explain.
            </p>
          </div>
          <figcaption className="flex items-baseline justify-between gap-3 border-t border-border px-5 py-3">
            <span className="text-xs font-medium">{label}</span>
            <Figures ratio={ratio} lightness={lightness} />
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/** The installed palette's ink ramp, both themes side by side. */
export function InkRamp() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {RAMPS.map(({ theme, label, rungs }) => (
        <div
          key={theme}
          className="rounded-lg border border-border p-4"
        >
          <div className="flex items-baseline justify-between gap-3">
            <TypographyLabel as="p">{label}</TypographyLabel>
            <TypographyCaption as="p" size="2xs" className="tabular-nums">
              steps of {steps(rungs).map((s) => s.toFixed(0)).join(" and ")} Lc
            </TypographyCaption>
          </div>
          <ul className="mt-3 space-y-3">
            {rungs.map(({ token, role, ratio, lightness }) => (
              <li key={token}>
                <div className="flex items-baseline justify-between gap-3">
                  <TypographyCaption as="p" size="xs" className="font-mono">
                    {role}
                  </TypographyCaption>
                  <Figures ratio={ratio} lightness={lightness} />
                </div>
                <div
                  aria-hidden
                  className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted"
                >
                  <div
                    className="h-full rounded-full bg-foreground/70"
                    style={{ width: `${lightness}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** `pair` is the argument, `ramp` the evidence, `both` stacks them. */
export function ContrastProof({
  show = "pair",
  className,
}: {
  show?: "pair" | "ramp" | "both";
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      {show === "ramp" ? null : <PolarityPair />}
      {show === "pair" ? null : <InkRamp />}
    </div>
  );
}

/** The comparison in three measured figures, for a page that needs the claim first. */
export function ContrastHeadline() {
  const [light, dark] = RAMPS.map((ramp) => ramp.rungs.at(-1)!);

  const CARDS = [
    {
      label: "WCAG ratio, tertiary ink",
      values: [
        { theme: "Light", figure: `${light.ratio.toFixed(2)}:1` },
        { theme: "Dark", figure: `${dark.ratio.toFixed(2)}:1` },
      ],
      note: "The dark theme measures nearly twice the light one.",
    },
    {
      label: "Lc, the same two inks",
      values: [
        { theme: "Light", figure: light.lightness.toFixed(1) },
        { theme: "Dark", figure: dark.lightness.toFixed(1) },
      ],
      note: "Polarity-aware, so it ranks them the other way.",
    },
    {
      label: "Floors held in CI",
      values: [
        { theme: "Read", figure: "4.5:1" },
        { theme: "Marks", figure: "3:1" },
      ],
      note: "Both themes, every release.",
    },
  ];

  return (
    <dl className="grid gap-4 sm:grid-cols-3">
      {CARDS.map(({ label, values, note }) => (
        <div key={label} className="rounded-lg border border-border p-4">
          <div className="flex items-baseline gap-4">
            {values.map(({ theme, figure }) => (
              <div key={theme}>
                <TypographyStat size="card" className="tabular-nums">
                  {figure}
                </TypographyStat>
                <TypographyCaption as="p" size="2xs">
                  {theme}
                </TypographyCaption>
              </div>
            ))}
          </div>
          <dt className="mt-2">
            <TypographyLabel as="span">{label}</TypographyLabel>
          </dt>
          <dd>
            <TypographyCaption as="p" size="xs">
              {note}
            </TypographyCaption>
          </dd>
        </div>
      ))}
    </dl>
  );
}
