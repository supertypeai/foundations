import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * `text-h1`…`text-h4` are this package's rungs and tailwind-merge has never heard
 * of them, so it falls through to `text-color` and deletes whichever colour stands
 * beside one. Measured:
 *
 *   twMerge("text-red-500 text-h3")  →  "text-h3"          // collided
 *   twMerge("text-sm text-h3")       →  "text-sm text-h3"  // did not
 *
 * Which side lost depended on `cva` key order, so it broke both ways at once.
 * `text-2xs` and `text-3xs` match the t-shirt pattern and were never affected,
 * which is why this list is exactly four names long.
 */
const twMerge = extendTailwindMerge({
  extend: { classGroups: { "font-size": [{ text: ["h1", "h2", "h3", "h4"] }] } },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
