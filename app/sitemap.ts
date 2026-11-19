import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Toutes les pages publiques. /hors-ligne est volontairement exclue (page de secours de l'appli).
const routes: [string, number, "weekly" | "monthly" | "yearly"][] = [
  ["", 1, "weekly"],
  ["/nous-rejoindre", 0.9, "monthly"],
  ["/agenda", 0.9, "weekly"],
  ["/notre-eglise", 0.8, "monthly"],
  ["/predications", 0.8, "weekly"],
  ["/priere", 0.7, "monthly"],
  ["/donner", 0.6, "monthly"],
  ["/medias/eschatos", 0.6, "monthly"],
  ["/medias/worship-sessions", 0.6, "monthly"],
  ["/mentions-legales", 0.2, "yearly"],
  ["/confidentialite", 0.2, "yearly"],
  ["/conditions", 0.2, "yearly"],
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-11-17");
  return routes.map(([r, priority, changeFrequency]) => ({ url: `${site.url}${r}`, lastModified, changeFrequency, priority }));
}
