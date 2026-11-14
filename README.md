# AFVN Nantes — site web & appli

Site de l'Église AFVN de Nantes (Assemblées Fleuve de Vie pour les Nations), construit avec Next.js 16 et Tailwind CSS 4.
Le site est aussi une **appli installable** (PWA) : sur téléphone, « Ajouter à l'écran d'accueil ».

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # vérifie que tout compile
```

## Modifier le contenu

Presque tout se modifie dans **`lib/site.ts`** :

| Quoi | Clé dans `lib/site.ts` |
|---|---|
| Adresse, téléphone, réseaux sociaux | `site` |
| Formulaire d'accueil CESA (et son QR code, généré automatiquement) | `site.welcomeForm` |
| Formulaire de demande de prière (vide = bouton « Appeler ») | `site.prayerForm` |
| Lien de don en ligne, ex. HelloAsso (vide = « Bientôt ») | `site.donationUrl` |
| Annonce à la une de l'accueil (`null` pour la masquer) | `announcement` |
| Rendez-vous hebdomadaires (compte à rebours, agenda, rappel .ics, Google) | `schedule` |
| Ministères, ADN, événements, vidéos, galerie, FAQ, mot du pasteur | `ministries`, `dna`, `events`, `featuredVideos`, `gallery`, `faq`, `pastorQuote` |
| Couleurs et typographies | `app/globals.css` (`@theme`) |

Variable d'environnement à définir en production : `NEXT_PUBLIC_SITE_URL` (ex. `https://www.afvn-nantes.fr`).

## Appli (PWA)

- `app/manifest.ts` : nom, couleurs et icônes de l'appli.
- `public/sw.js` : consultation hors ligne (page `/hors-ligne` en secours). Changer `VERSION` pour forcer la mise à jour du cache.

## Sécurité

- En-têtes HTTP stricts dans `next.config.ts` : CSP, HSTS, anti-clickjacking, Permissions-Policy, pas d'en-tête `X-Powered-By`.
- Vidéos YouTube chargées seulement au clic, via `youtube-nocookie.com`.
- Dependabot (`.github/dependabot.yml`) et CI GitHub Actions (lint, build, `npm audit`).

## Skills Claude Code

`.claude/skills/` contient des skills (Vercel, Expo, Codelynx) utilisés par Claude Code sur ce projet.
