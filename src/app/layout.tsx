import type { Metadata } from "next";
import { Outfit } from "next/font/google";

import { SEO } from "@app/shared/config/seo";

import { Providers } from "@app/providers";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SEO.SITE_URL),
  title: {
    default: SEO.TITLE,
    template: `%s | ${SEO.SITE_NAME}`,
  },
  description: SEO.DESCRIPTION,
  openGraph: {
    type: "website",
    locale: SEO.LOCALE,
    url: SEO.SITE_URL,
    siteName: SEO.SITE_NAME,
    title: SEO.TITLE,
    description: SEO.DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.TITLE,
    description: SEO.DESCRIPTION,
    site: SEO.TWITTER_HANDLE,
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={outfit.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
