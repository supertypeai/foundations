"use client";

import { useEffect, useState } from "react";
import { TypographyLabel } from "@supertype.ai/foundations";
import { PILL } from "./pill";

export const REPO_SLUG = "supertypeai/foundations";
export const REPO_URL = `https://github.com/${REPO_SLUG}`;

const COUNT_KEY = "foundations-stars";

const compact = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

/**
 * One request per page load, not one per button. Both the header and the footer
 * render a star, and the module-level promise is what keeps that from being two
 * calls against an API that allows 60 an hour from an address.
 */
let pending: Promise<number | null> | null = null;

const stars = () =>
  (pending ??= fetch(`https://api.github.com/repos/${REPO_SLUG}`)
    .then((res) => (res.ok ? res.json() : null))
    .then((body) =>
      typeof body?.stargazers_count === "number" ? body.stargazers_count : null,
    )
    .catch(() => null));

/**
 * Link to the repo, with the count when GitHub gives us one. The count is the
 * part that can fail — rate limits, an offline reader, a blocked request — so it
 * renders as an addition to a link that is already complete without it.
 */
export function StarButton({ label = "Star" }: { label?: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    // A cached count from earlier in the session, so a reload has a number to
    // show before the request comes back and never flickers one in.
    try {
      const cached = sessionStorage.getItem(COUNT_KEY);
      if (cached) setCount(Number(cached));
    } catch {
      // sessionStorage throws in a private window. The link still works.
    }

    let live = true;
    stars().then((value) => {
      if (!live || value === null) return;
      setCount(value);
      try {
        sessionStorage.setItem(COUNT_KEY, String(value));
      } catch {
        // As above.
      }
    });
    return () => {
      live = false;
    };
  }, []);

  return (
    <a
      href={REPO_URL}
      target="_blank"
      rel="noreferrer"
      aria-label={`Star ${REPO_SLUG} on GitHub`}
      className={`${PILL} hover:border-primary/40`}
    >
      <svg
        viewBox="0 0 16 16"
        width="12"
        height="12"
        aria-hidden="true"
        fill="currentColor"
      >
        <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
      </svg>
      <TypographyLabel as="span" size="xs" className="leading-none">
        {label}
      </TypographyLabel>
      {count !== null && (
        <TypographyLabel
          as="span"
          size="xs"
          className="leading-none tabular-nums"
        >
          {compact.format(count)}
        </TypographyLabel>
      )}
    </a>
  );
}
