// Tests des règles de sécurité Firestore (émulateur local).
// Lancer : cd firebase && npx firebase emulators:exec --only firestore "node tests/rules.test.mjs"
import { assertFails, assertSucceeds, initializeTestEnvironment } from "@firebase/rules-unit-testing";
import { readFileSync } from "node:fs";
import { arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";

const env = await initializeTestEnvironment({
  projectId: "demo-afvn",
  firestore: { rules: readFileSync(new URL("../firestore.rules", import.meta.url), "utf8"), host: "127.0.0.1", port: 8080 },
});

const profile = (email, extra = {}) => ({
  firstName: "Marie", lastName: "Dupont", email, status: "pending", roles: ["member"], directoryVisible: false,
  acceptedTermsAt: serverTimestamp(), createdAt: serverTimestamp(), ...extra,
});

// Données de départ (sans règles) : un admin, un membre actif visible, un membre actif masqué.
await env.withSecurityRulesDisabled(async (ctx) => {
  const d = ctx.firestore();
  await setDoc(doc(d, "users/admin"), { firstName: "Pasteur", lastName: "A", email: "admin@x.fr", status: "active", roles: ["member", "admin"], directoryVisible: true });
  await setDoc(doc(d, "users/visible"), { firstName: "Paul", lastName: "V", email: "v@x.fr", status: "active", roles: ["member"], directoryVisible: true });
  await setDoc(doc(d, "users/hidden"), { firstName: "Jean", lastName: "H", email: "h@x.fr", status: "active", roles: ["member"], directoryVisible: false });
  await setDoc(doc(d, "users/interc"), { firstName: "Ruth", lastName: "I", email: "i@x.fr", status: "active", roles: ["member", "intercessor"], directoryVisible: false });
  await setDoc(doc(d, "users/leader"), { firstName: "Esther", lastName: "L", email: "l@x.fr", status: "active", roles: ["member", "leader"], directoryVisible: false });
  await setDoc(doc(d, "users/stillpending"), { firstName: "Eve", lastName: "P", email: "p@x.fr", status: "pending", roles: ["member"], directoryVisible: false });
  await setDoc(doc(d, "users/waiting"), { firstName: "Luc", lastName: "W", email: "w@x.fr", status: "pending", roles: ["member"], directoryVisible: false, createdAt: new Date() });
});

const as = (uid, email) => env.authenticatedContext(uid, { email }).firestore();
const results = [];
async function check(name, p) {
  try {
    await p;
    results.push(["OK  ", name]);
  } catch (e) {
    results.push(["ÉCHEC", name + " — " + (e?.message ?? e).toString().slice(0, 120)]);
  }
}

const newbie = as("newbie", "newbie@x.fr");
await check("Inscription : profil « en attente » accepté", assertSucceeds(setDoc(doc(newbie, "users/newbie"), profile("newbie@x.fr"))));
await check("Inscription : impossible de se déclarer « actif »", assertFails(setDoc(doc(as("n2", "n2@x.fr"), "users/n2"), profile("n2@x.fr", { status: "active" }))));
await check("Inscription : impossible de se déclarer administrateur", assertFails(setDoc(doc(as("n3", "n3@x.fr"), "users/n3"), profile("n3@x.fr", { roles: ["member", "admin"] }))));
await check("Inscription : impossible de créer le profil de quelqu'un d'autre", assertFails(setDoc(doc(newbie, "users/autre"), profile("newbie@x.fr"))));
await check("Inscription : e-mail différent du compte refusé", assertFails(setDoc(doc(as("n4", "n4@x.fr"), "users/n4"), profile("pirate@x.fr"))));
await check("Membre : peut modifier son prénom", assertSucceeds(updateDoc(doc(newbie, "users/newbie"), { firstName: "Marie-Claire" })));
await check("Membre : ne peut pas changer ses rôles", assertFails(updateDoc(doc(newbie, "users/newbie"), { roles: ["member", "admin"] })));
await check("Membre : ne peut pas se valider lui-même", assertFails(updateDoc(doc(newbie, "users/newbie"), { status: "active" })));
await check("En attente : ne voit pas l'annuaire", assertFails(getDoc(doc(newbie, "users/visible"))));
const paul = as("visible", "v@x.fr");
await check("Membre actif : voit un profil visible dans l'annuaire", assertSucceeds(getDoc(doc(paul, "users/admin"))));
await check("Membre actif : ne voit pas un profil masqué", assertFails(getDoc(doc(paul, "users/hidden"))));
await check("Membre actif : ne peut pas lister les comptes en attente", assertFails(getDocs(query(collection(paul, "users"), where("status", "==", "pending")))));
const admin = as("admin", "admin@x.fr");
await check("Admin : liste les comptes en attente", assertSucceeds(getDocs(query(collection(admin, "users"), where("status", "==", "pending")))));
await check("Admin : valide un compte", assertSucceeds(updateDoc(doc(admin, "users/waiting"), { status: "active", reviewedAt: serverTimestamp() })));
await check("Admin : nomme un serviteur", assertSucceeds(updateDoc(doc(admin, "users/waiting"), { roles: ["member", "servant"] })));
await check("Admin : rôle inconnu refusé", assertFails(updateDoc(doc(admin, "users/waiting"), { roles: ["member", "superadmin"] })));
await check("Admin : ne peut pas réécrire l'e-mail d'un membre", assertFails(updateDoc(doc(admin, "users/waiting"), { email: "autre@x.fr" })));
await check("Collection inconnue : écriture refusée", assertFails(setDoc(doc(admin, "secrets/x"), { a: 1 })));
await check("Visiteur non connecté : lecture refusée", assertFails(getDoc(doc(env.unauthenticatedContext().firestore(), "users/visible"))));
await check("Membre : peut supprimer son compte", assertSucceeds(deleteDoc(doc(newbie, "users/newbie"))));

// ——— Étape 2 : prières, actualités, appareils ———
const prayer = (uid, extra = {}) => ({ uid, authorName: "Paul V", anonymous: false, text: "Pour ma famille", status: "received", prayedBy: [], createdAt: serverTimestamp(), updatedAt: serverTimestamp(), ...extra });
const ruth = as("interc", "i@x.fr");
const esther = as("leader", "l@x.fr");
await check("Prière : un membre actif dépose une demande", assertSucceeds(setDoc(doc(paul, "prayers/p1"), prayer("visible"))));
await check("Prière : demande anonyme sans nom acceptée", assertSucceeds(setDoc(doc(paul, "prayers/p2"), prayer("visible", { anonymous: true, authorName: null }))));
await check("Prière : anonyme mais avec un nom refusé", assertFails(setDoc(doc(paul, "prayers/p3"), prayer("visible", { anonymous: true }))));
await check("Prière : impossible au nom de quelqu'un d'autre", assertFails(setDoc(doc(paul, "prayers/p4"), prayer("hidden"))));
await check("Prière : un compte en attente ne peut pas déposer", assertFails(setDoc(doc(as("stillpending", "p@x.fr"), "prayers/p5"), prayer("stillpending"))));
await check("Prière : un autre membre ne peut pas la lire", assertFails(getDoc(doc(as("hidden", "h@x.fr"), "prayers/p1"))));
await check("Prière : l'auteur la lit", assertSucceeds(getDoc(doc(paul, "prayers/p1"))));
await check("Prière : l'intercesseur la lit", assertSucceeds(getDoc(doc(ruth, "prayers/p1"))));
await check("Prière : l'intercesseur indique « je prie »", assertSucceeds(updateDoc(doc(ruth, "prayers/p1"), { prayedBy: arrayUnion("interc"), status: "praying", updatedAt: serverTimestamp() })));
await check("Prière : impossible de prier au nom d'un autre", assertFails(updateDoc(doc(ruth, "prayers/p1"), { prayedBy: arrayUnion("leader"), updatedAt: serverTimestamp() })));
await check("Prière : l'équipe ne modifie pas le texte", assertFails(updateDoc(doc(ruth, "prayers/p1"), { text: "modifié", updatedAt: serverTimestamp() })));
await check("Prière : l'auteur témoigne de l'exaucement", assertSucceeds(updateDoc(doc(paul, "prayers/p1"), { status: "answered", testimony: "Merci Seigneur !", updatedAt: serverTimestamp() })));
await check("Prière : un simple membre ne liste pas toutes les prières", assertFails(getDocs(collection(as("hidden", "h@x.fr"), "prayers"))));
await check("Prière : l'équipe liste les prières", assertSucceeds(getDocs(collection(ruth, "prayers"))));
await check("Prière : l'auteur liste ses prières", assertSucceeds(getDocs(query(collection(paul, "prayers"), where("uid", "==", "visible")))));

const news = (extra = {}) => ({ title: "Culte spécial", body: "Dimanche, culte de baptême.", audience: "all", pinned: false, notify: true, authorUid: "leader", authorName: "Esther L", createdAt: serverTimestamp(), ...extra });
await check("Actualité : un responsable publie", assertSucceeds(setDoc(doc(esther, "news/n1"), news())));
await check("Actualité : un membre ne peut pas publier", assertFails(setDoc(doc(paul, "news/n2"), news({ authorUid: "visible" }))));
await check("Actualité : signature d'un autre auteur refusée", assertFails(setDoc(doc(esther, "news/n3"), news({ authorUid: "admin" }))));
await check("Actualité : un membre actif la lit", assertSucceeds(getDoc(doc(paul, "news/n1"))));
await check("Actualité : un compte en attente ne la lit pas", assertFails(getDoc(doc(as("stillpending", "p@x.fr"), "news/n1"))));
await check("Actualité : réservée aux serviteurs, refusée à un membre", assertSucceeds(setDoc(doc(esther, "news/n4"), news({ audience: "servants" }))).then(() => assertFails(getDoc(doc(paul, "news/n4")))));
await check("Actualité : réservée aux serviteurs, lue par un intercesseur", assertSucceeds(getDoc(doc(ruth, "news/n4"))));
await check("Actualité : un membre liste les actualités « tous »", assertSucceeds(getDocs(query(collection(paul, "news"), where("audience", "==", "all")))));

const dev = (t, extra = {}) => ({ token: t, platform: "android", updatedAt: serverTimestamp(), ...extra });
await check("Appareil : le membre enregistre son jeton", assertSucceeds(setDoc(doc(paul, "users/visible/devices/ExponentPushToken[abc]"), dev("ExponentPushToken[abc]"))));
await check("Appareil : jeton sur le compte d'un autre refusé", assertFails(setDoc(doc(paul, "users/hidden/devices/ExponentPushToken[x]"), dev("ExponentPushToken[x]"))));
await check("Appareil : un admin ne lit pas les jetons des membres", assertFails(getDoc(doc(admin, "users/visible/devices/ExponentPushToken[abc]"))));

for (const [s, n] of results) console.log(s, n);
await env.cleanup();
process.exit(results.some(([s]) => s !== "OK  ") ? 1 : 0);
