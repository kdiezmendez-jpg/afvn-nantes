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

## ✅ Étape 3 — Événements & baptême (livrée)
- Événements créés par les responsables (date, lieu, places, public), inscription avec accompagnants,
  compteur tenu par le serveur, fermeture des inscriptions, liste des inscrits, **rappel la veille à 18h**.
- **Parcours de baptême** : demande → entretien → préparation (5 étapes avec versets) → date fixée → baptisé ;
  les responsables cochent les étapes, fixent la date et laissent un message ; le membre est notifié à chaque étape.
- 69 tests de règles de sécurité + 17 tests des fonctions serveur + parcours complet testé.
- Le contenu des étapes de préparation (`mobile/src/lib/baptism.ts`) est une base à relire par le pasteur.

## ✅ Étape 4 — Formation des serviteurs (livrée)
- Parcours « Transformation Centrée sur la Vérité » (Reconciled World, CC BY-SA 3.0) : module 1 (9 leçons)
  et module 2 (8 leçons ; titres des leçons 1 et 7 à compléter), progression par leçon.
- Nouveau rôle **Formateur** : dépose les PDF depuis le téléphone ; manuels de l'étudiant pour les serviteurs,
  guide de l'enseignant et supports visuels **réservés aux formateurs** (règles Firestore + Storage).
- Sessions programmées (notification aux serviteurs) : **direct YouTube non répertorié** avec fil de questions
  en direct (le formateur marque les questions répondues), et sessions « petit groupe ».
- Tableau de suivi de la progression des serviteurs pour les formateurs.
- 91 tests de règles Firestore, 8 tests de règles Storage (exécutés sur GitHub), 19 tests des fonctions serveur.

## Étape 4 b — Appel vidéo en petit groupe
- Appel vidéo direct entre téléphones (WebRTC, jusqu'à 5–6 personnes), signalisation par Firebase, gratuit.
- Nécessite une version de développement de l'appli (`npx expo run:android`).

## ✅ Étape 5 — Ministères, groupes, annuaire & messagerie (livrée)
- Ministères (créés en un geste à partir de ceux du site), adhésion libre, **discussion de groupe** réservée aux membres.
- **Annuaire** : uniquement les membres qui l'acceptent (désactivé par défaut), recherche par nom.
- **Messagerie privée** : on écrit aux membres visibles dans l'annuaire (les responsables peuvent écrire à tous) ;
  notification au destinataire.
- **Modération** (exigée par l'App Store, règle 1.2, et Google Play) : appui long sur un message → signaler,
  bloquer, supprimer ; écran « Contenus signalés » pour les administrateurs (supprimer, suspendre l'auteur, classer) ;
  un membre bloqué ne peut plus vous écrire ; un membre suspendu perd tout accès.
- 118 tests de règles de sécurité + 24 tests des fonctions serveur + parcours complet testé.

## Visioconférence : solution retenue (gratuite, sans Zoom ni Meet)
- **Petits groupes (jusqu'à 5–6 personnes)** : appel vidéo direct entre téléphones (WebRTC) dans l'appli ;
  Firebase sert seulement à mettre les participants en relation. Nécessite une version de développement
  (`npx expo run:android` avec Android Studio).
- **Grandes sessions** : direct YouTube « non répertorié » dont le lien n'apparaît que dans l'appli pour les serviteurs,
  avec un fil de questions intégré que le formateur suit en direct.
