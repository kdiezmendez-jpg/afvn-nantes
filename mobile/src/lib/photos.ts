// Photos embarquées dans l'appli (consultables hors connexion).
export const photos = {
  bapteme: require("@/assets/photos/bapteme.jpg"),
  partage: require("@/assets/photos/partage.jpg"),
  ecoute: require("@/assets/photos/ecoute.jpg"),
  adoration: require("@/assets/photos/adoration.jpg"),
  priere: require("@/assets/photos/priere.jpg"),
  sortie: require("@/assets/photos/sortie.jpg"),
  culte: require("@/assets/photos/culte.jpg"),
  eschatos: require("@/assets/photos/eschatos.jpg"),
  eschatos1: require("@/assets/photos/eschatos-1.jpg"),
  eschatos2: require("@/assets/photos/eschatos-2.jpg"),
  eschatos3: require("@/assets/photos/eschatos-3.jpg"),
  eschatos4: require("@/assets/photos/eschatos-4.jpg"),
  eschatos5: require("@/assets/photos/eschatos-5.jpg"),
  worship: require("@/assets/photos/worship.jpg"),
  worship2: require("@/assets/photos/worship-2.jpg"),
  pasteur: require("@/assets/photos/pasteur.jpg"),
  visionnaires: require("@/assets/photos/visionnaires.jpg"),
  theme2026: require("@/assets/photos/theme-2026.jpg"),
  emblem: require("@/assets/images/emblem.png"),
} as const;

export const galleryPhotos = [
  { src: photos.bapteme, alt: "Baptême par immersion" },
  { src: photos.partage, alt: "Moment de partage fraternel" },
  { src: photos.ecoute, alt: "Une fidèle attentive pendant la prédication" },
  { src: photos.adoration, alt: "Temps d'adoration" },
  { src: photos.priere, alt: "Une fidèle en prière" },
  { src: photos.sortie, alt: "Sortie du culte" },
  { src: photos.culte, alt: "Un fidèle pendant le culte" },
];
