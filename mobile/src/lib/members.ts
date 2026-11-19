import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// Modèle d'un membre (document users/{uid}).
export type Role = "member" | "servant" | "intercessor" | "trainer" | "leader" | "admin";
export type Status = "pending" | "active" | "rejected" | "suspended";

export type Member = {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: Status;
  roles: Role[];
  directoryVisible: boolean;
  acceptedTermsAt?: Timestamp;
  createdAt?: Timestamp;
};

export const roleLabels: Record<Role, string> = {
  member: "Membre",
  servant: "Serviteur",
  intercessor: "Intercesseur",
  trainer: "Formateur",
  leader: "Responsable",
  admin: "Administrateur",
};

export const isAdmin = (m?: Member | null) => !!m && m.status === "active" && m.roles.includes("admin");
export const isServant = (m?: Member | null) => !!m && m.status === "active" && m.roles.some((r) => r !== "member");
export const isPrayerTeam = (m?: Member | null) => !!m && m.status === "active" && m.roles.some((r) => r === "intercessor" || r === "leader" || r === "admin");
export const isTrainer = (m?: Member | null) => !!m && m.status === "active" && m.roles.some((r) => r === "trainer" || r === "admin");
export const isLeader = (m?: Member | null) => !!m && m.status === "active" && m.roles.some((r) => r === "leader" || r === "admin");

// Création du profil à l'inscription : toujours « en attente » et simple membre.
// Les règles Firestore refusent toute autre valeur.
export function createProfile(uid: string, data: { firstName: string; lastName: string; email: string; phone?: string }) {
  return setDoc(doc(db, "users", uid), {
    ...data,
    status: "pending",
    roles: ["member"],
    directoryVisible: false,
    acceptedTermsAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  });
}

export function watchProfile(uid: string, cb: (m: Member | null) => void) {
  return onSnapshot(
    doc(db, "users", uid),
    (snap) => cb(snap.exists() ? ({ uid, ...snap.data() } as Member) : null),
    () => cb(null),
  );
}

export const updateOwnProfile = (uid: string, data: Partial<Pick<Member, "firstName" | "lastName" | "phone" | "directoryVisible">>) =>
  updateDoc(doc(db, "users", uid), data);

export const deleteOwnProfile = (uid: string) => deleteDoc(doc(db, "users", uid));

// ——— Administration (réservé aux administrateurs par les règles Firestore) ———
export async function listMembers(status: Status) {
  const q = query(collection(db, "users"), where("status", "==", status), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }) as Member);
}

export const setMemberStatus = (uid: string, status: Status) => updateDoc(doc(db, "users", uid), { status, reviewedAt: serverTimestamp() });
export const setMemberRoles = (uid: string, roles: Role[]) => updateDoc(doc(db, "users", uid), { roles: roles.includes("member") ? roles : ["member", ...roles] });
