import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Field, FormMessage } from "@/components/form";
import { MemberGate } from "@/components/member-gate";
import { Body, Btn, Card, Eyebrow, Screen, Section, Title } from "@/components/ui";
import { formatEventDate } from "@/lib/events";
import { isServant, isTrainer, type Member } from "@/lib/members";
import { openApp, tap } from "@/lib/open";
import { colors, fonts, space } from "@/lib/theme";
import { askQuestion, deleteQuestion, isYouTubeUrl, markAnsweredQ, moduleById, setSessionLink, watchQuestions, watchSession, type Question, type TrainingSession } from "@/lib/training";

export default function SessionScreen() {
  return <MemberGate allow={isServant}>{(m) => <Content member={m} />}</MemberGate>;
}

function Content({ member }: { member: Member }) {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [s, setS] = useState<TrainingSession | null | undefined>(undefined);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [text, setText] = useState("");
  const [link, setLink] = useState("");
  const [msg, setMsg] = useState<string>();
  const trainer = isTrainer(member);
  useEffect(() => watchSession(id, setS), [id]);
  useEffect(() => watchQuestions(id, setQuestions), [id]);
  if (s === undefined) return null;
  if (s === null) return <Body style={{ padding: space.lg }}>Cette session n&apos;existe plus.</Body>;

  const send = async () => {
    if (text.trim().length < 2) return;
    try {
      await askQuestion(s.id, member.uid, `${member.firstName} ${member.lastName}`, text);
      setText("");
    } catch {
      setMsg("Question non envoyée.");
    }
  };
  const saveLink = async () => {
    if (!isYouTubeUrl(link)) return setMsg("Collez le lien YouTube du direct (non répertorié).");
    await setSessionLink(s.id, link.trim());
    setMsg(undefined);
  };

  return (
    <Screen tabBar={false}>
      <Stack.Screen options={{ title: s.kind === "live" ? "Formation en direct" : "Petit groupe" }} />
      <Section style={{ marginTop: space.lg }}>
        <Eyebrow>{moduleById(s.moduleId)?.title ?? "Formation"}</Eyebrow>
        <Title as="h1" lead={s.title} size={30} />
        <Text style={styles.when}>{formatEventDate(s.startsAt).replace(/^./, (c) => c.toUpperCase())}</Text>
      </Section>

      <Section style={{ marginTop: space.lg }}>
        {s.kind === "live" ? (
          <Card tone="dark">
            <Ionicons name="radio-outline" size={26} color={colors.gold400} />
            <Text style={styles.liveTitle}>Direct de la formation</Text>
            <Text style={styles.liveText}>Diffusé en « non répertorié » : seuls les serviteurs ont ce lien. Posez vos questions ci-dessous pendant le direct.</Text>
            {s.youtubeUrl ? (
              <Btn label="Regarder le direct" icon="play" onPress={() => openApp(s.youtubeUrl!)} style={{ marginTop: 14 }} />
            ) : (
              <Text style={styles.liveText}>Le lien apparaîtra ici au début de la session.</Text>
            )}
          </Card>
        ) : (
          <Card tone="dark">
            <Ionicons name="people-outline" size={26} color={colors.gold400} />
            <Text style={styles.liveTitle}>Appel en petit groupe</Text>
            <Text style={styles.liveText}>Appel vidéo direct entre les téléphones, jusqu&apos;à 6 personnes. Rien n&apos;est enregistré.</Text>
            <Btn label="Rejoindre l'appel" icon="videocam-outline" onPress={() => router.push({ pathname: "/formation/appel/[id]", params: { id: s.id } })} style={{ marginTop: 14 }} />
          </Card>
        )}
        {trainer && s.kind === "live" ? (
          <View style={{ marginTop: space.md }}>
            <Field label="Lien YouTube du direct (non répertorié)" value={link} onChangeText={setLink} autoCapitalize="none" keyboardType="url" placeholder="https://youtube.com/live/…" />
            <Btn label="Publier le lien" variant="secondary" onPress={saveLink} style={{ marginTop: 10 }} />
          </View>
        ) : null}
        <FormMessage text={msg} />
      </Section>

      <Section>
        <Eyebrow>Questions ({questions.length})</Eyebrow>
        <View style={{ gap: 8, marginTop: space.md }}>
          {questions.map((q) => (
            <Card key={q.id} style={[{ padding: 14 }, q.answered && { opacity: 0.6 }]}>
              <Text style={styles.qName}>{q.name}</Text>
              <Text style={styles.qText}>{q.text}</Text>
              <View style={{ flexDirection: "row", gap: 16, marginTop: 6 }}>
                {trainer ? (
                  <Pressable accessibilityRole="button" onPress={() => { tap(); markAnsweredQ(s.id, q.id, !q.answered); }} style={styles.qAction}>
                    <Ionicons name={q.answered ? "checkmark-done" : "checkmark"} size={16} color={colors.gold700} />
                    <Text style={styles.qActionText}>{q.answered ? "Répondue" : "Marquer répondue"}</Text>
                  </Pressable>
                ) : q.answered ? (
                  <Text style={styles.qActionText}>✓ Répondue</Text>
                ) : null}
                {trainer || q.uid === member.uid ? (
                  <Pressable accessibilityRole="button" onPress={() => deleteQuestion(s.id, q.id)} style={styles.qAction}>
                    <Text style={[styles.qActionText, { color: colors.muted }]}>Supprimer</Text>
                  </Pressable>
                ) : null}
              </View>
            </Card>
          ))}
        </View>
        <TextInput value={text} onChangeText={setText} maxLength={600} multiline placeholder="Votre question pour le formateur" placeholderTextColor="#8a96a0" accessibilityLabel="Votre question" style={styles.input} />
        <Btn label="Envoyer ma question" icon="send-outline" onPress={send} style={{ marginTop: 10 }} />
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  when: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.gold700, marginTop: 8 },
  liveTitle: { fontFamily: fonts.display, fontSize: 21, color: colors.white, marginTop: 10 },
  liveText: { fontFamily: fonts.body, fontSize: 14.5, lineHeight: 21, color: "rgba(255,255,255,0.75)", marginTop: 6 },
  qName: { fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.gold700 },
  qText: { fontFamily: fonts.body, fontSize: 15.5, lineHeight: 22, color: colors.ink, marginTop: 4 },
  qAction: { flexDirection: "row", gap: 4, alignItems: "center", minHeight: 36 },
  qActionText: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.gold700 },
  input: { minHeight: 80, marginTop: space.lg, borderWidth: 1.5, borderColor: "rgba(17,41,59,0.2)", borderRadius: 16, padding: 14, fontFamily: fonts.body, fontSize: 16, color: colors.ink, backgroundColor: colors.white, textAlignVertical: "top" },
});
