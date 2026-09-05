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
    /**
     * Flag a literal colour inside a `style` object, which no className rule sees.
     * Off by default: Satori resolves no custom properties, so an OG card states
     * its colours literally. Turn it on for the directories that render for a browser.
     */
    inlineStyle?: boolean;
}
interface TypographyOptions {
    /** Three-weight ramp. Off for editorial, where 700 is a register not a shout. */
    weights?: boolean;
    /** The rungs, named in the message, since they differ per consumer. */
    ramp?: string;
    /** Flag a `ui` paragraph over a prose list. Off until an app has moved its
     *  dense-card lists to `TypographyList variant="ui"`. */
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
 * Every design rule, as one list. Both consumers used to spread the builders by
 * hand and both had quietly left one out, which is what a five-name API costs
 * every time somebody wires it up. A rule added here arrives on the next bump.
 */
export interface DesignRuleOptions extends ColourOptions, TypographyOptions {
    /** Off for a surface that sets its own type ramp. Colour still applies: a
     *  deprecated token name is wrong on every surface. */
    typography?: boolean;
}
export declare function designRules({ accents, inlineStyle, typography, ...type }?: DesignRuleOptions): RestrictedSyntax[];
export {};
