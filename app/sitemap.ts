import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

const routes = [
  "",
  "/apropos/les-afvn",
  "/apropos/pasteur-local",
  "/apropos/vie-eglise-locale",
  "/nous-rejoindre",
  "/medias/eschatos",
  "/medias/worship-sessions",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((r) => ({
    url: `${site.url}${r}`,
    changeFrequency: r === "" ? "weekly" : "monthly",
    priority: r === "" ? 1 : 0.7,
  }));
}
