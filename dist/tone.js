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
export const TONE = {
    /** No meaning: chrome, toolbars, anything that must not compete. */
    muted: "[--tone-fill:var(--muted)] [--tone-ink:var(--foreground)] [--tone-hue:var(--foreground)] [--tone-line:var(--border)]",
    /** The principal action, and the package's default wherever a tone is optional. */
    primary: "[--tone-fill:var(--primary)] [--tone-ink:var(--primary-foreground)] [--tone-hue:var(--primary-ink,var(--primary))]",
    /** The warm accent. `--secondary-ink` is its readable cut; the fill is not. */
    secondary: "[--tone-fill:var(--secondary)] [--tone-ink:var(--secondary-foreground)] [--tone-hue:var(--secondary-ink)]",
    /** The consumer's identity hue, if it defined one. Otherwise the principal one. */
    brand: "[--tone-fill:var(--brand,var(--primary))] [--tone-ink:var(--brand-foreground,var(--primary-foreground))] [--tone-hue:var(--brand-ink,var(--primary-ink,var(--primary)))]",
    /** It worked. */
    success: "[--tone-fill:var(--success)] [--tone-ink:var(--success-foreground)] [--tone-hue:var(--success-ink)]",
    /** A footgun: the reader can still proceed, but not blindly. */
    warn: "[--tone-fill:var(--warn)] [--tone-ink:var(--warn-foreground)] [--tone-hue:var(--warn-ink)]",
    /** It deletes something, or it already failed. */
    destructive: "[--tone-fill:var(--destructive)] [--tone-ink:var(--destructive-foreground)] [--tone-hue:var(--destructive)]",
};
/**
 * Every tone once mixed, derived here rather than eight times above, and declared
 * before `TONE` so `muted` can override `--tone-line`. Hover moves the fill 18%
 * toward `--hover-toward`, the extreme theme.css points away from the page.
 * Mixing toward `--foreground` instead read as no hover at all on latte.
 */
export const TONE_SURFACE = [
    /** A hairline, or a rule carrying the tone. */
    "[--tone-line:color-mix(in_oklab,var(--tone-hue)_45%,transparent)]",
    /** A panel's tint: large area, so barely there. */
    "[--tone-veil:color-mix(in_oklab,var(--tone-hue)_5%,transparent)]",
    /** A control's tint at rest. */
    "[--tone-wash:color-mix(in_oklab,var(--tone-hue)_10%,transparent)]",
    /** The same control under the pointer: twice the tint, so the step reads. */
    "[--tone-wash-hover:color-mix(in_oklab,var(--tone-hue)_20%,transparent)]",
    /** A filled control under the pointer. */
    "[--tone-fill-hover:color-mix(in_oklab,var(--tone-fill),var(--hover-toward)_18%)]",
].join(" ");
/**
 * A tone, as one class list, and the only thing a component should need. It was
 * two, and the order was load-bearing: the derived values have to be declared
 * first or every quiet control gets a hairline washed out of its own ink.
 */
export const toneClass = (tone) => `${TONE_SURFACE} ${TONE[tone]}`;
/**
 * The ink a nested element inherits, declared by whatever painted the surface.
 * Only a component that actually fills promotes `--tone-ink`, so a 5% tint
 * correctly leaves the page's ink alone. `--ink-muted` collapses to the ink
 * itself: nothing on a filled control may be quieter than its label.
 */
export const INK_ON_FILL = "[--ink:var(--tone-ink)] [--ink-muted:var(--tone-ink)]";
/**
 * The same contract for a surface the tones do not name. Stated one constant at a
 * time because Tailwind reads this file as text: a class assembled at runtime was
 * never generated, and styles nothing with no error. See `inkOnSurfaceStyle` for
 * a surface the package does not name.
 */
export const INK_ON_CARD = "[--ink:var(--card-foreground)] [--ink-muted:var(--muted-foreground)]";
export const INK_ON_POPOVER = "[--ink:var(--popover-foreground)] [--ink-muted:var(--muted-foreground)]";
export const INK_ON_SIDEBAR = "[--ink:var(--sidebar-foreground)] [--ink-muted:var(--muted-foreground)]";
/**
 * The escape hatch, for an app painting a surface of its own. Properties rather
 * than a class, since a class returned from here would need a scanner that never
 * saw it. It replaces a version that returned a class string and did.
 */
export const inkOnSurfaceStyle = (ink, muted = "--muted-foreground") => ({ "--ink": `var(${ink})`, "--ink-muted": `var(${muted})` });
/**
 * What an unstated tone means, given how much ink the component spends. Filling a
 * control in is how a page says *this is the action*, so a filled one is the
 * principal one and anything less is chrome. Measured: 244 of 246 buttons that
 * name a variant name `outline` or `ghost`.
 */
export const impliedTone = (variant) => variant == null || variant === "solid" ? "primary" : "muted";
