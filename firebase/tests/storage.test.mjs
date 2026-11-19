// Tests des règles de stockage des manuels (émulateurs Storage + Firestore).
// Lancer : cd firebase && npm run test:storage
import { assertFails, assertSucceeds, initializeTestEnvironment } from "@firebase/rules-unit-testing";
import { readFileSync } from "node:fs";
import { doc, setDoc } from "firebase/firestore";
import { getBytes, ref, uploadBytes } from "firebase/storage";

const env = await initializeTestEnvironment({
  projectId: "demo-afvn",
  firestore: { rules: readFileSync(new URL("../firestore.rules", import.meta.url), "utf8"), host: "127.0.0.1", port: 8080 },
  storage: { rules: readFileSync(new URL("../storage.rules", import.meta.url), "utf8"), host: "127.0.0.1", port: 9199 },
});
await env.withSecurityRulesDisabled(async (ctx) => {
  const d = ctx.firestore();
  await setDoc(doc(d, "users/trainer"), { status: "active", roles: ["member", "trainer"] });
  await setDoc(doc(d, "users/servant"), { status: "active", roles: ["member", "servant"] });
  await setDoc(doc(d, "users/member"), { status: "active", roles: ["member"] });
});
const st = (uid) => env.authenticatedContext(uid).storage();
const pdf = new Uint8Array([37, 80, 68, 70, 45]);
const meta = { contentType: "application/pdf" };
const results = [];
const check = async (name, p) => { try { await p; results.push(["OK  ", name]); } catch (e) { results.push(["ÉCHEC", `${name} — ${String(e).slice(0, 100)}`]); } };

await check("Formateur : dépose le manuel de l'étudiant", assertSucceeds(uploadBytes(ref(st("trainer"), "training/m1/student/f1.pdf"), pdf, meta)));
await check("Formateur : dépose le guide de l'enseignant", assertSucceeds(uploadBytes(ref(st("trainer"), "training/m1/trainer/f2.pdf"), pdf, meta)));
await check("Formateur : un fichier non PDF est refusé", assertFails(uploadBytes(ref(st("trainer"), "training/m1/student/x.pdf"), pdf, { contentType: "text/html" })));
await check("Serviteur : ne peut pas déposer de fichier", assertFails(uploadBytes(ref(st("servant"), "training/m1/student/f3.pdf"), pdf, meta)));
await check("Serviteur : télécharge le manuel de l'étudiant", assertSucceeds(getBytes(ref(st("servant"), "training/m1/student/f1.pdf"))));
await check("Serviteur : ne télécharge pas le guide de l'enseignant", assertFails(getBytes(ref(st("servant"), "training/m1/trainer/f2.pdf"))));
await check("Simple membre : ne télécharge aucun manuel", assertFails(getBytes(ref(st("member"), "training/m1/student/f1.pdf"))));
await check("Visiteur non connecté : refusé", assertFails(getBytes(ref(env.unauthenticatedContext().storage(), "training/m1/student/f1.pdf"))));

for (const [s, n] of results) console.log(s, n);
await env.cleanup();
process.exit(results.some(([s]) => s !== "OK  ") ? 1 : 0);
