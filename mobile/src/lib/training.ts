import {
  addDoc,
  collection,
  collectionGroup,
  deleteDoc,
  doc,
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
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { db } from "./firebase";

// Programme « Transformation Centrée sur la Vérité » (Reconciled World, licence CC BY-SA 3.0).
// Les titres des leçons viennent des manuels (module 2 : titres des leçons 1 et 7 à compléter, absents du
// manuel de l'étudiant). Ajouter un module = ajouter une entrée ici.
export const course = {
  title: "Transformation Centrée sur la Vérité",
  subtitle: "Formation holistique des serviteurs",
  attribution:
    "Copyright © 2017. Publié par Reconciled World (www.reconciledworld.org) sous les termes de la licence Creative Commons Attribution – ShareAlike 3.0. Usage non commercial.",
  modules: [
    {
      id: "m1",
      title: "Introduction au ministère holistique",
      lessons: [
        "Toute l'histoire",
        "Les êtres humains sont importants pour Dieu",
        "Aimer Dieu et aimer son prochain",
        "Croître dans tous les domaines",
        "Dieu veut que l'église soit disposée à aider",
        "Les besoins auxquels nous pouvons répondre",
        "Les mathématiques du royaume",
        "Les actes d'amour",
        "Planification des actes d'amour",
      ],
    },
    {
      id: "m2",
      title: "Le Royaume de Dieu",
      lessons: [
        "Leçon 1",
        "Tableau de la valeur du Royaume",
        "Interprétation biblique de la problématique du travail",
        "Le Royaume sur la Terre",
        "Impact d'une famille",
        "La sagesse et la multiplication opérées par Dieu",
        "Leçon 7",
        "Les étapes de planification des actions d'amour",
      ],
    },
  ],
} as const;

export type TrainingModule = (typeof course.modules)[number];
export const lessonId = (moduleId: string, i: number) => `${moduleId}-l${i + 1}`;
export const moduleById = (id: string) => course.modules.find((m) => m.id === id);

// ——— Progression ———
export const watchProgress = (uid: string, moduleId: string, cb: (lessons: string[]) => void) =>
  onSnapshot(doc(db, `users/${uid}/progress/${moduleId}`), (d) => cb((d.data()?.lessons as string[]) ?? []), () => cb([]));

export const saveProgress = (uid: string, name: string, moduleId: string, lessons: string[]) =>
  setDoc(doc(db, `users/${uid}/progress/${moduleId}`), { lessons, name, updatedAt: serverTimestamp() });

export type ProgressRow = { uid: string; moduleId: string; name: string; lessons: string[] };
export async function allProgress(): Promise<ProgressRow[]> {
  const s = await getDocs(collectionGroup(db, "progress"));
  return s.docs.map((d) => ({ uid: d.ref.parent.parent!.id, moduleId: d.id, ...(d.data() as { name: string; lessons: string[] }) }));
}

// ——— Manuels (PDF dans Firebase Storage) ———
export type FileKind = "student" | "trainer";
export type TrainingFile = { id: string; moduleId: string; kind: FileKind; name: string; path: string; size: number };

export function watchFiles(moduleId: string, trainer: boolean, cb: (f: TrainingFile[]) => void) {
  const base = collection(db, "trainingFiles");
  const q = trainer ? query(base, where("moduleId", "==", moduleId)) : query(base, where("moduleId", "==", moduleId), where("kind", "==", "student"));
  return onSnapshot(q, (s) => cb(s.docs.map((d) => ({ id: d.id, ...d.data() }) as TrainingFile)), () => cb([]));
}

export async function uploadFile(moduleId: string, kind: FileKind, name: string, uri: string, uid: string) {
  const meta = doc(collection(db, "trainingFiles"));
  const path = `training/${moduleId}/${kind}/${meta.id}.pdf`;
  const blob = await (await fetch(uri)).blob();
  await uploadBytes(ref(getStorage(), path), blob, { contentType: "application/pdf" });
  await setDoc(meta, { moduleId, kind, name: name.slice(0, 200), path, size: blob.size, uploadedBy: uid, createdAt: serverTimestamp() });
}

export const fileUrl = (f: TrainingFile) => getDownloadURL(ref(getStorage(), f.path));
export async function deleteFile(f: TrainingFile) {
  await deleteObject(ref(getStorage(), f.path)).catch(() => {});
  await deleteDoc(doc(db, "trainingFiles", f.id));
}

// ——— Sessions et questions ———
export type SessionKind = "live" | "group";
export type TrainingSession = { id: string; moduleId: string; title: string; startsAt: Timestamp; kind: SessionKind; youtubeUrl: string | null };
export type Question = { id: string; uid: string; name: string; text: string; answered: boolean; createdAt?: Timestamp };

export function watchSessions(cb: (s: TrainingSession[]) => void) {
  const since = Timestamp.fromDate(new Date(Date.now() - 3 * 3600e3));
  return onSnapshot(
    query(collection(db, "trainingSessions"), where("startsAt", ">=", since), orderBy("startsAt", "asc")),
    (s) => cb(s.docs.map((d) => ({ id: d.id, ...d.data() }) as TrainingSession)),
    () => cb([]),
  );
}
export const watchSession = (id: string, cb: (s: TrainingSession | null) => void) =>
  onSnapshot(doc(db, "trainingSessions", id), (d) => cb(d.exists() ? ({ id: d.id, ...d.data() } as TrainingSession) : null), () => cb(null));

export const createSession = (s: { moduleId: string; title: string; startsAt: Date; kind: SessionKind; youtubeUrl: string | null; createdBy: string }) =>
  addDoc(collection(db, "trainingSessions"), { ...s, startsAt: Timestamp.fromDate(s.startsAt), createdAt: serverTimestamp() });
export const setSessionLink = (id: string, youtubeUrl: string | null) => updateDoc(doc(db, "trainingSessions", id), { youtubeUrl });

export const watchQuestions = (sessionId: string, cb: (q: Question[]) => void) =>
  onSnapshot(query(collection(db, `trainingSessions/${sessionId}/questions`), orderBy("createdAt", "asc")), (s) => cb(s.docs.map((d) => ({ id: d.id, ...d.data() }) as Question)), () => cb([]));
export const askQuestion = (sessionId: string, uid: string, name: string, text: string) =>
  addDoc(collection(db, `trainingSessions/${sessionId}/questions`), { uid, name, text: text.trim(), answered: false, createdAt: serverTimestamp() });
export const markAnsweredQ = (sessionId: string, qid: string, answered: boolean) => updateDoc(doc(db, `trainingSessions/${sessionId}/questions/${qid}`), { answered });
export const deleteQuestion = (sessionId: string, qid: string) => deleteDoc(doc(db, `trainingSessions/${sessionId}/questions/${qid}`));

export const isYouTubeUrl = (u: string) => /^https:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/.test(u.trim());
