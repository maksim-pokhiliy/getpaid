import type { MetadataRoute } from "next";

import { SEO } from "@app/shared/config/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SEO.SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SEO.SITE_URL}/auth/sign-in`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SEO.SITE_URL}/auth/sign-up`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
