// Envoi de notifications via le service Expo Push (gratuit), qui relaie vers Apple et Google.
const ENDPOINT = process.env.PUSH_ENDPOINT || "https://exp.host/--/api/v2/push/send";

// Envoie les messages par lots de 100 et renvoie les jetons à supprimer (appareils désinstallés).
export async function sendPush(messages) {
  const stale = [];
  for (let i = 0; i < messages.length; i += 100) {
    const batch = messages.slice(i, i + 100);
    const headers = { "Content-Type": "application/json", Accept: "application/json" };
    if (process.env.EXPO_ACCESS_TOKEN) headers.Authorization = `Bearer ${process.env.EXPO_ACCESS_TOKEN}`;
    const res = await fetch(ENDPOINT, { method: "POST", headers, body: JSON.stringify(batch) });
    const json = await res.json().catch(() => ({}));
    (json.data ?? []).forEach((ticket, j) => {
      if (ticket?.status === "error" && ticket?.details?.error === "DeviceNotRegistered") stale.push(batch[j].to);
    });
  }
  return stale;
}
