"use client";

import { useEffect, useState } from "react";
import { TypographyLabel } from "@supertype.ai/foundations";
import { PILL } from "./pill";
import { Icons } from "./icons";
import { REPO_SLUG, REPO_URL } from "./repo";

const COUNT_KEY = "foundations-stars";

const compact = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

/**
 * One request per page load: the header and footer stars share this promise,
 * against an API that allows 60 an hour from an address.
 */
let pending: Promise<number | null> | null = null;

const stars = () =>
  (pending ??= fetch(`https://api.github.com/repos/${REPO_SLUG}`)
    .then((res) => (res.ok ? res.json() : null))
    .then((body) =>
      typeof body?.stargazers_count === "number" ? body.stargazers_count : null,
    )
    .catch(() => null));

/** Link to the repo, with the count when GitHub gives us one. */
export function StarButton({ label = "Star" }: { label?: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    // A cached count from earlier in the session, so a reload shows a number
    // before the request comes back, with no flicker.
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
      <Icons.Star aria-hidden className="size-3 fill-current" />
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
