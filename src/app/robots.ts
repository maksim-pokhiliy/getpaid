import type { MetadataRoute } from "next";

import { SEO } from "@app/shared/config/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/app/", "/api/", "/auth/"],
      },
    ],
    sitemap: `${SEO.SITE_URL}/sitemap.xml`,
  };
}
