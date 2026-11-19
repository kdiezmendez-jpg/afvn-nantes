import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { MemberGate } from "@/components/member-gate";
import { Body, Btn, Card, Eyebrow, Screen, Section, Title } from "@/components/ui";
import { isPrayerTeam, type Member } from "@/lib/members";
import { formatDate } from "@/lib/news";
import { prayFor, teamStatusLabels, watchTeamPrayers, type Prayer } from "@/lib/prayers";
import { colors, fonts, space } from "@/lib/theme";

export default function EquipePriere() {
  return <MemberGate allow={isPrayerTeam}>{(m) => <Content member={m} />}</MemberGate>;
}

function Content({ member }: { member: Member }) {
  const [list, setList] = useState<Prayer[] | null>(null);
  const [filter, setFilter] = useState<"open" | "answered">("open");
  useEffect(() => watchTeamPrayers(setList), []);
  const shown = (list ?? []).filter((p) => (filter === "open" ? p.status !== "answered" : p.status === "answered"));

  return (
    <Screen tabBar={false}>
      <Section style={{ marginTop: space.lg }}>
        <Eyebrow>Équipe de prière</Eyebrow>
        <Title as="h1" lead="Porter les" accent="demandes." size={34} />
        <Body>Ces demandes sont confidentielles : ne les partagez pas en dehors de l&apos;équipe.</Body>
        <View style={styles.tabs}>
          <Btn label="À porter" variant={filter === "open" ? "primary" : "secondary"} onPress={() => setFilter("open")} style={{ flex: 1, minHeight: 44 }} />
          <Btn label="Exaucées" variant={filter === "answered" ? "primary" : "secondary"} onPress={() => setFilter("answered")} style={{ flex: 1, minHeight: 44 }} />
        </View>
      </Section>
      <View style={{ gap: 12, marginTop: space.lg }}>
        {list && shown.length === 0 ? <Body>Aucune demande ici pour le moment.</Body> : null}
        {shown.map((p) => {
          const mine = p.prayedBy.includes(member.uid);
          return (
            <Card key={p.id}>
              <View style={styles.row}>
                <Text style={styles.author}>{p.anonymous ? "Anonyme" : p.authorName}</Text>
                <Text style={styles.date}>{formatDate(p.createdAt)}</Text>
              </View>
              <Text style={styles.text}>{p.text}</Text>
              {p.testimony ? <Text style={styles.testimony}>Témoignage : {p.testimony}</Text> : null}
              <View style={styles.row}>
                <Text style={styles.meta}>
                  {teamStatusLabels[p.status]} · {p.prayedBy.length} {p.prayedBy.length > 1 ? "intercesseurs" : "intercesseur"}
                </Text>
              </View>
              <Btn label={mine ? "Vous priez ✓" : "Je prie pour cette demande"} variant={mine ? "secondary" : "primary"} onPress={() => (mine ? undefined : prayFor(p, member.uid))} style={{ marginTop: 12, minHeight: 46 }} />
            </Card>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: "row", gap: 10, marginTop: space.lg },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 4 },
  author: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.ink },
  date: { fontFamily: fonts.body, fontSize: 12.5, color: colors.muted },
  text: { fontFamily: fonts.body, fontSize: 15.5, lineHeight: 23, color: colors.ink, marginTop: 10 },
  testimony: { fontFamily: fonts.displayItalic, fontSize: 15, lineHeight: 22, color: colors.gold700, marginTop: 10 },
  meta: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.muted, marginTop: 8 },
});
