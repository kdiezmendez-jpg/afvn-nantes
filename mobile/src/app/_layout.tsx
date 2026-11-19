import { DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from "@expo-google-fonts/dm-sans";
import { PlayfairDisplay_500Medium_Italic, PlayfairDisplay_600SemiBold } from "@expo-google-fonts/playfair-display";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import { AuthProvider } from "@/lib/auth";
import { colors, fonts } from "@/lib/theme";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_500Medium_Italic,
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync().catch(() => {});
  }, [loaded, error]);

  // Toucher un rappel de culte ouvre l'onglet Live.
  useEffect(() => {
    if (Platform.OS === "web") return;
    const sub = Notifications.addNotificationResponseReceivedListener((r) => {
      const url = r.notification.request.content.data?.url;
      if (typeof url === "string" && url.startsWith("/")) router.push(url as never);
    });
    return () => sub.remove();
  }, []);

  if (!loaded && !error) return null;

  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.night950 },
          headerTintColor: colors.gold400,
          headerTitleStyle: { fontFamily: fonts.display, color: colors.white },
          headerBackButtonDisplayMode: "minimal",
          contentStyle: { backgroundColor: colors.cream },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="nouveau" options={{ title: "Je suis nouveau" }} />
        <Stack.Screen name="donner" options={{ title: "Donner" }} />
        <Stack.Screen name="evenement/[slug]" options={{ title: "Temps fort" }} />
        <Stack.Screen name="reglages" options={{ title: "Réglages", presentation: "modal" }} />
        <Stack.Screen name="priere" options={{ title: "Prière" }} />
        <Stack.Screen name="connexion" options={{ title: "Connexion" }} />
        <Stack.Screen name="inscription" options={{ title: "Créer un compte" }} />
        <Stack.Screen name="mot-de-passe" options={{ title: "Mot de passe oublié" }} />
        <Stack.Screen name="compte" options={{ title: "Mon compte" }} />
        <Stack.Screen name="admin/membres" options={{ title: "Membres" }} />
        <Stack.Screen name="prieres/index" options={{ title: "Mes prières" }} />
        <Stack.Screen name="prieres/equipe" options={{ title: "Équipe de prière" }} />
        <Stack.Screen name="actualites/index" options={{ title: "Actualités" }} />
        <Stack.Screen name="actualites/nouvelle" options={{ title: "Publier", presentation: "modal" }} />
        <Stack.Screen name="evenements/index" options={{ title: "Événements" }} />
        <Stack.Screen name="evenements/[id]" options={{ title: "Événement" }} />
        <Stack.Screen name="evenements/nouveau" options={{ title: "Nouvel événement", presentation: "modal" }} />
        <Stack.Screen name="bapteme" options={{ title: "Mon baptême" }} />
        <Stack.Screen name="admin/baptemes" options={{ title: "Baptêmes" }} />
        <Stack.Screen name="formation/index" options={{ title: "Formation" }} />
        <Stack.Screen name="formation/[module]" options={{ title: "Module" }} />
        <Stack.Screen name="formation/session/[id]" options={{ title: "Session" }} />
        <Stack.Screen name="formation/nouvelle-session" options={{ title: "Nouvelle session", presentation: "modal" }} />
        <Stack.Screen name="formation/suivi" options={{ title: "Suivi" }} />
        <Stack.Screen name="ministeres/index" options={{ title: "Ministères" }} />
        <Stack.Screen name="ministeres/[id]" options={{ title: "Ministère" }} />
        <Stack.Screen name="annuaire" options={{ title: "Annuaire" }} />
        <Stack.Screen name="messages/index" options={{ title: "Messages" }} />
        <Stack.Screen name="messages/[id]" options={{ title: "Message" }} />
        <Stack.Screen name="admin/signalements" options={{ title: "Signalements" }} />
      </Stack>
    </AuthProvider>
  );
}
