import * as Haptics from "expo-haptics";
import * as WebBrowser from "expo-web-browser";
import { Linking, Platform } from "react-native";
import { site } from "@shared/site";

// Petite vibration au toucher (désactivée sur le web).
export function tap() {
  if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => {});
}

// Pages web (formulaires, mentions légales…) : navigateur intégré, sécurisé (Safari / Chrome).
export async function openWeb(url: string) {
  tap();
  if (Platform.OS === "web") return void window.open(url, "_blank", "noopener");
  await WebBrowser.openBrowserAsync(url, {
    toolbarColor: "#03141f",
    controlsColor: "#efb54a",
    presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
  }).catch(() => Linking.openURL(url));
}

// Applications externes (YouTube, Instagram, téléphone, plans) : ouvertes directement.
export function openApp(url: string) {
  tap();
  Linking.openURL(url).catch(() => {});
}

export const call = () => openApp(site.phone.href);

// Itinéraire dans l'application de plans du téléphone (Plans sur iPhone, Google Maps sur Android).
export function directions() {
  const q = encodeURIComponent(`${site.address.street}, ${site.address.postalCode} ${site.address.city}`);
  const url = Platform.select({
    ios: `https://maps.apple.com/?daddr=${q}`,
    android: `geo:0,0?q=${q}`,
    default: site.mapsUrl,
  });
  openApp(url!);
}

export const sitePage = (path: string) => openWeb(`${site.url}${path}`);
