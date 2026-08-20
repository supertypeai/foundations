import type { ReactElement } from "react";
/** Open Graph card dimensions. The 1.91:1 ratio every major network crops to. */
export declare const OG_SIZE: {
    readonly width: 1200;
    readonly height: 630;
};
export interface OgCardOptions {
    title: string;
    description?: string;
    /** The site or brand name, set small at the foot of the card. */
    site?: string;
    /** Accent colour for the rule and the site name. Any CSS colour. */
    accent?: string;
    background?: string;
    foreground?: string;
    muted?: string;
}
export declare function ogCard({ title, description, site, accent, background, foreground, muted, }: OgCardOptions): ReactElement;
