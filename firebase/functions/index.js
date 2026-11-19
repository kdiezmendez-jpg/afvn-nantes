import { initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore, Timestamp } from "firebase-admin/firestore";
import { setGlobalOptions } from "firebase-functions/v2";
import { onDocumentCreated, onDocumentDeleted, onDocumentUpdated } from "firebase-functions/v2/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { sendPush } from "./push.js";

initializeApp();
const db = getFirestore();
setGlobalOptions({ region: "europe-west9", maxInstances: 5 });

// Jetons de notification des membres donnés (sous-collection users/{uid}/devices).
async function tokensFor(uids) {
  const out = [];
  for (const uid of uids) {
    const snap = await db.collection(`users/${uid}/devices`).get();
    snap.forEach((d) => out.push({ uid, token: d.id }));
  }
  return out;
}

async function notify(uids, { title, body, url }) {
  const devices = await tokensFor([...new Set(uids)]);
  if (!devices.length) return 0;
  const stale = await sendPush(
    devices.map((d) => ({ to: d.token, title, body, sound: "default", data: { url }, channelId: "general" })),
  );
  await Promise.all(devices.filter((d) => stale.includes(d.token)).map((d) => db.doc(`users/${d.uid}/devices/${d.token}`).delete()));
  return devices.length;
}

const activeMembers = async (roles) => {
  let q = db.collection("users").where("status", "==", "active");
  if (roles) q = q.where("roles", "array-contains-any", roles);
  return (await q.get()).docs.map((d) => d.id);
};

// 1. Compte validé par un responsable → le membre est prévenu.
export const onMemberValidated = onDocumentUpdated("users/{uid}", async (event) => {
  const before = event.data?.before.data();
  const after = event.data?.after.data();
  if (!before || !after || before.status === "active" || after.status !== "active") return;
  await notify([event.params.uid], {
    title: "Bienvenue dans votre espace !",
    body: `${after.firstName}, votre compte AFVN Nantes est validé. Vous avez maintenant accès à tout l'espace membre.`,
    url: "/espace",
  });
});

// 2. Nouvelle actualité → tous les membres concernés (sauf l'auteur).
export const onNewsPublished = onDocumentCreated("news/{id}", async (event) => {
  const n = event.data?.data();
  if (!n?.notify) return;
  const uids = await activeMembers(n.audience === "servants" ? ["servant", "intercessor", "leader", "admin"] : null);
  await notify(uids.filter((u) => u !== n.authorUid), { title: n.title, body: n.body.slice(0, 160), url: "/actualites" });
});

// 3. Nouvelle demande de prière → l'équipe de prière, sans le contenu (confidentialité).
export const onPrayerCreated = onDocumentCreated("prayers/{id}", async (event) => {
  const p = event.data?.data();
  if (!p) return;
  const team = await activeMembers(["intercessor", "leader", "admin"]);
  await notify(team.filter((u) => u !== p.uid), {
    title: "Nouvelle demande de prière",
    body: p.anonymous ? "Une demande anonyme vous attend." : `${p.authorName} vous confie un sujet de prière.`,
    url: "/prieres/equipe",
  });
});

// 4. Premier intercesseur qui prie → l'auteur est encouragé.
export const onPrayerSupported = onDocumentUpdated("prayers/{id}", async (event) => {
  const before = event.data?.before.data();
  const after = event.data?.after.data();
  if (!before || !after) return;
  if ((before.prayedBy?.length ?? 0) === 0 && (after.prayedBy?.length ?? 0) > 0) {
    await notify([after.uid], { title: "On prie pour vous 🙏", body: "L'équipe de prière porte votre demande devant Dieu.", url: "/prieres" });
  }
});

// ——— Étape 3 : événements et baptême ———

// 5. Compteur d'inscrits (personne + accompagnants), tenu uniquement côté serveur.
export const onRegistrationCreated = onDocumentCreated("events/{id}/registrations/{uid}", async (event) => {
  const r = event.data?.data();
  if (!r) return;
  await db.doc(`events/${event.params.id}`).update({ registeredCount: FieldValue.increment(1 + (r.guests ?? 0)) });
});
export const onRegistrationDeleted = onDocumentDeleted("events/{id}/registrations/{uid}", async (event) => {
  const r = event.data?.data();
  if (!r) return;
  await db.doc(`events/${event.params.id}`).update({ registeredCount: FieldValue.increment(-(1 + (r.guests ?? 0))) }).catch(() => {});
});

