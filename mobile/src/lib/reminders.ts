import * as Notifications from "expo-notifications";
import AsyncStorageLike from "./storage";
import { Platform } from "react-native";
import { schedule } from "@shared/site";

// Rappels de culte : notifications LOCALES programmées sur le téléphone, 30 minutes avant
// chaque rendez-vous hebdomadaire. Aucun serveur, aucun compte, aucune donnée envoyée.

const KEY = "afvn-reminders";
const CHANNEL = "rappels-cultes";
const WEEKDAY: Record<string, number> = { Sunday: 1, Monday: 2, Tuesday: 3, Wednesday: 4, Thursday: 5, Friday: 6, Saturday: 7 };
export const LEAD_MINUTES = 30;

export type ReminderPrefs = Record<string, boolean>; // clé = dayOfWeek

if (Platform.OS !== "web") {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }),
  });
}

export async function getPrefs(): Promise<ReminderPrefs> {
  const raw = await AsyncStorageLike.get(KEY);
  return raw ? (JSON.parse(raw) as ReminderPrefs) : {};
}

async function ensurePermission() {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

// Applique les préférences : supprime puis reprogramme les rappels choisis.
export async function setPrefs(prefs: ReminderPrefs): Promise<{ ok: boolean; reason?: string }> {
  if (Platform.OS === "web") return { ok: false, reason: "Les rappels sont disponibles dans l'application mobile." };
  const wanted = Object.values(prefs).some(Boolean);
  if (wanted && !(await ensurePermission())) {
    return { ok: false, reason: "Autorisez les notifications pour AFVN Nantes dans les réglages du téléphone." };
  }
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(CHANNEL, {
      name: "Rappels des cultes",
      // eslint-disable-next-line import/namespace -- exporté par expo-notifications (réexport non suivi par le lint)
      importance: Notifications.AndroidImportance.HIGH,
      lightColor: "#efb54a",
    });
  }
  await Notifications.cancelAllScheduledNotificationsAsync();
  for (const s of schedule) {
    if (!prefs[s.dayOfWeek]) continue;
    const [h, m] = s.start.split(":").map(Number);
    let minutes = h * 60 + m - LEAD_MINUTES;
    let weekday = WEEKDAY[s.dayOfWeek];
    if (minutes < 0) {
      minutes += 1440;
      weekday = weekday === 1 ? 7 : weekday - 1;
    }
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${s.title} dans ${LEAD_MINUTES} min`,
        body: `${s.day} à ${s.start.replace(":", "h")} · 69 bis, rue du Bêle — ou en direct sur YouTube.`,
        data: { url: "/live" },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday,
        hour: Math.floor(minutes / 60),
        minute: minutes % 60,
        channelId: CHANNEL,
      },
    });
  }
  await AsyncStorageLike.set(KEY, JSON.stringify(prefs));
  return { ok: true };
}
