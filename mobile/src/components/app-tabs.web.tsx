import Ionicons from "@expo/vector-icons/Ionicons";
import { TabList, TabSlot, TabTrigger, Tabs, type TabTriggerSlotProps } from "expo-router/ui";
import type { ComponentProps } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors, fonts } from "@/lib/theme";

// Version web (aperçu dans un navigateur) : barre d'onglets en bas, comme sur mobile.
const tabs: { name: string; href: "/" | "/agenda" | "/live" | "/espace" | "/eglise"; label: string; icon: ComponentProps<typeof Ionicons>["name"] }[] = [
  { name: "index", href: "/", label: "Accueil", icon: "home-outline" },
  { name: "agenda", href: "/agenda", label: "Agenda", icon: "calendar-outline" },
  { name: "live", href: "/live", label: "Live", icon: "play-circle-outline" },
  { name: "espace", href: "/espace", label: "Espace", icon: "person-circle-outline" },
  { name: "eglise", href: "/eglise", label: "Église", icon: "people-outline" },
];

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ flex: 1 }} />
      <TabList style={styles.bar}>
        {tabs.map((t) => (
          <TabTrigger key={t.name} name={t.name} href={t.href} asChild>
            <TabButton icon={t.icon} label={t.label} />
          </TabTrigger>
        ))}
      </TabList>
    </Tabs>
  );
}

function TabButton({ isFocused, icon, label, ref, ...props }: TabTriggerSlotProps & { icon: ComponentProps<typeof Ionicons>["name"]; label: string }) {
  const color = isFocused ? colors.gold700 : colors.muted;
  return (
    <Pressable {...props} style={styles.btn}>
      <Ionicons name={icon} size={22} color={color} />
      <Text style={[styles.label, { color: isFocused ? colors.ink : colors.muted }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: "row", backgroundColor: colors.white, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line, paddingBottom: 6 },
  btn: { flex: 1, alignItems: "center", paddingVertical: 8, gap: 2 },
  label: { fontFamily: fonts.bodyMedium, fontSize: 11 },
});
