import { addDoc, collection, deleteDoc, doc, onSnapshot, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { db } from "./firebase";
import { mediaDevices, RTCIceCandidate, RTCPeerConnection, RTCSessionDescription } from "./rtc";

// Appel vidéo en petit groupe, sans serveur vidéo : chaque téléphone se connecte directement aux autres
// (maillage pair-à-pair). Firebase sert uniquement à échanger les informations de connexion.
export const MAX_PARTICIPANTS = 6;
const STALE_MS = 45_000;

const iceServers: { urls: string | string[]; username?: string; credential?: string }[] = [{ urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] }];
// Relais facultatif pour les réseaux très fermés (offres gratuites possibles), via les variables d'environnement.
if (process.env.EXPO_PUBLIC_TURN_URL) {
  iceServers.push({ urls: process.env.EXPO_PUBLIC_TURN_URL, username: process.env.EXPO_PUBLIC_TURN_USERNAME, credential: process.env.EXPO_PUBLIC_TURN_CREDENTIAL });
}

type Peer = { pc: any; pending: any[]; remoteSet: boolean };
export type Remote = { uid: string; name: string; stream: any | null; state: string };
type Participant = { uid: string; name: string; updatedAt?: { toMillis: () => number } };

export function useGroupCall(sessionId: string, me: { uid: string; name: string }) {
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState<string>();
  const [local, setLocal] = useState<any>(null);
  const [remotes, setRemotes] = useState<Record<string, Remote>>({});
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const peers = useRef(new Map<string, Peer>());
  const localRef = useRef<any>(null);
  const names = useRef(new Map<string, string>());

  const base = `trainingSessions/${sessionId}`;
  const send = useCallback(
    (to: string, type: "offer" | "answer" | "candidate", payload: unknown) =>
      addDoc(collection(db, `${base}/signals`), { from: me.uid, to, type, payload: JSON.stringify(payload), createdAt: serverTimestamp() }).catch(() => {}),
    [base, me.uid],
  );

  const patchRemote = (uid: string, p: Partial<Remote>) =>
    setRemotes((r) => ({ ...r, [uid]: { ...(r[uid] ?? { uid, name: names.current.get(uid) ?? "", stream: null, state: "new" }), ...p } }));

  const closePeer = (uid: string) => {
    peers.current.get(uid)?.pc.close();
    peers.current.delete(uid);
    setRemotes((r) => {
      const { [uid]: _gone, ...rest } = r;
      return rest;
    });
  };

  const peerFor = useCallback(
    (uid: string): Peer => {
      const existing = peers.current.get(uid);
      if (existing) return existing;
      const pc = new RTCPeerConnection({ iceServers });
      const peer: Peer = { pc, pending: [], remoteSet: false };
      peers.current.set(uid, peer);
      localRef.current?.getTracks().forEach((t: any) => pc.addTrack(t, localRef.current));
      pc.onicecandidate = (e: any) => e.candidate && send(uid, "candidate", e.candidate.toJSON ? e.candidate.toJSON() : e.candidate);
      pc.ontrack = (e: any) => patchRemote(uid, { stream: e.streams?.[0] ?? null });
      pc.onconnectionstatechange = () => patchRemote(uid, { state: pc.connectionState });
      patchRemote(uid, { state: "connecting" });
      return peer;
    },
    [send],
  );

  const flush = async (peer: Peer) => {
    for (const c of peer.pending.splice(0)) await peer.pc.addIceCandidate(new RTCIceCandidate(c)).catch(() => {});
  };

  // Le plus petit identifiant envoie l'offre : jamais deux offres croisées.
  const call = useCallback(
    async (uid: string) => {
      const peer = peerFor(uid);
      const offer = await peer.pc.createOffer({});
      await peer.pc.setLocalDescription(offer);
      await send(uid, "offer", { type: offer.type, sdp: offer.sdp });
    },
    [peerFor, send],
  );

  const join = useCallback(async () => {
    setError(undefined);
    if (participants.filter((p) => p.uid !== me.uid).length >= MAX_PARTICIPANTS) return setError(`L'appel est complet (${MAX_PARTICIPANTS} personnes maximum).`);
    try {
      const stream = await mediaDevices.getUserMedia({ audio: true, video: { facingMode: "user", width: 640, height: 480, frameRate: 24 } } as any);
      localRef.current = stream;
      setLocal(stream);
      await setDoc(doc(db, `${base}/participants/${me.uid}`), { uid: me.uid, name: me.name, updatedAt: serverTimestamp() });
      setJoined(true);
    } catch {
      setError("Accès à la caméra ou au micro refusé. Autorisez-les dans les réglages du téléphone.");
    }
  }, [base, me.name, me.uid, participants]);

  const leave = useCallback(async () => {
    setJoined(false);
    peers.current.forEach((_p, uid) => closePeer(uid));
    localRef.current?.getTracks().forEach((t: any) => t.stop());
    localRef.current = null;
    setLocal(null);
    await deleteDoc(doc(db, `${base}/participants/${me.uid}`)).catch(() => {});
  }, [base, me.uid]);

  // Participants présents (avant et pendant l'appel).
  useEffect(
    () =>
      onSnapshot(collection(db, `${base}/participants`), (s) => {
        const now = Date.now();
        const list = s.docs.map((d) => d.data() as Participant).filter((p) => !p.updatedAt || now - p.updatedAt.toMillis() < STALE_MS);
        list.forEach((p) => names.current.set(p.uid, p.name));
        setParticipants(list);
      }),
    [base],
  );

  // Connexions : appeler les nouveaux, fermer celles des partants.
  useEffect(() => {
    if (!joined) return;
    const others = participants.filter((p) => p.uid !== me.uid).map((p) => p.uid);
    others.forEach((uid) => {
      if (!peers.current.has(uid) && me.uid < uid) call(uid).catch(() => {});
    });
    [...peers.current.keys()].filter((uid) => !others.includes(uid)).forEach(closePeer);
  }, [joined, participants, me.uid, call]);

  // Messages de connexion qui me sont adressés.
  useEffect(() => {
    if (!joined) return;
    return onSnapshot(query(collection(db, `${base}/signals`), where("to", "==", me.uid)), (s) => {
      s.docChanges().forEach(async (ch) => {
        if (ch.type !== "added") return;
        const { from, type, payload } = ch.doc.data() as { from: string; type: string; payload: string };
        deleteDoc(ch.doc.ref).catch(() => {});
        const data = JSON.parse(payload);
        try {
          if (type === "offer") {
            const peer = peerFor(from);
            await peer.pc.setRemoteDescription(new RTCSessionDescription(data));
            peer.remoteSet = true;
            await flush(peer);
            const answer = await peer.pc.createAnswer();
            await peer.pc.setLocalDescription(answer);
            await send(from, "answer", { type: answer.type, sdp: answer.sdp });
          } else if (type === "answer") {
            const peer = peers.current.get(from);
            if (!peer || peer.remoteSet) return;
            await peer.pc.setRemoteDescription(new RTCSessionDescription(data));
            peer.remoteSet = true;
            await flush(peer);
          } else if (type === "candidate") {
            const peer = peerFor(from);
            if (peer.remoteSet) await peer.pc.addIceCandidate(new RTCIceCandidate(data)).catch(() => {});
            else peer.pending.push(data);
          }
        } catch {
          // Une négociation ratée se rétablit quand le participant revient.
        }
      });
    });
  }, [joined, base, me.uid, peerFor, send]);

  // Présence : signal de vie régulier ; départ propre à la fermeture de l'écran.
  useEffect(() => {
    if (!joined) return;
    const id = setInterval(() => setDoc(doc(db, `${base}/participants/${me.uid}`), { uid: me.uid, name: me.name, updatedAt: serverTimestamp() }).catch(() => {}), 15_000);
    return () => clearInterval(id);
  }, [joined, base, me.uid, me.name]);
  useEffect(() => () => void leave(), [leave]);

  const toggleMic = () => {
    localRef.current?.getAudioTracks().forEach((t: any) => (t.enabled = !micOn));
    setMicOn(!micOn);
  };
  const toggleCam = () => {
    localRef.current?.getVideoTracks().forEach((t: any) => (t.enabled = !camOn));
    setCamOn(!camOn);
  };
  const switchCamera = () => localRef.current?.getVideoTracks().forEach((t: any) => t._switchCamera?.());

  return { joined, join, leave, error, local, remotes: Object.values(remotes), participants, micOn, camOn, toggleMic, toggleCam, switchCamera };
}
