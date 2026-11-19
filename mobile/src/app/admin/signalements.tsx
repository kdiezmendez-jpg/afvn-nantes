import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { MemberGate } from "@/components/member-gate";
import { Body, Btn, Card, Eyebrow, Screen, Section, Title } from "@/components/ui";
import { closeReport, deleteReportedContent, reasonLabels, watchReports, type Report } from "@/lib/community";
import { isAdmin, setMemberStatus } from "@/lib/members";
import { formatDate } from "@/lib/news";
import { colors, fonts, space } from "@/lib/theme";

export default function Signalements() {
  return <MemberGate allow={isAdmin}>{() => <Content />}</MemberGate>;
}

function Content() {
  const [list, setList] = useState<Report[] | null>(null);
  useEffect(() => watchReports(setList), []);

  const removeContent = (r: Report) =>
    Alert.alert("Supprimer ce contenu ?", r.excerpt, [
      { text: "Annuler", style: "cancel" },
      { text: "Supprimer", style: "destructive", onPress: () => deleteReportedContent(r.targetPath).catch(() => {}).then(() => closeReport(r.id)) },
    ]);
  const suspend = (r: Report) =>
    Alert.alert("Suspendre l'auteur ?", "Il ne pourra plus accéder à l'espace membre jusqu'à sa réactivation (Gérer les membres).", [
      { text: "Annuler", style: "cancel" },
      { text: "Suspendre", style: "destructive", onPress: () => setMemberStatus(r.targetUid, "suspended").then(() => closeReport(r.id)) },
    ]);

  return (
    <Screen tabBar={false}>
      <Section style={{ marginTop: space.lg }}>
        <Eyebrow>Modération</Eyebrow>
        <Title as="h1" lead="Contenus" accent="signalés." size={34} />
        <Body>Traitez chaque signalement sous 24 heures, comme l&apos;exigent l&apos;App Store et Google Play.</Body>
        {list?.length === 0 ? <Body>Aucun signalement en attente. 🙏</Body> : null}
      </Section>
      <View style={{ gap: 12, marginTop: space.lg }}>
        {(list ?? []).map((r) => (
          <Card key={r.id}>
            <Text style={styles.reason}>
              {reasonLabels[r.reason]} · {formatDate(r.createdAt)}
            </Text>
            <Text style={styles.excerpt}>« {r.excerpt} »</Text>
            <View style={{ gap: 8, marginTop: 12 }}>
              <Btn label="Supprimer le contenu" onPress={() => removeContent(r)} style={{ minHeight: 44 }} />
              <Btn label="Suspendre l'auteur" variant="secondary" onPress={() => suspend(r)} style={{ minHeight: 44 }} />
              <Btn label="Classer sans suite" variant="secondary" onPress={() => closeReport(r.id)} style={{ minHeight: 44 }} />
            </View>
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  reason: { fontFamily: fonts.bodyBold, fontSize: 13, color: "#b42318" },
  excerpt: { fontFamily: fonts.body, fontSize: 15.5, lineHeight: 22, color: colors.ink, marginTop: 8 },
});
