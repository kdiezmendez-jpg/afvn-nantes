import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Audience } from "./news";

export type ChurchEvent = {
  id: string;
  title: string;
  description: string;
  location: string;
  startsAt: Timestamp;
  audience: Audience;
  capacity: number | null;
  registrationOpen: boolean;
  registeredCount: number;
};
export type Registration = { uid: string; name: string; guests: number };

const col = collection(db, "events");

// Événements à venir (depuis hier, pour garder ceux du jour).
export function watchEvents(servant: boolean, cb: (e: ChurchEvent[]) => void) {
  const since = Timestamp.fromDate(new Date(Date.now() - 12 * 3600e3));
  const audiences: Audience[] = servant ? ["all", "servants"] : ["all"];
  return onSnapshot(
    query(col, where("audience", "in", audiences), where("startsAt", ">=", since), orderBy("startsAt", "asc")),
    (s) => cb(s.docs.map((d) => ({ id: d.id, ...d.data() }) as ChurchEvent)),
    () => cb([]),
  );
}

export const watchEvent = (id: string, cb: (e: ChurchEvent | null) => void) =>
  onSnapshot(doc(db, "events", id), (d) => cb(d.exists() ? ({ id: d.id, ...d.data() } as ChurchEvent) : null), () => cb(null));

export function createEvent(e: Omit<ChurchEvent, "id" | "registeredCount" | "startsAt"> & { startsAt: Date; createdBy: string }) {
  return addDoc(col, { ...e, startsAt: Timestamp.fromDate(e.startsAt), registeredCount: 0, createdAt: serverTimestamp() });
}
export const setRegistrationOpen = (e: ChurchEvent, open: boolean) =>
  updateDoc(doc(db, "events", e.id), { registrationOpen: open });
export const deleteEvent = (id: string) => deleteDoc(doc(db, "events", id));

export async function myRegistration(eventId: string, uid: string) {
  const d = await getDoc(doc(db, `events/${eventId}/registrations/${uid}`)).catch(() => null);
  return d?.exists() ? (d.data() as Registration) : null;
}
export const register = (eventId: string, uid: string, name: string, guests: number) =>
  setDoc(doc(db, `events/${eventId}/registrations/${uid}`), { uid, name, guests, createdAt: serverTimestamp() });
export const unregister = (eventId: string, uid: string) => deleteDoc(doc(db, `events/${eventId}/registrations/${uid}`));
export async function listRegistrations(eventId: string) {
  const s = await getDocs(collection(db, `events/${eventId}/registrations`));
  return s.docs.map((d) => d.data() as Registration);
}

export const placesLeft = (e: ChurchEvent) => (e.capacity == null ? null : Math.max(0, e.capacity - e.registeredCount));

export const formatEventDate = (t: Timestamp) =>
  new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }).format(t.toDate());

// « 10/01/2027 » + « 09:30 » → Date locale. Renvoie null si la saisie est invalide.
export function parseDateTime(date: string, time: string): Date | null {
  const d = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(date.trim());
  const t = /^(\d{1,2})[:h](\d{2})$/.exec(time.trim());
  if (!d || !t) return null;
  const out = new Date(Number(d[3]), Number(d[2]) - 1, Number(d[1]), Number(t[1]), Number(t[2]));
  return out.getDate() === Number(d[1]) && out.getMonth() === Number(d[2]) - 1 && Number(t[1]) < 24 ? out : null;
}
