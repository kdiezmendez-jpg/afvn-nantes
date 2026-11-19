import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { Platform } from "react-native";
import { db } from "./firebase";

// Notifications envoyées par l'église (validation du compte, actualités, prières).
// Le jeton de l'appareil est enregistré dans users/{uid}/devices ; seuls les serveurs de l'église le lisent.

const projectId = (Constants.expoConfig?.extra as { eas?: { projectId?: string } } | undefined)?.eas?.projectId;
export const pushAvailable = Platform.OS !== "web" && Boolean(projectId);
let current: string | null = null;

async function channel() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("general", {
      name: "Annonces de l'église",
      // eslint-disable-next-line import/namespace -- exporté par expo-notifications (réexport non suivi par le lint)
      importance: Notifications.AndroidImportance.HIGH,
      lightColor: "#efb54a",
    });
  }
}

export async function pushStatus() {
  if (!pushAvailable) return "unavailable" as const;
  const p = await Notifications.getPermissionsAsync();
  return p.granted ? ("granted" as const) : p.canAskAgain ? ("ask" as const) : ("denied" as const);
}

// À appeler quand le membre l'a demandé (ou si l'autorisation est déjà accordée).
export async function enablePush(uid: string, ask = true): Promise<boolean> {
  if (!pushAvailable) return false;
  let perm = await Notifications.getPermissionsAsync();
  if (!perm.granted && ask) perm = await Notifications.requestPermissionsAsync();
  if (!perm.granted) return false;
  await channel();
  const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
  current = token;
  await setDoc(doc(db, `users/${uid}/devices/${token}`), { token, platform: Platform.OS as "ios" | "android", updatedAt: serverTimestamp() });
  return true;
}

// À la déconnexion : cet appareil ne reçoit plus les notifications du compte.
export async function disablePush(uid: string) {
  if (current) await deleteDoc(doc(db, `users/${uid}/devices/${current}`)).catch(() => {});
  current = null;
}
