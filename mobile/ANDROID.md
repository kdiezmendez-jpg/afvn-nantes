# Tester l'appli sur Android (Android Studio)

Le dossier `mobile/android` est le projet Android natif de l'appli, prêt à ouvrir dans Android Studio.

## 1. Préparer l'ordinateur (une seule fois)

1. Installer **Node.js 22** : <https://nodejs.org>
2. Installer **Android Studio** : <https://developer.android.com/studio>
   Au premier lancement, laisser l'assistant installer le **SDK Android**, puis dans Settings → Android SDK : **Android API 37** (SDK Platforms) et **Build-Tools 37.0.0** (SDK Tools). Le téléphone doit avoir **Android 7 ou plus récent**.
3. Récupérer le projet et ses dépendances :

```bash
git clone https://github.com/kdiezmendez-jpg/afvn-nantes.git
cd afvn-nantes
git checkout claude/refonte-site-afvn
cd mobile
npm install
```

4. Créer le fichier `mobile/.env` à partir de `mobile/.env.example` et y coller la configuration Firebase
   (voir « Mettre en place Firebase » dans `README.md`).

## 2. Lancer l'appli — méthode la plus simple

Téléphone Android branché en USB (Paramètres → À propos → appuyer 7 fois sur « Numéro de build », puis
Options pour les développeurs → **Débogage USB**), ou émulateur lancé depuis Android Studio (Device Manager) :

```bash
npx expo run:android
```

La commande compile l'appli, l'installe sur le téléphone et démarre le serveur de développement.
Toute modification du code s'affiche aussitôt sur le téléphone.

## 3. Lancer depuis Android Studio

1. Android Studio → **Open** → choisir le dossier `afvn-nantes/mobile/android`.
2. Attendre la fin de la synchronisation Gradle (barre en bas ; la première fois, plusieurs minutes).
3. Dans un terminal, dans `mobile/` : `npx expo start` (serveur de développement — à laisser ouvert).
4. Dans Android Studio : choisir le téléphone ou l'émulateur en haut, puis le bouton **Run ▶**.

## 4. Produire un APK à partager (sans serveur de développement)

```bash
cd mobile/android
./gradlew assembleRelease
```

L'APK est créé dans `mobile/android/app/build/outputs/apk/release/`. Il est signé avec la clé de test :
pour le Play Store, utilisez plutôt `npx eas-cli@latest build --platform android --profile production`
(EAS gère la vraie clé de signature).

## Après une modification de `app.json`

Les réglages natifs (nom, icône, permissions, plugins) viennent de `app.json`. Après l'avoir modifié :

```bash
npx expo prebuild --clean --platform android
```

## En cas de problème

- « SDK location not found » : dans Android Studio → Settings → Android SDK, noter le chemin, puis créer
  `mobile/android/local.properties` contenant `sdk.dir=CHEMIN` (ex. `sdk.dir=C\:\\Users\\VOUS\\AppData\\Local\\Android\\Sdk`).
- Le téléphone n'apparaît pas : vérifier le câble (données, pas seulement charge) et accepter l'autorisation de débogage.
- L'appli affiche « Espace membre en cours d'ouverture » : le fichier `.env` Firebase manque ou est incomplet.
