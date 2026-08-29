import "./global.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Ubuntu_Sans, Ubuntu_Sans_Mono, Average } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import { SiteFooter, SiteHeader } from "./_components/site-header";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_ORIGIN,
  SITE_TITLE,
} from "./_components/seo";
import { INSTALLED_VERSION } from "./_components/version";
import { SurfaceScript } from "./_components/surface";

/**
 * The font binding exactly as the README documents it: `.variable`, never
 * `.className`. A className would set font-family on <html> and leave the roles
 * resolving to their generic tails — one face on the page, another on every
 * `font-sans` and `font-heading` utility.
 */
const sans = Ubuntu_Sans({
  variable: "--font-ubuntu-sans",
  subsets: ["latin"],
});
const mono = Ubuntu_Sans_Mono({
  variable: "--font-ubuntu-sans-mono",
  subsets: ["latin"],
});
const serif = Average({
  variable: "--font-average",
  weight: "400",
  subsets: ["latin"],
});

/**
 * `metadataBase` is what turns every relative canonical and card URL absolute;
 * without it a crawler reads the whole site as unaddressed. The canonicals
 * themselves are set per page: one in here would merge into all of them and
 * declare them duplicates of the homepage.
 *
 * Both titles are templated. The tab gets "Blocks · Foundations"; so does the
 * card, which otherwise falls back to the bare page name once it leaves the
 * site.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: { default: SITE_TITLE, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "React typography",
    "Tailwind CSS",
    "shadcn/ui",
    "design tokens",
    "design system",
    "prose styles",
    "Supertype",
  ],
  authors: [{ name: "Supertype", url: "https://supertype.ai" }],
  creator: "Supertype",
  publisher: "Supertype",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: { default: SITE_TITLE, template: `%s · ${SITE_NAME}` },
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: { default: SITE_TITLE, template: `%s · ${SITE_NAME}` },
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ViewTransitions>
      <html
        lang="en"
        className={`${sans.variable} ${mono.variable} ${serif.variable} font-sans`}
        suppressHydrationWarning
      >
        <head>
          <SurfaceScript />
        </head>
        <body className="bg-background text-foreground antialiased">
          <SiteHeader />

          <main className="w-full pb-24">{children}</main>
          <SiteFooter version={INSTALLED_VERSION} />
        </body>
      </html>
    </ViewTransitions>
  );
}
