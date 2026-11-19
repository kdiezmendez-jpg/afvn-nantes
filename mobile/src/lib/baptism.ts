import { collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export type BaptismStatus = "requested" | "interview" | "preparation" | "scheduled" | "baptized" | "cancelled";
export type Baptism = {
  uid: string;
  name: string;
  motivation: string;
  status: BaptismStatus;
  steps: string[];
  scheduledAt?: Timestamp | null;
  leaderMessage?: string;
  updatedAt?: Timestamp;
};

export const baptismStatusLabels: Record<BaptismStatus, string> = {
  requested: "Demande envoyée",
  interview: "Entretien",
  preparation: "Préparation",
  scheduled: "Date fixée",
  baptized: "Baptisé(e)",
  cancelled: "Annulée",
};
export const baptismFlow: BaptismStatus[] = ["requested", "interview", "preparation", "scheduled", "baptized"];

// Parcours de préparation (contenu à relire et adapter par le pasteur).
export const preparationSteps = [
  { id: "interview", title: "Entretien avec le pasteur", text: "Un temps d'échange pour parler de votre foi, de votre histoire et de votre démarche." },
  {
    id: "meaning",
    title: "Le sens du baptême",
    text: "Le baptême par immersion est le signe visible de notre union avec Christ dans sa mort et sa résurrection.",
    verse: "« Nous avons donc été ensevelis avec lui par le baptême en sa mort, afin que, comme Christ est ressuscité des morts par la gloire du Père, de même nous aussi nous marchions en nouveauté de vie. » — Romains 6:4",
  },
  {
    id: "new-life",
    title: "La nouvelle vie en Christ",
    text: "Marcher chaque jour avec Dieu : la prière, la Parole, la communion fraternelle et le service.",
    verse: "« Si quelqu'un est en Christ, il est une nouvelle créature. Les choses anciennes sont passées ; voici, toutes choses sont devenues nouvelles. » — 2 Corinthiens 5:17",
  },
  { id: "testimony", title: "Préparer son témoignage", text: "Quelques phrases pour dire, le jour du baptême, ce que Jésus a fait dans votre vie." },
  { id: "ceremony", title: "Le jour du baptême", text: "Tenue de rechange, invités bienvenus : l'église célèbre avec vous !" },
];

export const watchMyBaptism = (uid: string, cb: (b: Baptism | null) => void) =>
  onSnapshot(doc(db, "baptisms", uid), (d) => cb(d.exists() ? (d.data() as Baptism) : null), () => cb(null));

export const requestBaptism = (uid: string, name: string, motivation: string) =>
  setDoc(doc(db, "baptisms", uid), { uid, name, motivation: motivation.trim(), status: "requested", steps: [], createdAt: serverTimestamp(), updatedAt: serverTimestamp() });

export const cancelBaptism = (uid: string) => updateDoc(doc(db, "baptisms", uid), { status: "cancelled", updatedAt: serverTimestamp() });

export const watchAllBaptisms = (cb: (b: Baptism[]) => void) =>
  onSnapshot(query(collection(db, "baptisms"), orderBy("updatedAt", "desc")), (s) => cb(s.docs.map((d) => d.data() as Baptism)), () => cb([]));

export const updateBaptism = (uid: string, patch: Partial<Pick<Baptism, "status" | "steps" | "leaderMessage">> & { scheduledAt?: Date | null }) =>
  updateDoc(doc(db, "baptisms", uid), {
    ...patch,
    ...(patch.scheduledAt !== undefined ? { scheduledAt: patch.scheduledAt ? Timestamp.fromDate(patch.scheduledAt) : null } : {}),
    updatedAt: serverTimestamp(),
  });
