// Informations centrales du site : modifier ici met à jour toutes les pages.

export const site = {
  name: "AFVN Nantes",
  fullName: "Assemblées Fleuve de Vie pour les Nations — Église de Nantes",
  tagline:
    "Une Église où la Parole et l'Esprit s'accordent pour engendrer des porteurs de vie.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://afvn-nantes.vercel.app",
  address: {
    street: "69 bis, rue du Bêle",
    postalCode: "44300",
    city: "Nantes",
    country: "FR",
  },
  phone: { display: "+33 7 67 10 30 45", href: "tel:+33767103045" },
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=69+bis+rue+du+B%C3%AAle+44300+Nantes",
  mapsEmbed: "https://www.google.com/maps?q=69%20bis%20rue%20du%20B%C3%AAle%2044300%20Nantes&output=embed",
  welcomeForm:
    "https://docs.google.com/forms/d/11yv9hO10gIfw47VwN3dkbMTFb-r2MjDc5bxwPiK1Jkk/viewform",
  bookShop: "https://diezmendez.org/boutique",
  socials: {
    youtube: "https://www.youtube.com/@AfvnEgliseDeNantes",
    instagram: "https://www.instagram.com/afvnnantes/",
    facebook: "https://www.facebook.com/people/AFVN-%C3%89glise-de-Nantes/61586115265972/",
  },
} as const;

export const schedule = [
  {
    day: "Vendredi",
    dayOfWeek: "Friday",
    title: "Enseignement & Intercession",
    start: "19:00",
    end: "20:30",
  },
  {
    day: "Dimanche",
    dayOfWeek: "Sunday",
    title: "Grande célébration",
    start: "09:30",
    end: "11:30",
  },
] as const;

export const formatTime = (t: string) => t.replace(":", "h");

export type NavItem = { label: string; href: string; children?: NavItem[] };

export const nav: NavItem[] = [
  {
    label: "À propos",
    href: "/apropos/les-afvn",
    children: [
      { label: "Les AFVN", href: "/apropos/les-afvn" },
      { label: "Le Pasteur local", href: "/apropos/pasteur-local" },
      { label: "La vie de l'église locale", href: "/apropos/vie-eglise-locale" },
    ],
  },
  { label: "Enseignements", href: "/#enseignements" },
  {
    label: "Événements",
    href: "/#evenements",
    children: [
      { label: "ESCHATOS 2026", href: "/medias/eschatos" },
      { label: "Worship Sessions", href: "/medias/worship-sessions" },
      { label: "Conférences", href: "/medias/conferences" },
      { label: "Séminaires", href: "/medias/seminaires" },
    ],
  },
  { label: "Nous rejoindre", href: "/nous-rejoindre" },
  { label: "Contact", href: "/#contact" },
];

export const events = [
  {
    title: "ESCHATOS 2026",
    kicker: "Conférence annuelle",
    description: "L'étude des temps de la fin et des prophéties bibliques.",
    href: "/medias/eschatos",
    image: "/medias/eschatos/photo-6.jpg",
  },
  {
    title: "Worship Sessions",
    kicker: "Louange & adoration",
    description: "Des soirées consacrées à la présence de Dieu.",
    href: "/medias/worship-sessions",
    image: "/medias/worship-sessions/photo-2.jpg",
  },
  {
    title: "Conférences",
    kicker: "Impact • Réveil",
    description: "Des temps forts de révélation et d'activation spirituelle.",
    href: "/medias/conferences",
    image: "/medias/eschatos/photo-3.jpg",
  },
  {
    title: "Séminaires",
    kicker: "Formation",
    description: "Équiper les croyants pour devenir des disciples matures.",
    href: "/medias/seminaires",
    image: "/medias/eschatos/photo-2.jpg",
  },
] as const;

export const featuredVideos = [
  { id: "SqzKK640mww", title: "Worship Session AFVN Nantes — partie 1" },
  { id: "5xg0UTFqTYY", title: "Worship Session AFVN Nantes — partie 2" },
] as const;
