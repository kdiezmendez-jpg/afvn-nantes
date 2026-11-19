# Feuille de route — espace membre

Chaque étape est livrée testée (règles de sécurité + parcours complet) avant la suivante.

## ✅ Étape 1 — Comptes et validation (livrée)
- Inscription e-mail + mot de passe, acceptation des conditions, e-mail de vérification.
- Compte **en attente** jusqu'à validation par un responsable ; rôles : Membre, Serviteur, Responsable, Administrateur.
- Écran d'administration : valider / refuser les inscriptions, attribuer les rôles.
- Mon compte : profil, visibilité dans l'annuaire, déconnexion, **suppression du compte**.
- Règles Firestore : 20 tests automatiques (impossible de s'auto-valider, de s'attribuer un rôle, de lire les autres profils…).

## Étape 2 — Prière & actualités
- Demandes de prière privées (visibles par l'équipe de prière seulement), anonymat possible, suivi « on prie pour vous ».
- Fil d'actualités publié par les responsables, avec **notifications push** (Cloud Functions + Expo Push).

## Étape 3 — Événements & baptême
- Inscriptions aux événements (ESCHATOS, séminaires, Worship Sessions), confirmation, rappel.
- **Parcours de baptême** : demande → entretien → préparation (enseignements) → date fixée → baptisé.

## Étape 4 — Formation des serviteurs
- Parcours « Transformation holistique centrée sur la Vérité » : modules et leçons tirés des manuels,
  lecture des manuels (PDF), progression, quiz de validation, attestation.
- **Visioconférence intégrée** pour les sessions de formation (voir le choix technique ci-dessous).

## Étape 5 — Ministères, groupes, annuaire & messagerie
- Rejoindre un ministère, planning de service, discussion de groupe.
- Annuaire des membres (avec leur accord) et messagerie privée.
- Modération exigée par les stores : signaler / bloquer, charte d'échange, suppression des contenus abusifs.

## Visioconférence : options
| Option | Où sont les données | Coût indicatif | Remarques |
|---|---|---|---|
| **Jitsi auto-hébergé** (serveur à Paris, ex. OVH) | Chez l'église | 15–30 €/mois | Libre, « tout chez nous », intégré dans l'appli ; maintenance du serveur |
| LiveKit Cloud | Hébergeur européen | Gratuit au début, puis à l'usage | Très bonne qualité, intégration simple |
| Lien Google Meet / Zoom | Chez Google / Zoom | Gratuit | Ouvre une autre appli, pas « en interne » |
