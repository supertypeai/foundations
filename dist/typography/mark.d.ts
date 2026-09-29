import { type ComponentProps, type ReactElement, type ReactNode } from "react";
import type { WithAs } from "./as.js";
/** Whether a mark was given: `cond && <Icon />` passes `false` when there is none. */
export declare const shown: (mark: ReactNode) => mark is string | number | bigint | true | ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | Iterable<ReactNode> | import("react").ReactPortal | Promise<string | number | bigint | boolean | import("react").ReactPortal | ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined>;
/**
 * The slot on its own, for a glyph inside a run of words: mid-sentence, in a code
 * line, in a menu item's label. It reads the words around it, so it goes inside
 * the element that sets their size. Before words a text role owns, use `mark`.
 */
export declare function Mark({ className, ...props }: ComponentProps<"span">): import("react").JSX.Element;
/**
 * A marked title and the lines under it, in one column of words. The title is a
 * text role, whose own `mark` this sets, so the mark reads the title's size. It
 * spans both columns as a subgrid, so the lines under it start where its words
 * do. Without a mark it is a plain stack.
 */
export declare function Marked({ mark, title, as, className, children, ...props }: Omit<ComponentProps<"div">, "title"> & {
    mark?: ReactNode;
    /** A text role: `TypographyLabel`, `CardTitle` and the rest. */
    title: ReactElement<Pick<WithAs, "className" | "mark">>;
    as?: "div" | "li";
}): import("react").JSX.Element;
