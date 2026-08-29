"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
/**
 * Reading progress 0→1 from one shared listener: a page mounts both the bar and
 * the rail, and hook-local state would double every subscription. Reads coalesce
 * to a frame, since `scrollHeight` forces layout.
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
    // The server snapshot is 0, an unscrolled document. That is also the client's
    // value on first paint, so the two agree.
    return useSyncExternalStore(subscribe, () => progress, () => 0);
}
/**
 * One IntersectionObserver across all headings, not one each — the observer
 * already reports what changed. Topmost wins when several are on screen.
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
