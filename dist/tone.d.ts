/**
 * One semantic colour vocabulary, for every component that carries meaning in a
 * hue: Button, Callout, TypographyLink. Before this there were three lists —
 * Callout's `muted`, TypographyLink's `foreground` and a button's `default` were
 * three spellings of "no meaning at all", and `accent` named `--accent` on a
 * button and `--primary` in a callout.
 *
 * A component that wants a tone does not get to invent a name for one.
 *
 * Seven tones, seven tokens, one to one. That is the test for admitting a new
 * one: `muted` is `--muted`, `warn` is `--warn`, and a proposed tone with no
 * token of its own is a second name for a tone that already has one. It is what
 * ruled out `neutral` (no such token, and `muted` is the word the rest of the
 * package already uses — `--muted-foreground`, `TypographyMuted`,
 * `TypographyP tone="muted"`), `accent` (that is `--primary`'s hover tint, so a
 * washed `primary` renders the same control), and `info` (a real token, but
 * `success | warn | destructive` is already the complete good/careful/bad
 * triad, and nothing in either app had ever reached for a fourth).
 *
 * The rule the package already applies to every tinted role holds here too, and
 * is why each row names three values rather than one: `--tone-fill` is a surface,
 * `--tone-ink` is the label printed on it, and `--tone-hue` is the same colour
 * used as words. A fill is a mark and clears 3:1; an ink is read and clears
 * 4.5:1. Tuning one value to do both jobs sinks whichever job it was not tuned
 * for. `checkSignals` in /contrast is the test.
 *
 * Custom properties rather than thirty-five class strings: a tone declares, a
 * component spends. `Button` has five variants and `Callout` two densities, and
 * neither has a per-tone branch anywhere in it.
 */
/**
 * `muted` is the only row that names a fourth value. A hairline derived from the
 * ink at 45% is right for a hue and wrong for the absence of one. `--border` is
 * the tuned answer there, in place of a wash of `--foreground`.
 *
 * Its hue is `--foreground` rather than `--muted-foreground` on purpose. `muted`
 * says the control carries no meaning, not that it carries less contrast — a
 * cancel button beside a save button is quiet because it is not filled in, and
 * its label still has to be read.
 *
 * `brand` is the consumer's own identity, and the only row whose token the
 * package does not define. It falls back to `--primary`, so an app that has no
 * identity hue of its own gets its principal one — the tone stays meaningful
 * everywhere rather than rendering nothing in the apps that skipped it.
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
 * What every tone is worth once mixed, derived once here rather than eight times
 * above. Declared before `TONE` in any class list, so `neutral` can override
 * `--tone-line`.
 *
 * Expressed as variables rather than through Tailwind's `/10` modifier because
 * the modifier's support for arbitrary custom properties is a moving target,
 * while `color-mix` is what the modifier compiles to anyway — the same CSS, one
 * layer less of trust.
 *
 * A hover moves the fill 18% toward `--hover-toward`, the extreme theme.css
 * points away from the page: black on latte, white on espresso. The token
 * carries the direction and the percentage carries the state. Mixing toward
 * `--foreground` instead made the step as long as the gap between the fill and
 * the ink, so a `primary` button moved 4.9 ΔL* on latte against 6.2 on espresso
 * and read as no hover at all. Every tone now clears 6 ΔL* in both themes,
 * measured in test/composition.test.ts. A `dark:` override here is what the
 * package's own ESLint rule exists to prevent.
 */
export declare const TONE_SURFACE: string;
/**
 * A tone, as one class list. This is the only thing a component should need.
 *
 * It was two — `cn(TONE_SURFACE, TONE[tone])` — and the order was load-bearing
 * in a way nothing enforced: the derived values have to be declared first so
 * `muted` can override `--tone-line` with `--border`. Getting that backwards
 * gave every quiet control a hairline washed out of its own ink, and the only
 * thing standing between a caller and that bug was a comment. Two arguments
 * whose order matters and whose values always travel together is one argument.
 */
export declare const toneClass: (tone: Tone) => string;
/**
 * The ink a nested element inherits, declared by whatever painted the surface
 * under it. Two properties, one rule: paint a background, hand down its ink.
 *
 * `toneClass` alone is a palette, not a surface — a `Callout` spends the same
 * seven values as a filled `Button` and tints at 5%, so the words inside it
 * still sit on the page and still want the page's ink. Only a component that
 * actually fills promotes `--tone-ink` to the inherited ink, and the type
 * primitives read it with the page as their fallback. A tint that promotes
 * nothing is therefore correct by default, which is the failure this replaces:
 * `TypographyLabel` pinned `text-foreground`, won over the `text-primary-foreground`
 * on the anchor around it, and printed 2.34:1 on a filled button.
 *
 * `--ink-muted` collapses to the ink itself, because a hue fill has no second
 * rung: mixing the ink 20% toward `--primary` measures 4.22:1 on the
 * espresso theme and 3.49:1 at 30%. Nothing on a filled control may be quieter
 * than its label. Wanting two rungs is wanting a tinted surface.
 */
export declare const INK_ON_FILL = "[--ink:var(--tone-ink)] [--ink-muted:var(--tone-ink)]";
/**
 * The same contract for a surface the tones do not name: `--card`, `--popover`,
 * a sidebar. These are tints of the page rather than hues, so both rungs
 * survive and the pair is stated rather than collapsed.
 */
export declare const inkOnSurface: (ink: string, muted?: string) => string;
/**
 * What an unstated tone means, given how much ink the component is spending.
 * Shared, because `Button` and `Badge` both need it and two copies of a default
 * is how two components come to disagree about what saying nothing means.
 *
 * Filling a control in is how a page says *this is the action*, so a filled one
 * with nothing else stated is the principal one; anything less is chrome until a
 * call site says otherwise. Measured, not assumed: 244 of the 246 buttons across
 * both apps that name a variant name `outline` or `ghost`, and every one wants
 * the page's own ink.
 */
export declare const impliedTone: (variant: string | null | undefined) => Tone;
