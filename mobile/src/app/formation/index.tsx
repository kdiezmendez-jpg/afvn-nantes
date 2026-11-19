import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MemberGate } from "@/components/member-gate";
import { Body, Btn, Eyebrow, RowLink, Screen, Section, Title } from "@/components/ui";
import { formatEventDate } from "@/lib/events";
import { isServant, isTrainer, type Member } from "@/lib/members";
import { tap } from "@/lib/open";
import { colors, fonts, space } from "@/lib/theme";
import { course, watchProgress, watchSessions, type TrainingSession } from "@/lib/training";

export default function Formation() {
  return <MemberGate allow={isServant}>{(m) => <Content member={m} />}</MemberGate>;
}

function ModuleCard({ member, m, index }: { member: Member; m: (typeof course.modules)[number]; index: number }) {
  const [done, setDone] = useState<string[]>([]);
  useEffect(() => watchProgress(member.uid, m.id, setDone), [member.uid, m.id]);
  const pct = Math.round((done.length / m.lessons.length) * 100);
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`Module ${index + 1}, ${m.title}, ${pct} % terminé`} onPress={() => { tap(); router.push({ pathname: "/formation/[module]", params: { module: m.id } }); }} style={({ pressed }) => [styles.card, pressed && { backgroundColor: "#efe8da" }]}>
      <Text style={styles.kicker}>Module {index + 1}</Text>
      <Text style={styles.title}>{m.title}</Text>
      <Text style={styles.meta}>
        {m.lessons.length} leçons · {done.length} terminée{done.length > 1 ? "s" : ""}
      </Text>
      <View style={styles.bar}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
      </View>
    </Pressable>
  );
}

function Content({ member }: { member: Member }) {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  useEffect(() => watchSessions(setSessions), []);
  const trainer = isTrainer(member);

  return (
    <Screen tabBar={false}>
      <Section style={{ marginTop: space.lg }}>
        <Eyebrow>Formation des serviteurs</Eyebrow>
        <Title as="h1" lead={course.title.split(" ").slice(0, 2).join(" ")} accent={course.title.split(" ").slice(2).join(" ")} size={32} />
        <Body>{course.subtitle} : comprendre et vivre un ministère qui touche toute la personne.</Body>
      </Section>
      {trainer ? (
        <Section style={{ marginTop: space.lg }}>
          <View style={{ gap: 10 }}>
            <RowLink icon="videocam-outline" title="Programmer une session" subtitle="Direct YouTube ou petit groupe" onPress={() => router.push("/formation/nouvelle-session")} />
            <RowLink icon="stats-chart-outline" title="Suivi des serviteurs" subtitle="Progression par module" onPress={() => router.push("/formation/suivi")} />
          </View>
        </Section>
      ) : null}
      <Section style={{ marginTop: space.xl }}>
        <Eyebrow>Prochaines sessions</Eyebrow>
        {sessions.length === 0 ? <Body>Aucune session programmée pour le moment.</Body> : null}
        <View style={{ gap: 10, marginTop: space.md }}>
          {sessions.map((s) => (
            <Pressable key={s.id} accessibilityRole="button" onPress={() => { tap(); router.push({ pathname: "/formation/session/[id]", params: { id: s.id } }); }} style={styles.session}>
              <Ionicons name={s.kind === "live" ? "radio-outline" : "people-outline"} size={22} color={colors.gold400} />
              <View style={{ flex: 1 }}>
                <Text style={styles.sessionTitle}>{s.title}</Text>
                <Text style={styles.sessionMeta}>
                  {s.kind === "live" ? "Direct" : "Petit groupe"} · {formatEventDate(s.startsAt)}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.5)" />
            </Pressable>
          ))}
        </View>
      </Section>
      <Section>
        <Eyebrow>Modules</Eyebrow>
        <View style={{ gap: 12, marginTop: space.md }}>
          {course.modules.map((m, i) => (
            <ModuleCard key={m.id} member={member} m={m} index={i} />
          ))}
        </View>
        <Text style={styles.attribution}>{course.attribution}</Text>
        {trainer ? <Btn label="Gérer les membres et formateurs" variant="secondary" onPress={() => router.push("/admin/membres")} style={{ marginTop: space.md }} /> : null}
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: 20, padding: 18, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  kicker: { fontFamily: fonts.bodyBold, fontSize: 11.5, letterSpacing: 2, textTransform: "uppercase", color: colors.gold700 },
  title: { fontFamily: fonts.display, fontSize: 22, color: colors.ink, marginTop: 6 },
  meta: { fontFamily: fonts.body, fontSize: 14, color: colors.muted, marginTop: 6 },
  bar: { height: 8, borderRadius: 4, backgroundColor: colors.sage, marginTop: 12, overflow: "hidden" },
  fill: { height: 8, backgroundColor: colors.gold400 },
  session: { flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: colors.night900, borderRadius: 16, padding: 16 },
  sessionTitle: { fontFamily: fonts.bodyBold, fontSize: 15.5, color: colors.white },
  sessionMeta: { fontFamily: fonts.body, fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 2 },
  attribution: { fontFamily: fonts.body, fontSize: 11.5, lineHeight: 17, color: colors.muted, marginTop: space.lg },
});
