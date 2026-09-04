/**
 * The design rules, as ESLint selectors, shared so the two apps cannot drift.
 * Plain data — esquery matches these against className strings, so no plugin.
 * They see values, never the shape of a class list; a primitive fixes that.
 */
export interface RestrictedSyntax {
    selector: string;
    message: string;
}
interface ColourOptions {
    /** Named in the message: "use a token" without naming one sends people hunting. */
    accents?: string;
}
interface TypographyOptions {
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
     * migrated, and that migration is the intended end state.
     */
    axis?: boolean;
    /** Flag a leading class on a typography primitive. Off by default: an app
     *  adopting it has a backlog to clear first. */
    leading?: boolean;
}
/**
 * Every design rule, as one list.
 *
 * The builders below it are still exported, and spreading them by hand is
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
export {};
