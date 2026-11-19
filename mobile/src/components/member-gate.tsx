import { router } from "expo-router";
import type { ReactNode } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "@/lib/auth";
import type { Member } from "@/lib/members";
import { colors, space } from "@/lib/theme";
import { Body, Btn } from "./ui";

// Affiche l'écran seulement pour un membre validé qui remplit la condition (rôle).
export function MemberGate({ allow = () => true, children }: { allow?: (m: Member) => boolean; children: (m: Member) => ReactNode }) {
  const { ready, member } = useAuth();
  if (!ready) return <ActivityIndicator color={colors.gold700} style={{ marginTop: 48 }} />;
  if (!member || member.status !== "active" || !allow(member)) {
    return (
      <View style={{ padding: space.lg }}>
        <Body>Cet espace est réservé aux membres validés{member?.status === "active" ? " ayant ce rôle" : ""}.</Body>
        <Btn label="Aller à mon espace" onPress={() => router.replace("/espace")} style={{ marginTop: space.lg }} />
      </View>
    );
  }
  return <>{children(member)}</>;
}
