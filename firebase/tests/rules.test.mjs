// Tests des règles de sécurité Firestore (émulateur local).
// Lancer : cd firebase && npx firebase emulators:exec --only firestore "node tests/rules.test.mjs"
import { assertFails, assertSucceeds, initializeTestEnvironment } from "@firebase/rules-unit-testing";
import { readFileSync } from "node:fs";
import { collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";

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

for (const [s, n] of results) console.log(s, n);
await env.cleanup();
process.exit(results.some(([s]) => s !== "OK  ") ? 1 : 0);
