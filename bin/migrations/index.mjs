import marks from "./marks.mjs";
import roles from "./roles.mjs";

/**
 * Every source migration, oldest first. `upgrade` runs them all: each is a no-op
 * on migrated code, so a second run changes nothing. Retire one a couple of
 * releases after the release it shipped in. `marks` runs before `roles`, since
 * it still reads the 0.3 names.
 */
export const MIGRATIONS = [marks, roles];
