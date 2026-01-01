import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://robbyj.dev",
      lastModified: new Date(),
    },
    {
      url: "https://robbyj.dev/projects",
      lastModified: new Date(),
    },
    {
      url: "https://robbyj.dev/blog",
      lastModified: new Date(),
    },
    {
      url: "https://robbyj.dev/about",
      lastModified: new Date(),
    },
    {
      url: "https://robbyj.dev/contact",
      lastModified: new Date(),
    },
  ];
}
