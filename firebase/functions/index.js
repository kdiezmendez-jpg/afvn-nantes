import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { setGlobalOptions } from "firebase-functions/v2";
import { onDocumentCreated, onDocumentUpdated } from "firebase-functions/v2/firestore";
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
