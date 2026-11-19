import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
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
import type { Member } from "./members";
import { ministries as defaultMinistries } from "@shared/site";

export type Ministry = { id: string; name: string; description: string };
export type ChatMessage = { id: string; uid: string; name?: string; text: string; createdAt?: Timestamp };
export type Conversation = { id: string; members: string[]; names: Record<string, string>; lastText: string; updatedAt?: Timestamp };

const fullName = (m: Pick<Member, "firstName" | "lastName">) => `${m.firstName} ${m.lastName}`;
const slug = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// ——— Ministères ———
export const watchMinistries = (cb: (m: Ministry[]) => void) =>
  onSnapshot(query(collection(db, "ministries"), orderBy("name")), (s) => cb(s.docs.map((d) => ({ id: d.id, ...d.data() }) as Ministry)), () => cb([]));

// Crée les ministères du site (CESA, Louange…) pour démarrer.
export async function createDefaultMinistries() {
  for (const m of defaultMinistries) {
    await setDoc(doc(db, "ministries", slug(m.title)), { name: m.title, description: m.text, createdAt: serverTimestamp() });
  }
}

export const watchMinistryMembers = (mid: string, cb: (m: { uid: string; name: string }[]) => void) =>
  onSnapshot(collection(db, `ministries/${mid}/members`), (s) => cb(s.docs.map((d) => d.data() as { uid: string; name: string })), () => cb([]));
export const joinMinistry = (mid: string, me: Member) => setDoc(doc(db, `ministries/${mid}/members/${me.uid}`), { uid: me.uid, name: fullName(me), joinedAt: serverTimestamp() });
export const leaveMinistry = (mid: string, uid: string) => deleteDoc(doc(db, `ministries/${mid}/members/${uid}`));

// Écoute avec nouvelles tentatives : juste après avoir rejoint un ministère, le serveur peut encore
// refuser la lecture le temps d'enregistrer l'adhésion.
export function watchGroupMessages(mid: string, cb: (m: ChatMessage[]) => void) {
  let stop = () => {};
  let tries = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const start = () => {
    stop = onSnapshot(
      query(collection(db, `ministries/${mid}/messages`), orderBy("createdAt", "desc"), limit(100)),
      (s) => cb(s.docs.map((d) => ({ id: d.id, ...d.data() }) as ChatMessage).reverse()),
      () => {
        if (tries++ < 6) timer = setTimeout(start, 800 * tries);
        else cb([]);
      },
    );
  };
  start();
  return () => {
    clearTimeout(timer);
    stop();
  };
}
export const sendGroupMessage = (mid: string, me: Member, text: string) =>
  addDoc(collection(db, `ministries/${mid}/messages`), { uid: me.uid, name: fullName(me), text: text.trim(), createdAt: serverTimestamp() });
export const deleteGroupMessage = (mid: string, id: string) => deleteDoc(doc(db, `ministries/${mid}/messages/${id}`));

// ——— Annuaire ———
export async function directory(): Promise<Member[]> {
  const s = await getDocs(query(collection(db, "users"), where("status", "==", "active"), where("directoryVisible", "==", true), orderBy("lastName")));
  return s.docs.map((d) => ({ uid: d.id, ...d.data() }) as Member);
}

// ——— Messagerie privée ———
export const conversationId = (a: string, b: string) => [a, b].sort().join("_");

export async function openConversation(me: Member, other: { uid: string; firstName: string; lastName: string }) {
  const id = conversationId(me.uid, other.uid);
  const ref = doc(db, "conversations", id);
  const existing = await getDoc(ref).catch(() => null);
  if (!existing?.exists()) {
    await setDoc(ref, { members: [me.uid, other.uid].sort(), names: { [me.uid]: fullName(me), [other.uid]: fullName(other) }, lastText: "", updatedAt: serverTimestamp() });
  }
  return id;
}

export const watchConversations = (uid: string, cb: (c: Conversation[]) => void) =>
  onSnapshot(query(collection(db, "conversations"), where("members", "array-contains", uid), orderBy("updatedAt", "desc")), (s) => cb(s.docs.map((d) => ({ id: d.id, ...d.data() }) as Conversation)), () => cb([]));
export const watchConversation = (id: string, cb: (c: Conversation | null) => void) =>
  onSnapshot(doc(db, "conversations", id), (d) => cb(d.exists() ? ({ id: d.id, ...d.data() } as Conversation) : null), () => cb(null));
export const watchPrivateMessages = (cid: string, cb: (m: ChatMessage[]) => void) =>
  onSnapshot(query(collection(db, `conversations/${cid}/messages`), orderBy("createdAt", "desc"), limit(100)), (s) => cb(s.docs.map((d) => ({ id: d.id, ...d.data() }) as ChatMessage).reverse()), () => cb([]));
export async function sendPrivateMessage(cid: string, uid: string, text: string) {
  await addDoc(collection(db, `conversations/${cid}/messages`), { uid, text: text.trim(), createdAt: serverTimestamp() });
  await updateDoc(doc(db, "conversations", cid), { lastText: text.trim().slice(0, 200), updatedAt: serverTimestamp() });
}
export const deletePrivateMessage = (cid: string, id: string) => deleteDoc(doc(db, `conversations/${cid}/messages/${id}`));

// ——— Blocage & signalement ———
export const watchBlocked = (uid: string, cb: (ids: string[]) => void) =>
  onSnapshot(collection(db, `users/${uid}/blocked`), (s) => cb(s.docs.map((d) => d.id)), () => cb([]));
export const blockUser = (uid: string, other: string) => setDoc(doc(db, `users/${uid}/blocked/${other}`), { createdAt: serverTimestamp() });
export const unblockUser = (uid: string, other: string) => deleteDoc(doc(db, `users/${uid}/blocked/${other}`));

export type ReportReason = "offensive" | "harassment" | "spam" | "other";
export const reasonLabels: Record<ReportReason, string> = { offensive: "Propos choquants", harassment: "Harcèlement", spam: "Indésirable", other: "Autre" };
export const reportContent = (reporterUid: string, targetUid: string, targetPath: string, excerpt: string, reason: ReportReason) =>
  addDoc(collection(db, "reports"), { reporterUid, targetUid, targetPath, excerpt: excerpt.slice(0, 300), reason, status: "open", createdAt: serverTimestamp() });

export type Report = { id: string; reporterUid: string; targetUid: string; targetPath: string; excerpt: string; reason: ReportReason; status: string; createdAt?: Timestamp };
export const watchReports = (cb: (r: Report[]) => void) =>
  onSnapshot(query(collection(db, "reports"), where("status", "==", "open"), orderBy("createdAt", "desc")), (s) => cb(s.docs.map((d) => ({ id: d.id, ...d.data() }) as Report)), () => cb([]));
export const closeReport = (id: string) => updateDoc(doc(db, "reports", id), { status: "closed" });
export const deleteReportedContent = (path: string) => deleteDoc(doc(db, path));
