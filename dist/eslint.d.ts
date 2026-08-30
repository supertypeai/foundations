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
export declare function renamedTokenRules(): RestrictedSyntax[];
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
/**
 * Every design rule, as one list.
 *
 * The five builders below it are still exported, and spreading them by hand is
 * what both consumers were doing — one of them into a flat config, the other
 * into a legacy `.eslintrc`, and *both* of them had quietly left out
 * `renamedTokenRules`, so neither would have flagged a deprecated token name.
 * That is not a mistake either author made; it is what a five-name API costs
 * every time somebody wires it up. Spread this instead, and a rule added here
 * arrives in both apps on their next bump.
 */
export interface DesignRuleOptions extends ColourOptions, TypographyOptions {
    /**
     * Off for a surface that sets its own type ramp — a marketing page under
     * `.editorial`, a mockup drawing the product at reduced scale. Everything
     * about colour still applies: a deprecated token name is wrong on every
     * surface, which is why this is a flag rather than an invitation to pick
     * three of the five builders by hand.
     */
    typography?: boolean;
}
export declare function designRules({ accents, typography, ...type }?: DesignRuleOptions): RestrictedSyntax[];
/** A flat-config entry, described structurally so the package needs no ESLint dependency. */
export interface FlatConfigEntry {
    name: string;
    files: string[];
    rules: Record<string, unknown>;
}
export interface DesignConfigOptions extends DesignRuleOptions {
    /** What the rules apply to. Narrow it to exclude generated or vendored code. */
    files?: string[];
}
/**
 * Every rule in one flat-config entry, ready to spread into eslint.config.js:
 *
 *   import { designConfig } from "@supertype.ai/foundations/eslint";
 *   export default [ ...designConfig({ accents: "the brand tints" }) ];
 *
 * One entry is not a detail. Flat config replaces a rule's options rather than
 * merging them, so two blocks covering overlapping files leave only the last
 * one's rules in effect. Combining them here is what stops a consumer losing
 * half the set by accident. If you need a second scope, call this again with a
 * different `files` and no overlap.
 */
export declare function designConfig({ files, ...options }?: DesignConfigOptions): FlatConfigEntry[];
