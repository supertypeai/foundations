import marks from "./marks.mjs";
import removals from "./removals.mjs";

/**
 * Every source migration, oldest first. `upgrade` runs them all: each is a no-op
 * on migrated code, so a second run changes nothing. Retire one a couple of
 * releases after the release it shipped in. `marks` runs first, since it still
 * reads the 0.3 names `removals` retires.
 */
export const MIGRATIONS = [marks, removals];
