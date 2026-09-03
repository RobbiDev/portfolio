import type { MetadataRoute } from "next"

/** One page, one entry — panels are hash fragments of the same document. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://robbyj.dev",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ]
}
