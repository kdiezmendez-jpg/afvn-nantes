import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export type PrayerStatus = "received" | "praying" | "answered";
export type Prayer = {
  id: string;
  uid: string;
  authorName: string | null;
  anonymous: boolean;
  text: string;
  status: PrayerStatus;
  prayedBy: string[];
  testimony?: string;
  createdAt?: Timestamp;
};

export const statusLabels: Record<PrayerStatus, string> = { received: "Reçue", praying: "On prie pour vous", answered: "Exaucée" };
export const teamStatusLabels: Record<PrayerStatus, string> = { received: "Nouvelle", praying: "En prière", answered: "Exaucée" };

const col = collection(db, "prayers");
const map = (s: { docs: { id: string; data: () => object }[] }) => s.docs.map((d) => ({ id: d.id, ...d.data() }) as Prayer);

export function addPrayer(uid: string, authorName: string, text: string, anonymous: boolean) {
  return addDoc(col, {
    uid,
    authorName: anonymous ? null : authorName,
    anonymous,
    text: text.trim(),
    status: "received",
    prayedBy: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export const watchMyPrayers = (uid: string, cb: (p: Prayer[]) => void) =>
  onSnapshot(query(col, where("uid", "==", uid), orderBy("createdAt", "desc")), (s) => cb(map(s)), () => cb([]));

export const watchTeamPrayers = (cb: (p: Prayer[]) => void) =>
  onSnapshot(query(col, orderBy("createdAt", "desc"), limit(100)), (s) => cb(map(s)), () => cb([]));

export const prayFor = (p: Prayer, uid: string) =>
  updateDoc(doc(db, "prayers", p.id), { prayedBy: arrayUnion(uid), status: p.status === "answered" ? "answered" : "praying", updatedAt: serverTimestamp() });

export const markAnswered = (id: string, testimony?: string) =>
  updateDoc(doc(db, "prayers", id), { status: "answered", ...(testimony?.trim() ? { testimony: testimony.trim() } : {}), updatedAt: serverTimestamp() });

export const deletePrayer = (id: string) => deleteDoc(doc(db, "prayers", id));