// 6. Nouvelle demande de baptême → les responsables.
export const onBaptismRequested = onDocumentCreated("baptisms/{uid}", async (event) => {
  const b = event.data?.data();
  if (!b) return;
  await notify(await activeMembers(["leader", "admin"]), { title: "Demande de baptême", body: `${b.name} souhaite être baptisé(e).`, url: "/admin/baptemes" });
});

// 7. Le parcours avance → le membre est prévenu.
const baptismMessages = {
  interview: "Un responsable va vous proposer un entretien.",
  preparation: "Votre préparation au baptême commence !",
  scheduled: "La date de votre baptême est fixée.",
  baptized: "Gloire à Dieu pour votre baptême ! Bienvenue dans cette nouvelle vie.",
};
export const onBaptismUpdated = onDocumentUpdated("baptisms/{uid}", async (event) => {
  const before = event.data?.before.data();
  const after = event.data?.after.data();
  if (!before || !after || before.status === after.status || !baptismMessages[after.status]) return;
  let body = baptismMessages[after.status];
  if (after.status === "scheduled" && after.scheduledAt) {
    const date = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" }).format(after.scheduledAt.toDate());
    body = `Votre baptême est fixé au ${date}.`;
  }
  await notify([event.params.uid], { title: "Votre parcours de baptême", body, url: "/bapteme" });
});

// 8. Rappel la veille d'un événement, chaque jour à 18h (heure de Paris), aux inscrits.
export async function sendEventReminders(now = new Date()) {
  const from = new Date(now.getTime() + 6 * 3600e3);
  const to = new Date(now.getTime() + 30 * 3600e3);
  const events = await db.collection("events").where("startsAt", ">=", Timestamp.fromDate(from)).where("startsAt", "<", Timestamp.fromDate(to)).get();
  let sent = 0;
  for (const e of events.docs) {
    const regs = await e.ref.collection("registrations").get();
    const hour = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" }).format(e.data().startsAt.toDate());
    sent += await notify(regs.docs.map((r) => r.id), { title: `Demain : ${e.data().title}`, body: `Rendez-vous à ${hour}, ${e.data().location}.`, url: `/evenements/${e.id}` });
  }
  return sent;
}
export const eventReminders = onSchedule({ schedule: "every day 18:00", timeZone: "Europe/Paris" }, () => sendEventReminders().then(() => undefined));

// ——— Étape 4 : formation ———
// 9. Nouvelle session de formation → les serviteurs sont prévenus.
export const onTrainingSessionCreated = onDocumentCreated("trainingSessions/{id}", async (event) => {
  const t = event.data?.data();
  if (!t) return;
  const date = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" }).format(t.startsAt.toDate());
  const servants = await activeMembers(["servant", "intercessor", "trainer", "leader", "admin"]);
  await notify(servants.filter((u) => u !== t.createdBy), {
    title: t.kind === "live" ? "Formation en direct" : "Formation en petit groupe",
    body: `${t.title} — ${date}.`,
    url: `/formation/session/${event.params.id}`,
  });
});

// ——— Étape 5 : messagerie et modération ———
// 10. Message privé → le destinataire est prévenu (aperçu court), sauf s'il a bloqué l'expéditeur.
export const onPrivateMessage = onDocumentCreated("conversations/{cid}/messages/{id}", async (event) => {
  const m = event.data?.data();
  if (!m) return;
  const conv = (await db.doc(`conversations/${event.params.cid}`).get()).data();
  if (!conv) return;
  const to = conv.members.find((u) => u !== m.uid);
  if (!to || (await db.doc(`users/${to}/blocked/${m.uid}`).get()).exists) return;
  const from = conv.names?.[m.uid] ?? "Un membre";
  await notify([to], { title: from, body: m.text.length > 100 ? `${m.text.slice(0, 100)}…` : m.text, url: `/messages/${event.params.cid}` });
});

// 11. Signalement → les administrateurs sont prévenus pour modérer rapidement.
export const onReport = onDocumentCreated("reports/{id}", async (event) => {
  const r = event.data?.data();
  if (!r) return;
  await notify(await activeMembers(["admin"]), { title: "Contenu signalé", body: "Un membre a signalé un contenu à vérifier.", url: "/admin/signalements" });
});
