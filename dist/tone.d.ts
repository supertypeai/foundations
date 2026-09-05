import type { CSSProperties } from "react";
/**
 * One semantic colour vocabulary for every component that carries meaning in a
 * hue. Seven tones, seven tokens, one to one: a proposed tone with no token of
 * its own is a second name for one that already exists. Each row names a fill (a
 * mark, 3:1), an ink (read, 4.5:1) and a hue; `checkSignals` is the test.
 */
/**
 * `muted` names a fourth value: `--border`, since a hairline washed from the ink
 * suits a hue and not the absence of one. Its hue is `--foreground`, because
 * `muted` means no meaning rather than less contrast. `brand` falls back to
 * `--primary` for an app with no identity hue.
 */
export declare const TONE: {
    /** No meaning: chrome, toolbars, anything that must not compete. */
    readonly muted: "[--tone-fill:var(--muted)] [--tone-ink:var(--foreground)] [--tone-hue:var(--foreground)] [--tone-line:var(--border)]";
    /** The principal action, and the package's default wherever a tone is optional. */
    readonly primary: "[--tone-fill:var(--primary)] [--tone-ink:var(--primary-foreground)] [--tone-hue:var(--primary-ink,var(--primary))]";
    /** The warm accent. `--secondary-ink` is its readable cut; the fill is not. */
    readonly secondary: "[--tone-fill:var(--secondary)] [--tone-ink:var(--secondary-foreground)] [--tone-hue:var(--secondary-ink)]";
    /** The consumer's identity hue, if it defined one. Otherwise the principal one. */
    readonly brand: "[--tone-fill:var(--brand,var(--primary))] [--tone-ink:var(--brand-foreground,var(--primary-foreground))] [--tone-hue:var(--brand-ink,var(--primary-ink,var(--primary)))]";
    /** It worked. */
    readonly success: "[--tone-fill:var(--success)] [--tone-ink:var(--success-foreground)] [--tone-hue:var(--success-ink)]";
    /** A footgun: the reader can still proceed, but not blindly. */
    readonly warn: "[--tone-fill:var(--warn)] [--tone-ink:var(--warn-foreground)] [--tone-hue:var(--warn-ink)]";
    /** It deletes something, or it already failed. */
    readonly destructive: "[--tone-fill:var(--destructive)] [--tone-ink:var(--destructive-foreground)] [--tone-hue:var(--destructive)]";
};
export type Tone = keyof typeof TONE;
/**
 * Every tone once mixed, derived here rather than eight times above, and declared
 * before `TONE` so `muted` can override `--tone-line`. Hover moves the fill 18%
 * toward `--hover-toward`, the extreme theme.css points away from the page.
 * Mixing toward `--foreground` instead read as no hover at all on latte.
 */
export declare const TONE_SURFACE: string;
/**
 * A tone, as one class list, and the only thing a component should need. It was
 * two, and the order was load-bearing: the derived values have to be declared
 * first or every quiet control gets a hairline washed out of its own ink.
 */
export declare const toneClass: (tone: Tone) => string;
/**
 * The ink a nested element inherits, declared by whatever painted the surface.
 * Only a component that actually fills promotes `--tone-ink`, so a 5% tint
 * correctly leaves the page's ink alone. `--ink-muted` collapses to the ink
 * itself: nothing on a filled control may be quieter than its label.
 */
export declare const INK_ON_FILL = "[--ink:var(--tone-ink)] [--ink-muted:var(--tone-ink)]";
/**
 * The same contract for a surface the tones do not name. Stated one constant at a
 * time because Tailwind reads this file as text: a class assembled at runtime was
 * never generated, and styles nothing with no error. See `inkOnSurfaceStyle` for
 * a surface the package does not name.
 */
export declare const INK_ON_CARD = "[--ink:var(--card-foreground)] [--ink-muted:var(--muted-foreground)]";
export declare const INK_ON_POPOVER = "[--ink:var(--popover-foreground)] [--ink-muted:var(--muted-foreground)]";
export declare const INK_ON_SIDEBAR = "[--ink:var(--sidebar-foreground)] [--ink-muted:var(--muted-foreground)]";
/**
 * The escape hatch, for an app painting a surface of its own. Properties rather
 * than a class, since a class returned from here would need a scanner that never
 * saw it. It replaces a version that returned a class string and did.
 */
export declare const inkOnSurfaceStyle: (ink: string, muted?: string) => CSSProperties;
/**
 * What an unstated tone means, given how much ink the component spends. Filling a
 * control in is how a page says *this is the action*, so a filled one is the
 * principal one and anything less is chrome. Measured: 244 of 246 buttons that
 * name a variant name `outline` or `ghost`.
 */
export declare const impliedTone: (variant: string | null | undefined) => Tone;
