import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

const routes = ["", "/notre-eglise", "/agenda", "/predications", "/priere", "/donner", "/nous-rejoindre", "/medias/eschatos", "/medias/worship-sessions"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((r) => ({
    url: `${site.url}${r}`,
    changeFrequency: r === "" || r === "/agenda" ? "weekly" : "monthly",
    priority: r === "" ? 1 : 0.7,
  }));
}
