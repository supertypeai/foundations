"use client";

import { useEffect, useState } from "react";
import { TypographyLabel } from "@supertype.ai/foundations";
import { PILL } from "./pill";

/**
 * Toggles `.dark` and `.editorial` on <html>, the two surfaces a static page has
 * to demonstrate live.
 */
const KEYS = {
  dark: "foundations-dark",
  editorial: "foundations-editorial",
} as const;

/** Runs before first paint, so a reload comes back on the surface you left. */
export const SurfaceScript = () => (
  <script
    dangerouslySetInnerHTML={{
      __html: `try{var r=document.documentElement;
if(localStorage.getItem("${KEYS.dark}")==="1")r.classList.add("dark");
if(localStorage.getItem("${KEYS.editorial}")==="1")r.classList.add("editorial");}catch(e){}`,
    }}
  />
);

const useSurfaceClass = (key: keyof typeof KEYS, className: string) => {
  const [on, setOn] = useState(false);

  // SurfaceScript already put the class on <html>; this just reads it back.
  useEffect(
    () => setOn(document.documentElement.classList.contains(className)),
    [className],
  );

  const toggle = () => {
    const next = !document.documentElement.classList.contains(className);
    document.documentElement.classList.toggle(className, next);
    try {
      localStorage.setItem(KEYS[key], next ? "1" : "0");
    } catch {
      // localStorage throws in a private window. The toggle should still work.
    }
    setOn(next);
  };

  return [on, toggle] as const;
};

const Switch = ({
  label,
  on,
  onClick,
}: {
  label: string;
  on: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={on}
    className={`${PILL} aria-pressed:border-primary/40 aria-pressed:bg-primary/10 aria-pressed:text-foreground`}
  >
    <TypographyLabel as="span" size="xs" className="leading-none">
      {label}
    </TypographyLabel>
  </button>
);

export const SurfaceSwitches = () => {
  const [dark, toggleDark] = useSurfaceClass("dark", "dark");
  const [editorial, toggleEditorial] = useSurfaceClass(
    "editorial",
    "editorial",
  );

  return (
    <div className="flex items-center gap-2">
      <Switch label="dark" on={dark} onClick={toggleDark} />
      <Switch label="editorial" on={editorial} onClick={toggleEditorial} />
    </div>
  );
};
