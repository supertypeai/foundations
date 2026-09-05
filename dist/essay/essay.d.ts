import type { ComponentProps, ComponentType, ReactNode } from "react";
/**
 * The long-form reading surface: a page read from the top, not scanned.
 * `EssayColumns` sets the measure, `EssayHeader` the opening, `EssayDocument`
 * the whole of a page whose sections are just heading and prose.
 */
/** One entry in the margin index, matching the `id` of the section it points at. */
export type EssayIndexEntry = {
    id: string;
    label: string;
};
/**
 * Motion and gradient belong to an app, not the package. Both default to
 * nothing, so a consumer supplying neither gets the same markup, statically.
 */
export interface EssayDecorations {
    /** `"scale"` is the only variant named, so a narrower union still satisfies it. */
    Reveal?: ComponentType<{
        children: ReactNode;
        className?: string;
        eager?: boolean;
        variant?: "scale";
    }>;
    /** A backdrop behind the header. Rendered before the content, positioned by class. */
    Glow?: ComponentType<{
        className?: string;
        intensity?: number;
    }>;
}
/** One section of a reference document: a heading, and the prose under it. */
export type EssayDocSection = {
    heading: string;
    /** A string is set as one paragraph. Pass a node for anything longer. */
    body: string | ReactNode;
    /** Only when the anchor has to outlive a retitling, since it is a public URL. */
    id?: string;
};
/** One step of a sequence: an ordinal, a title, and the prose under it. */
export type EssayMovement = {
    title: string;
    body: ReactNode;
};
export declare function createEssay({ Reveal, Glow, }?: EssayDecorations): {
    EssayHeader: ({ eyebrow, title, lede, byline, }: {
        eyebrow: ReactNode;
        title: ReactNode;
        /** The standfirst. Optional: a short piece can open on its title alone. */
        lede?: ReactNode;
        /** The signature line under the lede: who wrote it, and who it is written for. */
        byline?: ReactNode;
    }) => import("react").JSX.Element;
    EssayLayout: ({ index, children, }: {
        index: readonly EssayIndexEntry[];
        children: ReactNode;
    }) => import("react").JSX.Element;
    EssaySection: ({ id, heading, children, }: {
        id: string;
        heading: ReactNode;
        children: ReactNode;
    }) => import("react").JSX.Element;
    EssayPullQuote: ({ children }: {
        children: ReactNode;
    }) => import("react").JSX.Element;
    EssayFigure: ({ children, caption, }: {
        children: ReactNode;
        caption: ReactNode;
    }) => import("react").JSX.Element;
    EssayMovements: ({ items }: {
        items: readonly EssayMovement[];
    }) => import("react").JSX.Element;
    EssayDocument: ({ sections, ...header }: ComponentProps<({ eyebrow, title, lede, byline, }: {
        eyebrow: ReactNode;
        title: ReactNode;
        /** The standfirst. Optional: a short piece can open on its title alone. */
        lede?: ReactNode;
        /** The signature line under the lede: who wrote it, and who it is written for. */
        byline?: ReactNode;
    }) => import("react").JSX.Element> & {
        sections: readonly EssayDocSection[];
    }) => import("react").JSX.Element;
};
/**
 * The undecorated shell, bound once, so a consumer without decorations imports
 * these by name. `createEssay` stays for the consumers that do decorate. Module
 * scope is not incidental: the factory defines its components per call, so one
 * made during a render hands React a new type and remounts everything under it.
 */
export declare const EssayHeader: ({ eyebrow, title, lede, byline, }: {
    eyebrow: ReactNode;
    title: ReactNode;
    /** The standfirst. Optional: a short piece can open on its title alone. */
    lede?: ReactNode;
    /** The signature line under the lede: who wrote it, and who it is written for. */
    byline?: ReactNode;
}) => import("react").JSX.Element, EssayLayout: ({ index, children, }: {
    index: readonly EssayIndexEntry[];
    children: ReactNode;
}) => import("react").JSX.Element, EssaySection: ({ id, heading, children, }: {
    id: string;
    heading: ReactNode;
    children: ReactNode;
}) => import("react").JSX.Element, EssayPullQuote: ({ children }: {
    children: ReactNode;
}) => import("react").JSX.Element, EssayFigure: ({ children, caption, }: {
    children: ReactNode;
    caption: ReactNode;
}) => import("react").JSX.Element, EssayMovements: ({ items }: {
    items: readonly EssayMovement[];
}) => import("react").JSX.Element, EssayDocument: ({ sections, ...header }: ComponentProps<({ eyebrow, title, lede, byline, }: {
    eyebrow: ReactNode;
    title: ReactNode;
    /** The standfirst. Optional: a short piece can open on its title alone. */
    lede?: ReactNode;
    /** The signature line under the lede: who wrote it, and who it is written for. */
    byline?: ReactNode;
}) => import("react").JSX.Element> & {
    sections: readonly EssayDocSection[];
}) => import("react").JSX.Element;
