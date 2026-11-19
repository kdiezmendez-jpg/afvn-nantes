import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MemberGate } from "@/components/member-gate";
import { Body, Btn, Eyebrow, Screen, Section, Title } from "@/components/ui";
import { watchBlocked, watchConversations, type Conversation } from "@/lib/community";
import type { Member } from "@/lib/members";
import { formatDate } from "@/lib/news";
import { tap } from "@/lib/open";
import { colors, fonts, space } from "@/lib/theme";

export default function Messages() {
  return <MemberGate>{(m) => <Content member={m} />}</MemberGate>;
}

function Content({ member }: { member: Member }) {
  const [list, setList] = useState<Conversation[] | null>(null);
  const [blocked, setBlocked] = useState<string[]>([]);
  useEffect(() => watchConversations(member.uid, setList), [member.uid]);
  useEffect(() => watchBlocked(member.uid, setBlocked), [member.uid]);
  const shown = (list ?? []).filter((c) => !c.members.some((u) => u !== member.uid && blocked.includes(u)));

  return (
    <Screen tabBar={false}>
      <Section style={{ marginTop: space.lg }}>
        <Eyebrow>Messagerie</Eyebrow>
        <Title as="h1" lead="Mes" accent="messages." size={34} />
        <Btn label="Écrire à un membre" icon="create-outline" variant="secondary" onPress={() => router.push("/annuaire")} style={{ marginTop: space.lg }} />
      </Section>
      <View style={{ gap: 8, marginTop: space.lg }}>
        {list && shown.length === 0 ? <Body>Aucune conversation pour le moment.</Body> : null}
        {shown.map((c) => {
          const other = c.members.find((u) => u !== member.uid)!;
          return (
            <Pressable key={c.id} accessibilityRole="button" onPress={() => { tap(); router.push({ pathname: "/messages/[id]", params: { id: c.id } }); }} style={({ pressed }) => [styles.row, pressed && { backgroundColor: "#efe8da" }]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{c.names[other]}</Text>
                <Text style={styles.last} numberOfLines={1}>
                  {c.lastText || "Nouvelle conversation"}
                </Text>
              </View>
              <Text style={styles.date}>{formatDate(c.updatedAt)}</Text>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: colors.white, borderRadius: 16, padding: 14, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  name: { fontFamily: fonts.bodyBold, fontSize: 15.5, color: colors.ink },
  last: { fontFamily: fonts.body, fontSize: 14, color: colors.muted, marginTop: 2 },
  date: { fontFamily: fonts.body, fontSize: 11.5, color: colors.muted },
});
