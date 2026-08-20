"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
/**
 * Document reading progress, 0→1, from a single shared listener.
 *
 * `useSyncExternalStore` rather than per-component `useState` because a page
 * typically mounts both the progress bar and the rail. With a hook-local
 * listener that is two scroll subscriptions, two resize subscriptions and two
 * renders per frame; here every consumer reads one store and the browser sees
 * one listener no matter how many components ask.
 *
 * Reads are coalesced to an animation frame: scroll fires far more often than
 * the screen repaints, and `scrollHeight` forces layout, so doing it per event
 * is the expensive part rather than the arithmetic.
 */
let progress = 0;
let frame = 0;
const listeners = new Set();
function measure() {
    frame = 0;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const next = scrollable > 0 ? window.scrollY / scrollable : 0;
    const clamped = Math.min(1, Math.max(0, next));
    if (clamped === progress)
        return;
    progress = clamped;
    listeners.forEach((l) => l());
}
function schedule() {
    if (frame)
        return;
    frame = requestAnimationFrame(measure);
}
function subscribe(listener) {
    if (listeners.size === 0) {
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        measure();
    }
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
        if (listeners.size === 0) {
            window.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", schedule);
            if (frame)
                cancelAnimationFrame(frame);
            frame = 0;
        }
    };
}
export function useReadingProgress() {
    // The server snapshot is 0 — a document that has not been scrolled — which is
    // also the client's value on first paint, so the two agree.
    return useSyncExternalStore(subscribe, () => progress, () => 0);
}
/**
 * The id of the heading the reader is currently in.
 *
 * One IntersectionObserver across every heading rather than one per heading:
 * the observer already reports which entries changed, so a second, third and
 * fourth observer only add bookkeeping. When several headings are on screen the
 * topmost wins, which is what a reader means by "where I am".
 *
 * viably had two near-identical copies of this — one in its table of contents,
 * one in its reading rail — which is what made it worth extracting.
 */
export function useScrollSpy(ids, { rootMargin = "-15% 0px -75% 0px" } = {}) {
    const [active, setActive] = useState("");
    // Depend on the joined ids rather than the array: a caller that maps headings
    // inline passes a new array identity every render, which would tear the
    // observer down and rebuild it on each one.
    const key = ids.join("|");
    useEffect(() => {
        const elements = key
            .split("|")
            .filter(Boolean)
            .map((id) => document.getElementById(id))
            .filter((el) => el !== null);
        if (elements.length === 0)
            return;
        const observer = new IntersectionObserver((entries) => {
            const visible = entries
                .filter((e) => e.isIntersecting)
                .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
            if (visible[0])
                setActive(visible[0].target.id);
        }, { rootMargin });
        elements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [key, rootMargin]);
    return active;
}
