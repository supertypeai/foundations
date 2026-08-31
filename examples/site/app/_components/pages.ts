/**
 * Every route's title, description and card line. Read by the page metadata, the
 * home rail, and scripts/og.mjs, which imports this file directly.
 */

export interface PageCopy {
  /** Route slug, no slashes. Also the card's filename under public/og. */
  slug: string;
  /** The <title> before the site name is appended. Also the label in the home rail. */
  title: string;
  /** A shorter label for the header nav, which has room for about two words. */
  nav?: string;
  /** What the social card says, where the page's own headline sells it better than its title. */
  cardTitle?: string;
  description: string;
}

export const HOME = {
  slug: "",
  /** Untemplated: the site name is already inside it. */
  title: "Foundations — React typography and blocks by Supertype",
  /** The card says it shorter: the page's own H1, in place of the search-results title. */
  cardTitle: "Better foundations",
  description:
    "Pre-made shadcn and Tailwind components for semantic, legible interfaces: typography, prose, essay layouts, and design tokens. Open source.",
};

export const PAGES: PageCopy[] = [
  {
    slug: "philosophy",
    title: "Philosophy",
    cardTitle: "The Foundations Philosophy",
    description:
      "What binds the Foundations components together: design principles, code principles, and a test-driven approach to making things with a clear baseline.",
  },
  {
    slug: "recipes",
    title: "Recipes",
    description:
      "Whole pages assembled from the primitives: a marketing hero, a pricing table, a stat panel, a docs page, and a post index.",
  },
  {
    slug: "typography",
    title: "Typography",
    description:
      "The type scale rendered live: headings, body, meta, stats, and links, each specimen shown next to the props that produce it.",
  },
  {
    slug: "blocks",
    title: "Blocks",
    description:
      "Cards, callouts, steps, tabs, accordions, rails, and reading aids, each rendered live beside the code behind it.",
  },
  {
    slug: "tokens",
    title: "Tokens",
    description:
      "The colour and surface tokens under every component, named for meaning, with their contrast pairs in light and dark, plus why a WCAG ratio alone leaves you guessing whether your ink ramp survived the trip to dark.",
  },
  {
    slug: "essay",
    title: "The essay shell",
    nav: "Essay",
    description:
      "The long-form layout: essay headers, pull quotes, figures, columns, and a table of contents wired to a scroll spy.",
  },
  {
    slug: "agents",
    title: "Coding agents",
    nav: "Agents",
    description:
      "One line points a coding agent at llms.txt so it writes Foundations code correctly, plus the ESLint design rules and the doctor CLI.",
  },
];
