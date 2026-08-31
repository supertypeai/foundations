import { Link } from "next-view-transitions";
/**
 * Where a link goes, decided once.
 *
 * This branch — scheme test, router `Link` or plain `<a>`, `rel` on the way out
 * — was written three times: Card, TypographyLink, and (by omission) every call
 * site that reached for `render={<a href="…" />}` because the component it was
 * calling had no `href` of its own. The last of those is the expensive copy: it
 * looks like a styling escape hatch and is actually a routing decision, made at
 * the call site, wrongly. A hero CTA written that way full-page-reloads past the
 * router and drops the view transition, and nothing in the type system says so.
 *
 * So components take `href`, not an anchor. `render` stays for what it is for:
 * an element that is genuinely not an anchor.
 */
/** A scheme (`mailto:`, `https:`) means the href leaves the app entirely. */
export function isExternalHref(href) {
    return /^[a-z][a-z0-9+.-]*:/i.test(href);
}
/**
 * What a wrong `href` is worth saying out loud.
 *
 * A value exported from a `"use client"` module and imported by a server
 * component arrives as a boundary stub — a function that throws when called —
 * rather than the string it is in the client bundle. Passing one here read as
 * `TypeError: href.startsWith is not a function`, which React reported with an
 * empty stack: no component, no file, and every route in the app failing at once
 * because the offending link sat in a layout.
 *
 * The value is the diagnosis, so it goes in the message. `String()` on that stub
 * prints the "Attempted to call X() from the server" text React put there, which
 * names the export and the boundary in one line.
 */
function assertHref(href) {
    if (typeof href === "string")
        return;
    const seen = typeof href === "function"
        ? `a function: ${String(href).replace(/\s+/g, " ").slice(0, 160)}`
        : `${typeof href}: ${JSON.stringify(href)}`;
    throw new TypeError(`href must be a string, and this one is ${seen}. A function here is usually ` +
        `a value exported from a "use client" module and imported by a server ` +
        `component, which crosses the boundary as a stub rather than a string. ` +
        `Move the constant to a plain module and import it from both sides.`);
}
/**
 * A same-page hash is the one internal href that stays a plain anchor: routing
 * `#section` through the router asks for a navigation and a view transition to
 * reach a place the browser can already scroll to.
 */
export function resolveLink(href, { external, newTab } = {}) {
    assertHref(href);
    const leavesApp = external ?? isExternalHref(href);
    const away = leavesApp && (newTab ?? href.startsWith("http"));
    const inPage = !leavesApp && href.startsWith("#");
    return {
        Component: leavesApp || inPage ? "a" : Link,
        props: {
            href,
            ...(away ? { target: "_blank", rel: "noopener noreferrer" } : {}),
        },
        external: leavesApp,
    };
}
