/**
 * The design rules, as ESLint selectors, shared so the two apps cannot drift.
 * Plain data — esquery matches these against className strings, so no plugin.
 * They see values, never the shape of a class list; a primitive fixes that.
 */
export interface RestrictedSyntax {
    selector: string;
    message: string;
}
export interface ColourOptions {
    /** Named in the message: "use a token" without naming one sends people hunting. */
    accents?: string;
}
/** Applies everywhere, marketing included — the tints exist for those pages. */
export declare function colourRules({ accents, }?: ColourOptions): RestrictedSyntax[];
/**
 * A token already knows what it does in the dark; `dark:` on one says the token
 * is wrong. Only the solid form is restricted — `dark:bg-destructive/20` against
 * a `/10` is the same token at the density a darker ground needs.
 */
export declare function themeOverrideRules(): RestrictedSyntax[];
/**
 * `--muted` is a fill at L92%, so `text-muted` is ~1.1:1 — invisible, and it
 * shipped at 17 sites. `text-background` is absent: inverse ink is a real role.
 */
export declare function surfaceAsInkRules(): RestrictedSyntax[];
export interface TypographyOptions {
    /** Three-weight ramp. Off for editorial, where 700 is a register not a shout. */
    weights?: boolean;
    /** The rungs, named in the message, since they differ per consumer. */
    ramp?: string;
    /**
     * Flag a `ui` paragraph standing over a prose list. Off by default: it is the
     * one rule here that reads shape rather than a value, and a consumer has to
     * have migrated its dense-card lists to `TypographyList variant="ui"` before
     * it can pass. Turn it on once that is done.
     */
    pairing?: boolean;
    /**
     * Flag a size class on a primitive that already owns a size axis. Off by
     * default for the same reason as `pairing`: it fails until the consumer has
     * migrated, and the migration is the point.
     */
    axis?: boolean;
}
export declare function typographyRules({ weights, ramp, pairing, axis, }?: TypographyOptions): RestrictedSyntax[];
