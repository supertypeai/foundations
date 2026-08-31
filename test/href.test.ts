import { describe, expect, it } from "vitest";
import { isExternalHref, resolveLink } from "../dist/href.js";

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
   * once because the link sat in a layout.
   */
  it("names the client-boundary stub, which is what a function here means", () => {
    const stub = () => {
      throw new Error("Attempted to call REPO_URL() from the server");
    };
    expect(() => resolveLink(stub as unknown as string)).toThrow(/must be a string/);
    expect(() => resolveLink(stub as unknown as string)).toThrow(/"use client"/);
    expect(() => resolveLink(stub as unknown as string)).toThrow(/REPO_URL/);
  });

  it("prints the value for anything else that is not a string", () => {
    expect(() => resolveLink(undefined as unknown as string)).toThrow(/undefined/);
    expect(() => resolveLink({ pathname: "/x" } as unknown as string)).toThrow(
      /object: \{"pathname":"\/x"\}/,
    );
  });
});
