import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { isExternalHref, resolveLink } from "../dist/href.js";
// The modules, not the barrel: `blocks/index.js` reaches Card, which reaches a bare
// `next/link` that plain Node cannot resolve. Same reason as tabs-attributes.
import { Anchor } from "../dist/blocks/anchor.js";
import { Badge } from "../dist/blocks/badge.js";
import { Button } from "../dist/blocks/button.js";

describe("isExternalHref", () => {
  it("reads the scheme, not the shape", () => {
    expect(isExternalHref("https://x.dev")).toBe(true);
    expect(isExternalHref("mailto:a@b.c")).toBe(true);
    expect(isExternalHref("/docs")).toBe(false);
    expect(isExternalHref("#section")).toBe(false);
  });
});

describe("resolveLink", () => {
  it("keeps a same-page hash on a plain anchor", () => {
    expect(resolveLink("#install").Component).toBe("a");
  });

  it("opens an http href away, and hands a mailto to the OS in place", () => {
    expect(resolveLink("https://x.dev").props.target).toBe("_blank");
    expect(resolveLink("mailto:a@b.c").props.target).toBeUndefined();
  });

  it("takes the override over the scheme sniff", () => {
    expect(resolveLink("/docs", { external: true }).external).toBe(true);
  });
});

describe("a wrong href says what happened", () => {
  /**
   * The failure this replaces: a constant exported from a `"use client"` module
   * reached a server component as a boundary stub, and the only report was
   * `href.startsWith is not a function` with an empty stack, on every route at
   * once; the link sat in a layout.
   */
  it("names the client-boundary stub, which is what a function here means", () => {
    const stub = () => {
      throw new Error("Attempted to call REPO_URL() from the server");
    };
    expect(() => resolveLink(stub as unknown as string)).toThrow(
      /must be a string/,
    );
    expect(() => resolveLink(stub as unknown as string)).toThrow(
      /"use client"/,
    );
    expect(() => resolveLink(stub as unknown as string)).toThrow(/REPO_URL/);
  });

  it("prints the value for anything else that is not a string", () => {
    expect(() => resolveLink(undefined as unknown as string)).toThrow(
      /undefined/,
    );
    expect(() => resolveLink({ pathname: "/x" } as unknown as string)).toThrow(
      /object: \{"pathname":"\/x"\}/,
    );
  });
});

/**
 * A download is the one link `href` cannot describe on its own: the anchor is
 * right and the routing is not. `linkRules()` flags the `render={<a download />}`
 * that used to say it, so unless the prop exists here the rule forbids the only
 * spelling there was — which is how it reached a consumer, as four type errors on
 * four CSV buttons. Card already took it, off `ComponentProps<"a">`.
 */
describe("a download is a link that is not a navigation", () => {
  it("carries the attribute, and `external` keeps a same-origin export off the router", () => {
    const html = renderToStaticMarkup(
      <Button href="/api/contacts/export" external download />,
    );
    expect(html).toMatch(/^<a /);
    expect(html).toContain('href="/api/contacts/export"');
    expect(html).toContain("download");
    // `Link` steps aside on the click but still prefetches on viewport entry, and
    // running an export to throw the rows away is not a thing a hover should do.
    // Nothing about a relative href says that, so the call site has to.
    expect(html).not.toContain("target=");
  });

  it("reads the same on Badge, which is an anchor here for the same reason", () => {
    const html = renderToStaticMarkup(
      <Badge href="/api/workspace/via-contact" external download />,
    );
    expect(html).toMatch(/^<a /);
    expect(html).toContain("download");
  });
});

/**
 * `Anchor` is the branch with nothing else attached, so what it has to prove is
 * that it attaches nothing: no classes of its own, and `target`/`rel` present or
 * absent strictly because of the href. The call sites it replaced were writing
 * that pair by hand, and the ones that got it wrong got it wrong silently.
 */
describe("Anchor is where the href goes, and nothing else", () => {
  it("opens an off-site href away, with the rel that has to accompany it", () => {
    const html = renderToStaticMarkup(<Anchor href="https://slack.com/x" />);
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it("leaves a same-origin route alone, and keeps `external` off the router", () => {
    expect(renderToStaticMarkup(<Anchor href="/join" />)).not.toContain(
      "target=",
    );
    // The escape hatch: a path that is not a route. A plain anchor, so nothing
    // prefetches it, and still no target — it is not leaving the tab.
    const api = renderToStaticMarkup(
      <Anchor href="/api/slack/install" external />,
    );
    expect(api).toMatch(/^<a /);
    expect(api).not.toContain("target=");
  });

  it("lets a call site keep a rel of its own, since ours cannot know about `author`", () => {
    const html = renderToStaticMarkup(
      <Anchor href="https://a.dev" rel="noopener noreferrer author" />,
    );
    expect(html).toContain('rel="noopener noreferrer author"');
  });
});
