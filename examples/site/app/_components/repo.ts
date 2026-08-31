/**
 * The repo this site points at. A plain module because `star.tsx` is a client
 * component: a value exported from one and imported by a server component
 * arrives as a boundary stub, not a string, and the footer's link then hands a
 * function to `href`.
 */
export const REPO_SLUG = "supertypeai/foundations";
export const REPO_URL = `https://github.com/${REPO_SLUG}`;
