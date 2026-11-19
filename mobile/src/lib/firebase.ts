import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import * as FirebaseAuth from "firebase/auth";
import { connectFirestoreEmulator, initializeFirestore, persistentLocalCache } from "firebase/firestore";
import { Platform } from "react-native";

// Configuration du projet Firebase de l'église (console Firebase → Paramètres du projet → Vos applications).
// Ces valeurs ne sont PAS secrètes : la sécurité repose sur les règles Firestore (firebase/firestore.rules).
const config = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseConfigured = Boolean(config.apiKey && config.projectId);

const app = getApps().length ? getApp() : initializeApp(firebaseConfigured ? config : { apiKey: "demo", projectId: "demo-afvn", appId: "demo" });

// Session conservée sur le téléphone (on reste connecté entre deux ouvertures).
type RNAuth = typeof FirebaseAuth & { getReactNativePersistence?: (s: typeof AsyncStorage) => FirebaseAuth.Persistence };
const rn = FirebaseAuth as RNAuth;
function createAuth() {
  if (Platform.OS === "web" || !rn.getReactNativePersistence) return FirebaseAuth.getAuth(app);
  try {
    return FirebaseAuth.initializeAuth(app, { persistence: rn.getReactNativePersistence(AsyncStorage) });
  } catch {
    return FirebaseAuth.getAuth(app); // déjà initialisé (rechargement à chaud)
  }
}
export const auth = createAuth();
auth.languageCode = "fr";

export const db = initializeFirestore(app, Platform.OS === "web" ? { localCache: persistentLocalCache() } : {});

// Tests locaux uniquement : EXPO_PUBLIC_FIREBASE_EMULATOR=127.0.0.1 branche l'appli sur les émulateurs Firebase.
const emulator = process.env.EXPO_PUBLIC_FIREBASE_EMULATOR;
if (emulator) {
  FirebaseAuth.connectAuthEmulator(auth, `http://${emulator}:9099`, { disableWarnings: true });
  connectFirestoreEmulator(db, emulator, 8080);
}
