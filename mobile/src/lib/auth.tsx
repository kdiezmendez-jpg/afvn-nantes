import {
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { auth } from "./firebase";
import { createProfile, deleteOwnProfile, watchProfile, type Member } from "./members";

type AuthState = { ready: boolean; user: User | null; member: Member | null };
const Ctx = createContext<AuthState>({ ready: false, user: null, member: null });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ ready: false, user: null, member: null });

  useEffect(() => {
    let stopProfile: (() => void) | undefined;
    const stop = onAuthStateChanged(auth, (user) => {
      stopProfile?.();
      if (!user) return setState({ ready: true, user: null, member: null });
      stopProfile = watchProfile(user.uid, (member) => setState({ ready: true, user, member }));
    });
    return () => {
      stop();
      stopProfile?.();
    };
  }, []);

  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);

// Messages d'erreur Firebase traduits en français clair.
export function authError(e: unknown): string {
  const code = (e as { code?: string })?.code ?? "";
  const map: Record<string, string> = {
    "auth/invalid-email": "L'adresse e-mail n'est pas valide.",
    "auth/missing-password": "Saisissez votre mot de passe.",
    "auth/weak-password": "Le mot de passe doit contenir au moins 8 caractères.",
    "auth/email-already-in-use": "Un compte existe déjà avec cette adresse. Connectez-vous ou réinitialisez votre mot de passe.",
    "auth/invalid-credential": "E-mail ou mot de passe incorrect.",
    "auth/wrong-password": "E-mail ou mot de passe incorrect.",
    "auth/user-not-found": "E-mail ou mot de passe incorrect.",
    "auth/user-disabled": "Ce compte a été désactivé. Contactez l'église.",
    "auth/too-many-requests": "Trop de tentatives. Réessayez dans quelques minutes.",
    "auth/network-request-failed": "Pas de connexion Internet.",
    "auth/requires-recent-login": "Pour votre sécurité, saisissez à nouveau votre mot de passe.",
  };
  return map[code] ?? "Une erreur est survenue. Réessayez.";
}

export async function register(input: { firstName: string; lastName: string; email: string; password: string; phone?: string }) {
  const cred = await createUserWithEmailAndPassword(auth, input.email.trim(), input.password);
  await createProfile(cred.user.uid, {
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email: input.email.trim().toLowerCase(),
    ...(input.phone?.trim() ? { phone: input.phone.trim() } : {}),
  });
  await sendEmailVerification(cred.user).catch(() => {});
}

export const login = (email: string, password: string) => signInWithEmailAndPassword(auth, email.trim(), password);
export const logout = () => signOut(auth);
export const resetPassword = (email: string) => sendPasswordResetEmail(auth, email.trim());
export const resendVerification = () => (auth.currentUser ? sendEmailVerification(auth.currentUser) : Promise.resolve());

// Suppression du compte (obligatoire sur l'App Store) : profil puis identifiants.
export async function deleteAccount(password: string) {
  const user = auth.currentUser;
  if (!user?.email) return;
  await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, password));
  await deleteOwnProfile(user.uid);
  await deleteUser(user);
}
