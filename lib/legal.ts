// Informations légales. Une valeur vide s'affiche sur le site comme « à compléter »
// (surlignée en jaune) : remplissez-les avant la mise en ligne définitive.

export const legal = {
  // Éditeur du site (l'association qui porte l'église)
  publisherName: "", // ex. « Association Assemblées Fleuve de Vie pour les Nations – Nantes »
  publisherForm: "", // ex. « Association cultuelle loi 1905 » ou « Association loi 1901 »
  rna: "", // numéro RNA (W…) ou SIREN, si l'association en a un
  publicationDirector: "", // ex. « Pasteur Diez Mendez Kambault »
  email: "", // adresse e-mail de contact (droits RGPD, questions)
  // Durée de conservation des réponses au formulaire d'accueil (à valider par l'église)
  welcomeRetention: "3 ans après le dernier contact",
  lastUpdate: "17 novembre 2026",
  host: {
    name: "Vercel Inc.",
    address: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
    url: "https://vercel.com",
  },
} as const;
