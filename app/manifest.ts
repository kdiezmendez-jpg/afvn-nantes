import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "AFVN Nantes — Assemblées Fleuve de Vie pour les Nations",
    short_name: "AFVN Nantes",
    description: "Horaires, prédications, événements et contact de l'Église AFVN de Nantes.",
    lang: "fr",
    start_url: "/?source=app",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#070f22",
    theme_color: "#070f22",
    categories: ["lifestyle", "education", "social"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Horaires & adresse", url: "/#contact" },
      { name: "Prédications", url: "/#enseignements" },
      { name: "Nous rejoindre", url: "/nous-rejoindre" },
    ],
  };
}
