// Test des notifications : les fonctions sont appelées avec de vrais événements Firestore
// (émulateur) et un faux service Expo Push qui enregistre ce qui serait envoyé.
// Lancer : cd firebase && npm run test:functions
import http from "node:http";
import { createRequire } from "node:module";
const require = createRequire(new URL("../functions/package.json", import.meta.url));
const { getFirestore, FieldValue, Timestamp } = require("firebase-admin/firestore");

const received = [];
const server = http.createServer((req, res) => {
  let body = "";
  req.on("data", (c) => (body += c));
  req.on("end", () => {
    const msgs = JSON.parse(body);
    received.push(...msgs);
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ data: msgs.map((m) => (m.to === "ExponentPushToken[ancien]" ? { status: "error", details: { error: "DeviceNotRegistered" } } : { status: "ok", id: "x" })) }));
  });
});
await new Promise((r) => server.listen(9999, "127.0.0.1", r));

process.env.FIRESTORE_EMULATOR_HOST ??= "127.0.0.1:8080";
process.env.GCLOUD_PROJECT = "demo-afvn";
process.env.PUSH_ENDPOINT = "http://127.0.0.1:9999";
const fns = await import("../functions/index.js");
const db = getFirestore();

// Simule le déclencheur Firestore : écrit le document puis appelle la fonction avec l'événement.
const snap = (path, data) => ({ data: () => data, ref: db.doc(path) });
async function created(fn, path, params, data) {
  await db.doc(path).set(data);
  await fn.run({ params, data: snap(path, data) });
}
async function removed(fn, path, params) {
  const data = (await db.doc(path).get()).data();
  await db.doc(path).delete();
  await fn.run({ params, data: snap(path, data) });
}
async function updated(fn, path, params, patch) {
  const before = (await db.doc(path).get()).data();
  await db.doc(path).update(patch);
  const after = (await db.doc(path).get()).data();
  await fn.run({ params, data: { before: snap(path, before), after: snap(path, after) } });
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const until = async (fn, ms = 15000) => { const t = Date.now(); while (Date.now() - t < ms) { if (fn()) return true; await wait(250); } return false; };
const results = [];
const check = (name, ok) => results.push([ok ? "OK  " : "ÉCHEC", name]);
const to = (t) => received.filter((m) => m.to === t);

const user = (first, roles, status = "active") => ({ firstName: first, lastName: "T", email: `${first}@x.fr`, status, roles, directoryVisible: false });
const device = (t) => ({ token: t, platform: "android", updatedAt: new Date() });
await db.doc("users/pasteur").set(user("Pasteur", ["member", "admin"]));
await db.doc("users/pasteur/devices/ExponentPushToken[pasteur]").set(device("ExponentPushToken[pasteur]"));
await db.doc("users/ruth").set(user("Ruth", ["member", "intercessor"]));
await db.doc("users/ruth/devices/ExponentPushToken[ruth]").set(device("ExponentPushToken[ruth]"));
await db.doc("users/paul").set(user("Paul", ["member"]));
await db.doc("users/paul/devices/ExponentPushToken[paul]").set(device("ExponentPushToken[paul]"));
await db.doc("users/paul/devices/ExponentPushToken[ancien]").set(device("ExponentPushToken[ancien]"));
await db.doc("users/marie").set(user("Marie", ["member"], "pending"));
await db.doc("users/marie/devices/ExponentPushToken[marie]").set(device("ExponentPushToken[marie]"));

// 1. Validation de compte
await updated(fns.onMemberValidated, "users/marie", { uid: "marie" }, { status: "active" });
check("Compte validé → Marie est prévenue", await until(() => to("ExponentPushToken[marie]").some((m) => m.title.includes("Bienvenue"))));

// 2. Actualité
await created(fns.onNewsPublished, "news/n1", { id: "n1" }, { title: "Culte de baptême", body: "Dimanche prochain, culte de baptême à 9h30.", audience: "all", pinned: false, notify: true, authorUid: "pasteur", authorName: "Pasteur T", createdAt: new Date() });
check("Actualité → tous les membres actifs la reçoivent", await until(() => ["ruth", "paul", "marie"].every((n) => to(`ExponentPushToken[${n}]`).some((m) => m.title === "Culte de baptême"))));
check("Actualité → l'auteur ne se notifie pas lui-même", !to("ExponentPushToken[pasteur]").some((m) => m.title === "Culte de baptême"));
await created(fns.onNewsPublished, "news/n2", { id: "n2" }, { title: "Réunion des serviteurs", body: "Samedi 10h.", audience: "servants", pinned: false, notify: true, authorUid: "pasteur", authorName: "Pasteur T", createdAt: new Date() });
await until(() => to("ExponentPushToken[ruth]").some((m) => m.title === "Réunion des serviteurs"));
check("Actualité « serviteurs » → reçue par l'intercesseur", to("ExponentPushToken[ruth]").some((m) => m.title === "Réunion des serviteurs"));
check("Actualité « serviteurs » → pas envoyée aux simples membres", !to("ExponentPushToken[paul]").some((m) => m.title === "Réunion des serviteurs"));

// 3. Demande de prière
await created(fns.onPrayerCreated, "prayers/p1", { id: "p1" }, { uid: "paul", authorName: "Paul T", anonymous: false, text: "Pour la guérison de ma mère", status: "received", prayedBy: [], createdAt: new Date(), updatedAt: new Date() });
check("Prière → l'équipe de prière est prévenue", await until(() => to("ExponentPushToken[ruth]").some((m) => m.title === "Nouvelle demande de prière") && to("ExponentPushToken[pasteur]").some((m) => m.title === "Nouvelle demande de prière")));
check("Prière → le contenu n'apparaît jamais dans la notification", !received.some((m) => JSON.stringify(m).includes("guérison")));
check("Prière → pas envoyée aux simples membres", !to("ExponentPushToken[marie]").some((m) => m.title === "Nouvelle demande de prière"));

// 4. Quelqu'un prie
await updated(fns.onPrayerSupported, "prayers/p1", { id: "p1" }, { prayedBy: FieldValue.arrayUnion("ruth"), status: "praying", updatedAt: new Date() });
check("« Je prie » → l'auteur est encouragé", await until(() => to("ExponentPushToken[paul]").some((m) => m.title.startsWith("On prie pour vous"))));

// 5. Nettoyage des appareils désinstallés
await wait(1000);
check("Appareil désinstallé → jeton supprimé automatiquement", !(await db.doc("users/paul/devices/ExponentPushToken[ancien]").get()).exists);

// 6. Inscriptions : compteur tenu par le serveur
await db.doc("users/esther").set(user("Esther", ["member", "leader"]));
await db.doc("users/esther/devices/ExponentPushToken[esther]").set(device("ExponentPushToken[esther]"));
const tomorrow = new Date(Date.now() + 20 * 3600e3);
await db.doc("events/e1").set({ title: "ESCHATOS 2027", description: "", location: "69 bis rue du Bêle", startsAt: Timestamp.fromDate(tomorrow), audience: "all", capacity: 50, registrationOpen: true, registeredCount: 0, createdBy: "esther", createdAt: new Date() });
await created(fns.onRegistrationCreated, "events/e1/registrations/paul", { id: "e1", uid: "paul" }, { uid: "paul", name: "Paul T", guests: 2, createdAt: new Date() });
await created(fns.onRegistrationCreated, "events/e1/registrations/ruth", { id: "e1", uid: "ruth" }, { uid: "ruth", name: "Ruth T", guests: 0, createdAt: new Date() });
check("Inscriptions → compteur = 4 (Paul + 2 accompagnants, Ruth)", (await db.doc("events/e1").get()).data().registeredCount === 4);
await removed(fns.onRegistrationDeleted, "events/e1/registrations/ruth", { id: "e1", uid: "ruth" });
check("Désinscription → compteur = 3", (await db.doc("events/e1").get()).data().registeredCount === 3);

// 7. Rappel la veille
await fns.sendEventReminders();
check("Rappel de la veille → reçu par les inscrits", to("ExponentPushToken[paul]").some((m) => m.title === "Demain : ESCHATOS 2027"));
check("Rappel de la veille → pas envoyé aux non-inscrits", !to("ExponentPushToken[ruth]").some((m) => m.title === "Demain : ESCHATOS 2027"));

// 8. Baptême
await created(fns.onBaptismRequested, "baptisms/paul", { uid: "paul" }, { uid: "paul", name: "Paul T", motivation: "Je veux suivre Jésus.", status: "requested", steps: [], createdAt: new Date(), updatedAt: new Date() });
check("Demande de baptême → les responsables sont prévenus", to("ExponentPushToken[esther]").some((m) => m.title === "Demande de baptême") && to("ExponentPushToken[pasteur]").some((m) => m.title === "Demande de baptême"));
check("Demande de baptême → pas envoyée aux intercesseurs", !to("ExponentPushToken[ruth]").some((m) => m.title === "Demande de baptême"));
await updated(fns.onBaptismUpdated, "baptisms/paul", { uid: "paul" }, { status: "scheduled", scheduledAt: Timestamp.fromDate(new Date("2027-01-10T08:30:00Z")), updatedAt: new Date() });
check("Date fixée → le membre reçoit la date en français", to("ExponentPushToken[paul]").some((m) => m.body.includes("dimanche 10 janvier") && m.body.includes("09:30")));

// 9. Session de formation
await db.doc("users/jean").set(user("Jean", ["member", "trainer"]));
await db.doc("users/ruth").update({ roles: ["member", "intercessor", "servant"] });
await created(fns.onTrainingSessionCreated, "trainingSessions/s1", { id: "s1" }, { moduleId: "m1", title: "Leçon 1 : Toute l'histoire", startsAt: Timestamp.fromDate(new Date("2027-02-01T18:00:00Z")), kind: "live", youtubeUrl: null, createdBy: "jean", createdAt: new Date() });
check("Session de formation → les serviteurs sont prévenus", to("ExponentPushToken[ruth]").some((m) => m.title === "Formation en direct" && m.body.includes("lundi 1 février")));
check("Session de formation → pas envoyée aux simples membres", !to("ExponentPushToken[paul]").some((m) => m.title === "Formation en direct"));

for (const [s, n] of results) console.log(s, n);
server.close();
process.exit(results.some(([s]) => s !== "OK  ") ? 1 : 0);
