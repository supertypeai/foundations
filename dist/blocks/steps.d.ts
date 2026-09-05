import type { ComponentProps, ReactNode } from "react";
import { type Tone } from "../tone.js";
/**
 * A numbered sequence: an `<ol>`, so a screen reader counts the steps and says
 * how many are left. The digits on the page are a CSS counter rather than
 * markup — reordering renumbers itself, and the numerals stay out of the
 * accessibility tree and out of copied text, since the list already carries the
 * count and hearing it twice is worse than not seeing it once.
 *
 * `tone` inks the numerals and nothing else, the contract `TabsList` and
 * `DisclosureGroup` both state: the rail is a hairline like every other rule in
 * the package, and the copy stays on the page's ink ladder.
 */
export declare function Steps({ className, children, tone, ...props }: ComponentProps<"ol"> & {
    tone?: Tone;
}): import("react").JSX.Element;
/**
 * One step: a numeral, the spine, and the copy, at 0, 28 and 40px.
 *
 * The numeral sits in its own gutter rather than on the rail. Centring it there
 * meant covering the hairline with a plate in the page's colour, which is a
 * component asserting what surface it is on — the one thing `--ink` and
 * `INK_ON_CARD` exist to stop it doing, and a visible chip the moment a step
 * list lands inside a card. Out here the rule runs unbroken and nothing has to
 * know the background. It is also the better setting: right-aligned and
 * `tabular-nums`, so 9 to 10 moves the digits and not the spine.
 *
 * The rail is a pseudo-element rather than a left border, so the last step drops
 * it outright instead of painting it transparent and paying for the pixel.
 *
 * Title and body are the type ladder's own rungs, not two hand-set copies of
 * them: both read `--ink`/`--ink-muted`, so a step list on a card takes the
 * card's ink the way everything else in the package does.
 */
export declare function Step({ title, className, children, ...props }: Omit<ComponentProps<"li">, "title"> & {
    title?: ReactNode;
}): import("react").JSX.Element;
