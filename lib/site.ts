// ─────────────────────────────────────────────────────────────
// Contenu central du site : modifier ici met à jour toutes les pages.
// ─────────────────────────────────────────────────────────────

export const site = {
  name: "AFVN Nantes",
  fullName: "Les Assemblées Fleuve de Vie pour les Nations — Église de Nantes",
  tagline: "Une Église où la Parole et l'Esprit s'accordent pour engendrer des porteurs de vie.",
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
  // Formulaire d'accueil CESA (nouveaux venus)
  welcomeForm: "https://docs.google.com/forms/d/11yv9hO10gIfw47VwN3dkbMTFb-r2MjDc5bxwPiK1Jkk/viewform",
  // Formulaire confidentiel de demande de prière (Google Form réservé à l'équipe pastorale).
  // Laisser vide tant qu'il n'existe pas : le site propose alors d'appeler.
  prayerForm: "",
  // Lien de don en ligne sécurisé (ex. HelloAsso). Laisser vide tant qu'il n'existe pas.
  donationUrl: "",
  bookShop: "https://diezmendez.org/boutique",
  socials: {
    youtube: "https://www.youtube.com/@AfvnEgliseDeNantes",
    instagram: "https://www.instagram.com/afvnnantes/",
    facebook: "https://www.facebook.com/people/AFVN-%C3%89glise-de-Nantes/61586115265972/",
  },
  liveUrl: "https://www.youtube.com/@AfvnEgliseDeNantes/live",
} as const;

// Annonce affichée en haut de l'accueil. Mettre `null` pour la masquer.
export const announcement: { title: string; text: string; href: string; cta: string } | null = {
  title: "Thème 2026 · Gabaon",
  text: "Posséder les sommets des montagnes — « L'Éternel, ton Dieu, sera avec toi. »",
  href: "/agenda",
  cta: "Voir le programme",
};

// Rendez-vous hebdomadaires (heure de Nantes). Ajouter une ligne = ajout partout.
export const schedule = [
  {
    day: "Dimanche",
    short: "DIM",
    dayOfWeek: "Sunday",
    title: "Culte de célébration",
    detail: "Louange, Parole et communion fraternelle",
    start: "09:30",
    end: "11:30",
    live: true,
  },
  {
    day: "Vendredi",
    short: "VEN",
    dayOfWeek: "Friday",
    title: "Enseignement & intercession",
    detail: "Étude de la Parole et prière pour les familles et les nations",
    start: "19:00",
    end: "20:30",
    live: false,
  },
] as const;

export const formatTime = (t: string) => t.replace(/^0/, "").replace(":", "h");

export type NavItem = { label: string; href: string };

export const nav: NavItem[] = [
  { label: "Accueil", href: "/" },
  { label: "Notre église", href: "/notre-eglise" },
  { label: "Agenda", href: "/agenda" },
  { label: "Prédications", href: "/predications" },
  { label: "Prière", href: "/priere" },
  { label: "Donner", href: "/donner" },
];

export const dna = [
  { title: "Rencontrer", text: "Une présence de Dieu réelle, accessible et transformatrice.", icon: "spark" },
  { title: "Grandir", text: "Une foi enracinée dans la Parole et conduite par l'Esprit.", icon: "diamond" },
  { title: "Rayonner", text: "Des porteurs de vie au service de Nantes et des nations.", icon: "heart" },
] as const;

export const ministries = [
  { title: "CESA", text: "Accueil et accompagnement des nouveaux venus.", icon: "target" },
  { title: "Louange", text: "Servir Dieu par le chant et la musique.", icon: "music" },
  { title: "Jeunesse", text: "Grandir dans la foi et bâtir des amitiés solides.", icon: "spark" },
  { title: "Enfants & familles", text: "Un accueil bienveillant pour chaque génération.", icon: "heart" },
  { title: "Intercession", text: "Porter l'église, les familles et les nations dans la prière.", icon: "diamond" },
  { title: "Communication", text: "Partager la vie et les messages de l'AFVN.", icon: "arrow" },
] as const;

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

// Vidéos YouTube mises en avant (l'identifiant est la fin de l'adresse youtube.com/watch?v=…)
export const featuredVideos = [
  { id: "SqzKK640mww", title: "Worship Session — partie 1", kind: "Louange" },
  { id: "5xg0UTFqTYY", title: "Worship Session — partie 2", kind: "Louange" },
] as const;

export const gallery = [
  { src: "/eglise/photo-1.jpg", alt: "Baptême par immersion" },
  { src: "/eglise/photo-4.jpg", alt: "Moment de partage fraternel" },
  { src: "/eglise/IMG_0282.jpg", alt: "Une fidèle attentive pendant la prédication" },
  { src: "/eglise/photo-5.jpg", alt: "Temps d'adoration" },
  { src: "/eglise/photo-2.jpg", alt: "Une fidèle en prière" },
  { src: "/eglise/IMG_2766.jpg", alt: "Sortie du culte" },
  { src: "/eglise/photo-3.jpg", alt: "Un fidèle pendant le culte" },
] as const;

export const pastorQuote =
  "Nous voulons que chaque personne trouve ici une famille, découvre son appel et devienne porteuse de vie.";

// Questions fréquentes : affichées sur l'accueil et lues par Google (FAQ).
export const faq = [
  {
    q: "Quels sont les horaires des cultes de l'AFVN Nantes ?",
    a: "Le culte de célébration a lieu chaque dimanche de 9h30 à 11h30. Le vendredi, nous nous retrouvons de 19h00 à 20h30 pour un temps d'enseignement et d'intercession.",
  },
  {
    q: "Où se trouve l'église ?",
    a: "L'AFVN Nantes se réunit au 69 bis, rue du Bêle, 44300 Nantes.",
  },
  {
    q: "Faut-il s'inscrire pour venir à un culte ?",
    a: "Non, nos cultes sont ouverts à tous. Si vous le souhaitez, le formulaire d'accueil permet à l'équipe CESA de faire connaissance et de vous accompagner.",
  },
  {
    q: "Peut-on suivre le culte à distance ?",
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
