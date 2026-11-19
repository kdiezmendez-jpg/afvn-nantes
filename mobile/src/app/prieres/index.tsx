import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { FormMessage } from "@/components/form";
import { MemberGate } from "@/components/member-gate";
import { Body, Btn, Card, Eyebrow, Screen, Section, Title } from "@/components/ui";
import type { Member } from "@/lib/members";
import { formatDate } from "@/lib/news";
import { tap } from "@/lib/open";
import { addPrayer, deletePrayer, markAnswered, statusLabels, watchMyPrayers, type Prayer } from "@/lib/prayers";
import { colors, fonts, space } from "@/lib/theme";

export default function MesPrieres() {
  return <MemberGate>{(m) => <Content member={m} />}</MemberGate>;
}

function Content({ member }: { member: Member }) {
  const [list, setList] = useState<Prayer[] | null>(null);
  const [text, setText] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [msg, setMsg] = useState<{ text: string; tone: "error" | "success" }>();

  useEffect(() => watchMyPrayers(member.uid, setList), [member.uid]);

  const send = async () => {
    if (text.trim().length < 3) return setMsg({ text: "Écrivez votre sujet de prière (quelques mots suffisent).", tone: "error" });
    try {
      await addPrayer(member.uid, `${member.firstName} ${member.lastName}`, text, anonymous);
      setText("");
      setMsg({ text: "Votre demande a été confiée à l'équipe de prière.", tone: "success" });
    } catch {
      setMsg({ text: "Envoi impossible. Vérifiez votre connexion.", tone: "error" });
    }
  };

  const answered = (p: Prayer) =>
    Alert.alert("Prière exaucée ?", "Rendez gloire à Dieu ! L'équipe de prière sera heureuse de l'apprendre.", [
      { text: "Annuler", style: "cancel" },
      { text: "Oui, exaucée", onPress: () => markAnswered(p.id) },
    ]);

  return (
    <Screen tabBar={false}>
      <Section style={{ marginTop: space.lg }}>
        <Eyebrow>Nous prions avec vous</Eyebrow>
        <Title as="h1" lead="Confier un sujet" accent="de prière." size={34} />
        <Body>Votre demande est lue uniquement par l&apos;équipe de prière de l&apos;église.</Body>
        <TextInput
          value={text}
          onChangeText={setText}
          multiline
          maxLength={1500}
          placeholder="Pour quoi pouvons-nous prier ?"
          placeholderTextColor="#8a96a0"
          accessibilityLabel="Votre sujet de prière"
          style={styles.input}
        />
        <Text style={styles.count}>{text.length} / 1500</Text>
        <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: anonymous }} onPress={() => { tap(); setAnonymous(!anonymous); }} style={styles.check}>
          <View style={[styles.box, anonymous && styles.boxOn]}>{anonymous ? <Ionicons name="checkmark" size={16} color={colors.night950} /> : null}</View>
          <Text style={styles.checkText}>Rester anonyme (l&apos;équipe ne verra pas votre nom)</Text>
        </Pressable>
        <FormMessage text={msg?.text} tone={msg?.tone} />
        <Btn label="Confier ma demande" icon="send-outline" onPress={send} style={{ marginTop: space.lg }} />
      </Section>

      <Section>
        <Eyebrow>Mes demandes</Eyebrow>
        {list?.length === 0 ? <Body>Vous n&apos;avez pas encore confié de demande.</Body> : null}
        <View style={{ gap: 12, marginTop: space.md }}>
          {(list ?? []).map((p) => (
            <Card key={p.id}>
              <View style={styles.row}>
                <View style={[styles.badge, p.status === "answered" ? styles.badgeOk : p.status === "praying" ? styles.badgePray : null]}>
                  <Text style={styles.badgeText}>{statusLabels[p.status]}</Text>
                </View>
                <Text style={styles.date}>{formatDate(p.createdAt)}</Text>
              </View>
              <Text style={styles.text}>{p.text}</Text>
              {p.prayedBy.length ? (
                <Text style={styles.support}>
                  🙏 {p.prayedBy.length} {p.prayedBy.length > 1 ? "personnes prient" : "personne prie"} pour vous
                </Text>
              ) : null}
              <View style={styles.actions}>
                {p.status !== "answered" ? <Btn label="Prière exaucée" variant="secondary" onPress={() => answered(p)} style={{ flex: 1, minHeight: 44 }} /> : null}
                <Pressable accessibilityRole="button" accessibilityLabel="Supprimer cette demande" hitSlop={8} onPress={() => Alert.alert("Supprimer cette demande ?", undefined, [{ text: "Annuler", style: "cancel" }, { text: "Supprimer", style: "destructive", onPress: () => deletePrayer(p.id) }])} style={styles.trash}>
                  <Ionicons name="trash-outline" size={20} color={colors.muted} />
                </Pressable>
              </View>
            </Card>
          ))}
        </View>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: { minHeight: 130, marginTop: space.lg, borderWidth: 1.5, borderColor: "rgba(17,41,59,0.2)", borderRadius: 16, padding: 14, fontFamily: fonts.body, fontSize: 16, lineHeight: 23, color: colors.ink, backgroundColor: colors.white, textAlignVertical: "top" },
  count: { fontFamily: fonts.body, fontSize: 12, color: colors.muted, textAlign: "right", marginTop: 4 },
  check: { flexDirection: "row", gap: 12, alignItems: "center", marginTop: space.md, minHeight: 44 },
  box: { width: 26, height: 26, borderRadius: 7, borderWidth: 1.5, borderColor: "rgba(17,41,59,0.35)", alignItems: "center", justifyContent: "center", backgroundColor: colors.white },
  boxOn: { backgroundColor: colors.gold400, borderColor: colors.gold400 },
  checkText: { flex: 1, fontFamily: fonts.body, fontSize: 15, color: colors.ink },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  badge: { backgroundColor: colors.sage, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  badgePray: { backgroundColor: colors.gold200 },
  badgeOk: { backgroundColor: "#d1fadf" },
  badgeText: { fontFamily: fonts.bodyBold, fontSize: 12, color: colors.ink },
  date: { fontFamily: fonts.body, fontSize: 12.5, color: colors.muted },
  text: { fontFamily: fonts.body, fontSize: 15.5, lineHeight: 23, color: colors.ink, marginTop: 10 },
  support: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.gold700, marginTop: 10 },
  actions: { flexDirection: "row", gap: 10, alignItems: "center", marginTop: 12 },
  trash: { width: 44, height: 44, alignItems: "center", justifyContent: "center", marginLeft: "auto" },
});
