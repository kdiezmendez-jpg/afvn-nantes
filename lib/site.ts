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
      // Conférences et Séminaires : à rajouter ici quand leurs photos seront en ligne.
      { label: "ESCHATOS 2026", href: "/medias/eschatos" },
      { label: "Worship Sessions", href: "/medias/worship-sessions" },
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
] as const;

export const featuredVideos = [
  { id: "SqzKK640mww", title: "Worship Session AFVN Nantes — partie 1" },
  { id: "5xg0UTFqTYY", title: "Worship Session AFVN Nantes — partie 2" },
] as const;

// Questions fréquentes : affichées sur l'accueil et lues par Google (FAQ).
export const faq = [
  {
    q: "Quels sont les horaires des cultes de l'AFVN Nantes ?",
    a: "La grande célébration a lieu chaque dimanche de 9h30 à 11h30. Le vendredi, nous nous retrouvons de 19h00 à 20h30 pour un temps d'enseignement et d'intercession.",
  },
  {
    q: "Où se trouve l'église ?",
    a: "L'AFVN Nantes se réunit au 69 bis, rue du Bêle, 44300 Nantes.",
  },
  {
    q: "Faut-il s'inscrire pour venir à un culte ?",
    a: "Non, nos cultes sont ouverts à tous. Si vous le souhaitez, le formulaire d'accueil nous permet de faire connaissance et de vous recontacter.",
  },
  {
    q: "Peut-on suivre les prédications à distance ?",
    a: "Oui, nos prédications, enseignements et temps de louange sont publiés sur notre chaîne YouTube « AFVN Église de Nantes ».",
  },
  {
    q: "Que signifie AFVN ?",
    a: "AFVN signifie Assemblées Fleuve de Vie pour les Nations, une vision née en 1988 sous la conduite de l'Apôtre Pamphile Jean Sylvain MAYINGUIDI, présente en République du Congo, en RD Congo et en France.",
  },
  {
    q: "Comment contacter le pasteur ?",
    a: "Vous pouvez joindre l'église au +33 7 67 10 30 45 ou remplir le formulaire d'accueil : le Pasteur Diez Mendez Kambault ou un membre de l'équipe vous répondra.",
  },
] as const;
