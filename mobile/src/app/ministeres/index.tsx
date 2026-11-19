import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MemberGate } from "@/components/member-gate";
import { Body, Btn, Eyebrow, Screen, Section, Title } from "@/components/ui";
import { createDefaultMinistries, watchMinistries, type Ministry } from "@/lib/community";
import { isLeader, type Member } from "@/lib/members";
import { tap } from "@/lib/open";
import { colors, fonts, space } from "@/lib/theme";

export default function Ministeres() {
  return <MemberGate>{(m) => <Content member={m} />}</MemberGate>;
}

function Content({ member }: { member: Member }) {
  const [list, setList] = useState<Ministry[] | null>(null);
  useEffect(() => watchMinistries(setList), []);
  return (
    <Screen tabBar={false}>
      <Section style={{ marginTop: space.lg }}>
        <Eyebrow>Une place pour chacun</Eyebrow>
        <Title as="h1" lead="Ministères &" accent="groupes." size={34} />
        <Body>Rejoignez un ministère pour servir et échanger avec votre groupe.</Body>
        {list?.length === 0 && isLeader(member) ? <Btn label="Créer les ministères de l'église" icon="add" onPress={createDefaultMinistries} style={{ marginTop: space.lg }} /> : null}
        {list?.length === 0 && !isLeader(member) ? <Body>Les ministères seront bientôt ouverts.</Body> : null}
      </Section>
      <View style={{ gap: 10, marginTop: space.lg }}>
        {(list ?? []).map((m) => (
          <Pressable key={m.id} accessibilityRole="button" onPress={() => { tap(); router.push({ pathname: "/ministeres/[id]", params: { id: m.id } }); }} style={({ pressed }) => [styles.card, pressed && { backgroundColor: "#efe8da" }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{m.name}</Text>
              <Text style={styles.desc}>{m.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.muted} />
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: colors.white, borderRadius: 18, padding: 16, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  name: { fontFamily: fonts.display, fontSize: 20, color: colors.ink },
  desc: { fontFamily: fonts.body, fontSize: 14, color: colors.muted, marginTop: 2 },
});
