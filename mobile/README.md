# Application AFVN Nantes (iPhone & Android)

Application Expo (SDK 58, React Native) de l'Église AFVN de Nantes.
Elle partage ses données publiques avec le site (`../lib/site.ts`, `../lib/schedule.ts`) :
modifier un horaire ou un texte là-bas met à jour le site **et** l'application.

## Ce que fait l'application

| Onglet | Contenu |
|---|---|
| Accueil | Compte à rebours du prochain culte, accès rapides, annonce, ADN, mot du pasteur |
| Agenda | Horaires, prochains rendez-vous calculés automatiquement, temps forts |
| Live | Direct YouTube, derniers messages, réseaux sociaux |
| Espace | **Espace membre** : inscription, validation, prières, actualités, équipe de prière, administration |
| Église | Histoire, visionnaires, pasteur, ministères, galerie, dons |

Rappels de culte : notifications **locales** (aucun serveur), 30 min avant chaque culte choisi.

## Démarrer en local

```bash
cd mobile
npm install
cp .env.example .env   # puis remplir avec la configuration Firebase
npx expo start         # scanner le QR code avec l'appli Expo Go
```

Vérifications : `npm run typecheck` et `npm run lint`.

## Mettre en place Firebase (une seule fois)

1. Sur <https://console.firebase.google.com>, créer le projet « afvn-nantes ».
2. **Authentication** → Méthode de connexion → activer **Adresse e-mail/Mot de passe**.
   Dans Paramètres → Règles de mot de passe : minimum 8 caractères.
3. **Firestore Database** → Créer → mode **production** → emplacement **europe-west9 (Paris)**.
4. Paramètres du projet → Vos applications → ajouter une **application Web** → copier la configuration dans `mobile/.env`.
5. Déployer les règles de sécurité : `cd firebase && npm install && npx firebase login && npx firebase use --add && npm run deploy:rules`.
6. **Premier administrateur** : créer votre compte depuis l'application, puis dans Firestore → `users` → votre document,
   mettre `status` = `active` et `roles` = `["member", "admin"]`. Ensuite, tout se gère depuis l'application
   (Espace → Gérer les membres).

7. **Notifications push** (étape 2) :
   - passer le projet Firebase au forfait **Blaze** (paiement à l'usage, nécessaire pour les Cloud Functions).
     Pour une église, l'usage reste dans la **part gratuite** (2 millions d'appels par mois) : coût attendu 0 €.
     Fixez une alerte budgétaire à 1 € dans Google Cloud pour être prévenu au moindre centime.
   - déployer les fonctions : `cd firebase/functions && npm install && cd .. && npm run deploy:functions`.
   - lier l'appli à Expo (`npx eas-cli@latest init`), puis donner à EAS les accès d'envoi :
     Android → fichier de compte de service FCM (`eas credentials`), iOS → clé APNs créée automatiquement par EAS.

Tests (Java requis) : `cd firebase && npm run test:rules` (91 tests de sécurité), `npm run test:storage` (8 tests des fichiers) et `npm run test:functions` (19 tests des fonctions serveur).

**Stockage des manuels** : dans la console Firebase, activer **Storage** (emplacement europe-west9), puis `npm run deploy:rules` déploie aussi les règles des fichiers. Les formateurs déposent ensuite les PDF depuis l'appli (Formation → module → « Ajouter un PDF »).

## Publier sur l'App Store et Google Play

Comptes nécessaires : Expo (gratuit), Apple Developer (99 $/an), Google Play Console (25 $ une fois).

```bash
npx eas-cli@latest login
npx eas-cli@latest init                 # relie le projet à votre compte Expo
npx eas-cli@latest env:create           # ajouter les variables EXPO_PUBLIC_FIREBASE_* (environnement production)
npx eas-cli@latest build --platform all --profile production
npx eas-cli@latest submit --platform ios
npx eas-cli@latest submit --platform android
```

Identifiants de l'application : `fr.afvn.nantes` (iOS et Android).

### Fiches des stores — réponses prêtes

- **Catégorie** : Style de vie (iOS) / Style de vie (Android).
- **Confidentialité (App Store)** : données collectées = nom, e-mail, téléphone (facultatif), liées à l'identité,
  pour la *fonctionnalité de l'app* ; aucun suivi publicitaire.
- **Sécurité des données (Play)** : mêmes données, chiffrées en transit, suppression possible depuis l'app.
- **Suppression de compte** : Espace → Mon compte → Supprimer mon compte (exigé par Apple et Google).
- **Compte de démonstration** pour la revue Apple : créer un membre validé et le fournir dans App Store Connect.
- **Dons** : ouverts dans Safari/Chrome via la plateforme de don (règle 3.2.2 de l'App Store), jamais en achat intégré.

## Feuille de route de l'espace membre

Voir [`ROADMAP.md`](./ROADMAP.md).
