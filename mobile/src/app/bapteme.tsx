import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { FormMessage } from "@/components/form";
import { MemberGate } from "@/components/member-gate";
import { Body, Btn, Card, Eyebrow, Photo, Screen, Section, Title } from "@/components/ui";
import { baptismFlow, baptismStatusLabels, cancelBaptism, preparationSteps, requestBaptism, watchMyBaptism, type Baptism } from "@/lib/baptism";
import { formatEventDate } from "@/lib/events";
import type { Member } from "@/lib/members";
import { photos } from "@/lib/photos";
import { colors, fonts, space } from "@/lib/theme";

export default function Bapteme() {
  return <MemberGate>{(m) => <Content member={m} />}</MemberGate>;
}

function Content({ member }: { member: Member }) {
  const [b, setB] = useState<Baptism | null | undefined>(undefined);
  const [motivation, setMotivation] = useState("");
  const [error, setError] = useState<string>();
  useEffect(() => watchMyBaptism(member.uid, setB), [member.uid]);

  const send = async () => {
    if (motivation.trim().length < 10) return setError("Expliquez en quelques phrases votre démarche (10 caractères minimum).");
    try {
      await requestBaptism(member.uid, `${member.firstName} ${member.lastName}`, motivation);
    } catch {
      setError("Envoi impossible. Vérifiez votre connexion.");
    }
  };

  if (b === undefined) return null;

  if (!b || b.status === "cancelled") {
    return (
      <Screen tabBar={false}>
        <Photo source={photos.bapteme} height={230} radius={0} style={{ marginHorizontal: -space.lg, width: undefined }} alt="Baptême par immersion" />
        <Section style={{ marginTop: space.lg }}>
          <Eyebrow>Mon baptême</Eyebrow>
          <Title as="h1" lead="Faire le pas" accent="du baptême." size={34} />
          <Body>
            Le baptême est un engagement public à suivre Jésus. L&apos;église vous accompagne : un entretien avec le pasteur, quelques temps de préparation, puis la célébration.
          </Body>
          <Text style={styles.verse}>« Allez, faites de toutes les nations des disciples, les baptisant au nom du Père, du Fils et du Saint-Esprit. » — Matthieu 28:19</Text>
          <TextInput value={motivation} onChangeText={setMotivation} multiline maxLength={3000} placeholder="Pourquoi souhaitez-vous être baptisé(e) ? Parlez-nous de votre cheminement." placeholderTextColor="#8a96a0" accessibilityLabel="Votre démarche" style={styles.input} />
          <FormMessage text={error} />
          <Btn label="Demander le baptême" icon="water-outline" onPress={send} style={{ marginTop: space.lg }} />
        </Section>
      </Screen>
    );
  }

  const current = baptismFlow.indexOf(b.status);
  return (
    <Screen tabBar={false}>
      <Section style={{ marginTop: space.lg }}>
        <Eyebrow>Mon parcours de baptême</Eyebrow>
        <Title as="h1" lead={b.status === "baptized" ? "Gloire à Dieu," : "Votre parcours"} accent={b.status === "baptized" ? "vous êtes baptisé(e) !" : "avance."} size={32} />
        {b.status === "scheduled" && b.scheduledAt ? (
          <Card tone="dark" style={{ marginTop: space.lg }}>
            <Text style={styles.kicker}>Date de votre baptême</Text>
            <Text style={styles.big}>{formatEventDate(b.scheduledAt)}</Text>
          </Card>
        ) : null}
        {b.leaderMessage ? (
          <Card style={{ marginTop: space.md, backgroundColor: colors.gold200, borderColor: colors.gold200 }}>
            <Text style={styles.kickerLight}>Message de l&apos;équipe</Text>
            <Text style={styles.message}>{b.leaderMessage}</Text>
          </Card>
        ) : null}
        <View style={styles.flow}>
          {baptismFlow.map((s, i) => (
            <View key={s} style={styles.flowRow}>
              <View style={[styles.dot, i <= current && styles.dotOn]}>{i < current ? <Ionicons name="checkmark" size={14} color={colors.night950} /> : null}</View>
              <Text style={[styles.flowText, i === current && { fontFamily: fonts.bodyBold, color: colors.ink }]}>{baptismStatusLabels[s]}</Text>
            </View>
          ))}
        </View>
      </Section>
      <Section>
        <Eyebrow>Préparation</Eyebrow>
        <View style={{ gap: 10, marginTop: space.md }}>
          {preparationSteps.map((p) => {
            const done = b.steps.includes(p.id);
            return (
              <Card key={p.id} style={done ? { borderColor: "#abefc6" } : undefined}>
                <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                  <Ionicons name={done ? "checkmark-circle" : "ellipse-outline"} size={22} color={done ? "#12b76a" : colors.muted} />
                  <Text style={styles.stepTitle}>{p.title}</Text>
                </View>
                <Text style={styles.stepText}>{p.text}</Text>
                {p.verse ? <Text style={styles.verse}>{p.verse}</Text> : null}
              </Card>
            );
          })}
        </View>
        {b.status !== "baptized" ? (
          <Btn label="Annuler ma demande" variant="secondary" onPress={() => Alert.alert("Annuler votre demande de baptême ?", "Vous pourrez en refaire une plus tard.", [{ text: "Non", style: "cancel" }, { text: "Oui, annuler", style: "destructive", onPress: () => cancelBaptism(member.uid) }])} style={{ marginTop: space.lg }} />
        ) : null}
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  verse: { fontFamily: fonts.displayItalic, fontSize: 15.5, lineHeight: 23, color: colors.gold700, marginTop: 12 },
  input: { minHeight: 140, marginTop: space.lg, borderWidth: 1.5, borderColor: "rgba(17,41,59,0.2)", borderRadius: 16, padding: 14, fontFamily: fonts.body, fontSize: 16, lineHeight: 23, color: colors.ink, backgroundColor: colors.white, textAlignVertical: "top" },
  kicker: { fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: colors.gold400 },
  kickerLight: { fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: colors.gold700 },
  big: { fontFamily: fonts.display, fontSize: 24, color: colors.white, marginTop: 6 },
  message: { fontFamily: fonts.body, fontSize: 15.5, lineHeight: 23, color: colors.ink, marginTop: 6 },
  flow: { marginTop: space.xl, gap: 14 },
  flowRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  dot: { width: 26, height: 26, borderRadius: 13, borderWidth: 1.5, borderColor: colors.line, alignItems: "center", justifyContent: "center", backgroundColor: colors.white },
  dotOn: { backgroundColor: colors.gold400, borderColor: colors.gold400 },
  flowText: { fontFamily: fonts.body, fontSize: 16, color: colors.muted },
  stepTitle: { flex: 1, fontFamily: fonts.display, fontSize: 19, color: colors.ink },
  stepText: { fontFamily: fonts.body, fontSize: 14.5, lineHeight: 21, color: colors.muted, marginTop: 6 },
});
