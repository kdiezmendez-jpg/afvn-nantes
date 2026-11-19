import type { Metadata } from "next";
import { site } from "./site";

// Métadonnées complètes d'une page : titre (< 60 caractères), description (< 155),
// adresse canonique, aperçu Open Graph et carte Twitter (image 1200 × 630).
export function pageMeta({
  title,
  description,
  path,
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}): Metadata {
  const image = { url: "/og-afvn.jpg", width: 1200, height: 630, alt: "AFVN Nantes — Assemblées Fleuve de Vie pour les Nations" };
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      siteName: site.name,
      url: path,
      title,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
