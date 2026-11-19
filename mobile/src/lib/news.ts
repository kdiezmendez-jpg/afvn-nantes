import { addDoc, collection, deleteDoc, doc, limit, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where, type Timestamp } from "firebase/firestore";
import { db } from "./firebase";

export type Audience = "all" | "servants";
export type News = { id: string; title: string; body: string; audience: Audience; pinned: boolean; authorName: string; createdAt?: Timestamp };

const col = collection(db, "news");

// Les membres lisent les actualités « tous » ; les serviteurs voient aussi les leurs.
export function watchNews(servant: boolean, cb: (n: News[]) => void) {
  const audiences: Audience[] = servant ? ["all", "servants"] : ["all"];
  return onSnapshot(
    query(col, where("audience", "in", audiences), orderBy("createdAt", "desc"), limit(50)),
    (s) => {
      const list = s.docs.map((d) => ({ id: d.id, ...d.data() }) as News);
      cb([...list.filter((n) => n.pinned), ...list.filter((n) => !n.pinned)]);
    },
    () => cb([]),
  );
}

export const publishNews = (n: { title: string; body: string; audience: Audience; pinned: boolean; notify: boolean; authorUid: string; authorName: string }) =>
  addDoc(col, { ...n, title: n.title.trim(), body: n.body.trim(), createdAt: serverTimestamp() });

export const setPinned = (id: string, pinned: boolean, n: News) => updateDoc(doc(db, "news", id), { pinned, title: n.title, body: n.body, audience: n.audience });
export const deleteNews = (id: string) => deleteDoc(doc(db, "news", id));

export const formatDate = (t?: Timestamp) =>
  t ? new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }).format(t.toDate()) : "à l'instant";
