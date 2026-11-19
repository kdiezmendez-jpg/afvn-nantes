import { NativeTabs } from "expo-router/native-tabs";
import { colors } from "@/lib/theme";

// Barre d'onglets native : SwiftUI sur iPhone (verre liquide sur iOS 26), Material sur Android.
export default function AppTabs() {
  return (
    <NativeTabs tintColor={colors.gold700} iconColor={{ default: colors.muted, selected: colors.gold700 }} labelStyle={{ selected: { color: colors.ink } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Accueil</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: "house", selected: "house.fill" }} md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="agenda">
        <NativeTabs.Trigger.Label>Agenda</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: "calendar", selected: "calendar" }} md="calendar_month" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="live">
        <NativeTabs.Trigger.Label>Live</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: "play.circle", selected: "play.circle.fill" }} md="play_circle" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="espace">
        <NativeTabs.Trigger.Label>Espace</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: "person.crop.circle", selected: "person.crop.circle.fill" }} md="account_circle" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="eglise">
        <NativeTabs.Trigger.Label>Église</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: "person.3", selected: "person.3.fill" }} md="groups" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
