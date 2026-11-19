# Feuille de route — espace membre

Chaque étape est livrée testée (règles de sécurité + parcours complet) avant la suivante.

## ✅ Étape 1 — Comptes et validation (livrée)
- Inscription e-mail + mot de passe, acceptation des conditions, e-mail de vérification.
- Compte **en attente** jusqu'à validation par un responsable ; rôles : Membre, Serviteur, Responsable, Administrateur.
- Écran d'administration : valider / refuser les inscriptions, attribuer les rôles.
- Mon compte : profil, visibilité dans l'annuaire, déconnexion, **suppression du compte**.
- Règles Firestore : 20 tests automatiques (impossible de s'auto-valider, de s'attribuer un rôle, de lire les autres profils…).

## ✅ Étape 2 — Prière & actualités (livrée)
- Demandes de prière privées, visibles par leur auteur et l'**équipe de prière** (nouveau rôle Intercesseur) ; anonymat possible.
- L'équipe indique « je prie » ; l'auteur voit en direct combien de personnes prient et peut témoigner de l'exaucement.
- Fil d'actualités publié par les responsables (épinglage, réservé aux serviteurs ou à tous).
- **Notifications push** (Cloud Functions + Expo Push) : compte validé, nouvelle actualité, nouvelle demande
  (à l'équipe, sans jamais le contenu), « on prie pour vous ». Appareils désinstallés nettoyés automatiquement.
- 46 tests de règles de sécurité + 10 tests de notifications + parcours complet testé dans le navigateur.

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

## Visioconférence : solution retenue (gratuite, sans Zoom ni Meet)
- **Petits groupes (jusqu'à 5–6 personnes)** : appel vidéo direct entre téléphones (WebRTC) dans l'appli ;
  Firebase sert seulement à mettre les participants en relation. Nécessite une version de développement
  (`npx expo run:android` avec Android Studio).
- **Grandes sessions** : direct YouTube « non répertorié » dont le lien n'apparaît que dans l'appli pour les serviteurs,
  avec un fil de questions intégré que le formateur suit en direct.
