import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { MemberGate } from "@/components/member-gate";
import { Body, Btn, Card, Eyebrow, Screen, Section, Title } from "@/components/ui";
import { isLeader, isServant, type Member } from "@/lib/members";
import { deleteNews, formatDate, setPinned, watchNews, type News } from "@/lib/news";
import { colors, fonts, space } from "@/lib/theme";

export default function Actualites() {
  return <MemberGate>{(m) => <Content member={m} />}</MemberGate>;
}

function Content({ member }: { member: Member }) {
  const [list, setList] = useState<News[] | null>(null);
  const servant = isServant(member);
  const leader = isLeader(member);
  useEffect(() => watchNews(servant, setList), [servant]);

  return (
    <Screen tabBar={false}>
      <Section style={{ marginTop: space.lg }}>
        <Eyebrow>Vie de l&apos;église</Eyebrow>
        <Title as="h1" lead="Les" accent="actualités." size={36} />
        {leader ? <Btn label="Publier une actualité" icon="add" onPress={() => router.push("/actualites/nouvelle")} style={{ marginTop: space.lg }} /> : null}
      </Section>
      <View style={{ gap: 12, marginTop: space.lg }}>
        {list?.length === 0 ? <Body>Aucune actualité pour le moment.</Body> : null}
        {(list ?? []).map((n) => (
          <Card key={n.id} style={n.pinned ? { borderColor: colors.gold400, borderWidth: 1.5 } : undefined}>
            <View style={styles.row}>
              <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
                {n.pinned ? <Ionicons name="pin" size={14} color={colors.gold700} /> : null}
                {n.audience === "servants" ? <Text style={styles.tag}>Serviteurs</Text> : null}
              </View>
              <Text style={styles.date}>{formatDate(n.createdAt)}</Text>
            </View>
            <Text style={styles.title}>{n.title}</Text>
            <Text style={styles.body}>{n.body}</Text>
            <Text style={styles.author}>— {n.authorName}</Text>
            {leader ? (
              <View style={styles.admin}>
                <Pressable accessibilityRole="button" onPress={() => setPinned(n.id, !n.pinned, n)} style={styles.adminBtn}>
                  <Ionicons name={n.pinned ? "pin" : "pin-outline"} size={18} color={colors.muted} />
                  <Text style={styles.adminText}>{n.pinned ? "Désépingler" : "Épingler"}</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => Alert.alert("Supprimer cette actualité ?", undefined, [{ text: "Annuler", style: "cancel" }, { text: "Supprimer", style: "destructive", onPress: () => deleteNews(n.id) }])}
                  style={styles.adminBtn}
                >
                  <Ionicons name="trash-outline" size={18} color={colors.muted} />
                  <Text style={styles.adminText}>Supprimer</Text>
                </Pressable>
              </View>
            ) : null}
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", minHeight: 20 },
  tag: { fontFamily: fonts.bodyBold, fontSize: 11.5, color: colors.ink, backgroundColor: colors.gold200, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2, overflow: "hidden" },
  date: { fontFamily: fonts.body, fontSize: 12.5, color: colors.muted },
  title: { fontFamily: fonts.display, fontSize: 22, color: colors.ink, marginTop: 8 },
  body: { fontFamily: fonts.body, fontSize: 15.5, lineHeight: 23, color: colors.ink, marginTop: 8 },
  author: { fontFamily: fonts.bodyMedium, fontSize: 13.5, color: colors.muted, marginTop: 10 },
  admin: { flexDirection: "row", gap: 16, marginTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line, paddingTop: 8 },
  adminBtn: { flexDirection: "row", gap: 6, alignItems: "center", minHeight: 44 },
  adminText: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.muted },
});
