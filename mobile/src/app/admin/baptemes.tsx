import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Field, FormMessage } from "@/components/form";
import { MemberGate } from "@/components/member-gate";
import { Body, Btn, Card, Eyebrow, Screen, Section, Title } from "@/components/ui";
import { baptismFlow, baptismStatusLabels, preparationSteps, updateBaptism, watchAllBaptisms, type Baptism, type BaptismStatus } from "@/lib/baptism";
import { formatEventDate, parseDateTime } from "@/lib/events";
import { isLeader } from "@/lib/members";
import { tap } from "@/lib/open";
import { colors, fonts, space } from "@/lib/theme";

export default function AdminBaptemes() {
  return <MemberGate allow={isLeader}>{() => <Content />}</MemberGate>;
}

function Content() {
  const [list, setList] = useState<Baptism[] | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  useEffect(() => watchAllBaptisms(setList), []);
  const active = (list ?? []).filter((b) => b.status !== "cancelled");

  return (
    <Screen tabBar={false}>
      <Section style={{ marginTop: space.lg }}>
        <Eyebrow>Accompagnement</Eyebrow>
        <Title as="h1" lead="Demandes de" accent="baptême." size={34} />
        {list && active.length === 0 ? <Body>Aucune demande en cours.</Body> : null}
      </Section>
      <View style={{ gap: 12, marginTop: space.lg }}>
        {active.map((b) => (
          <Card key={b.uid}>
            <Pressable accessibilityRole="button" onPress={() => { tap(); setOpen(open === b.uid ? null : b.uid); }}>
              <Text style={styles.name}>{b.name}</Text>
              <Text style={styles.status}>
                {baptismStatusLabels[b.status]}
                {b.scheduledAt ? ` · ${formatEventDate(b.scheduledAt)}` : ""}
              </Text>
            </Pressable>
            {open === b.uid ? <Editor b={b} /> : null}
          </Card>
        ))}
      </View>
    </Screen>
  );
}

function Editor({ b }: { b: Baptism }) {
  const [steps, setSteps] = useState(b.steps);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:30");
  const [message, setMessage] = useState(b.leaderMessage ?? "");
  const [msg, setMsg] = useState<{ text: string; tone: "error" | "success" }>();

  const save = async (status: BaptismStatus) => {
    let scheduledAt: Date | null | undefined;
    if (status === "scheduled") {
      scheduledAt = parseDateTime(date, time);
      if (!scheduledAt) return setMsg({ text: "Pour fixer la date : JJ/MM/AAAA et HH:MM.", tone: "error" });
    }
    try {
      await updateBaptism(b.uid, { status, steps, leaderMessage: message.trim(), ...(scheduledAt !== undefined ? { scheduledAt } : {}) });
      setMsg({ text: "Enregistré. Le membre est prévenu.", tone: "success" });
    } catch {
      setMsg({ text: "Enregistrement impossible.", tone: "error" });
    }
  };

  return (
    <View style={{ marginTop: 12 }}>
      <Text style={styles.label}>Sa démarche</Text>
      <Text style={styles.motivation}>{b.motivation}</Text>
      <Text style={styles.label}>Étapes validées</Text>
      <View style={styles.chips}>
        {preparationSteps.map((p) => {
          const on = steps.includes(p.id);
          return (
            <Pressable key={p.id} accessibilityRole="checkbox" accessibilityState={{ checked: on }} onPress={() => { tap(); setSteps(on ? steps.filter((s) => s !== p.id) : [...steps, p.id]); }} style={[styles.chip, on && styles.chipOn]}>
              <Text style={styles.chipText}>{p.title}</Text>
            </Pressable>
          );
        })}
      </View>
      <Field label="Message au membre (facultatif)" value={message} onChangeText={setMessage} maxLength={2000} />
      <View style={{ flexDirection: "row", gap: 10 }}>
        <View style={{ flex: 1.4 }}>
          <Field label="Date du baptême" value={date} onChangeText={setDate} placeholder="JJ/MM/AAAA" />
        </View>
        <View style={{ flex: 1 }}>
          <Field label="Heure" value={time} onChangeText={setTime} placeholder="HH:MM" />
        </View>
      </View>
      <FormMessage text={msg?.text} tone={msg?.tone} />
      <Text style={styles.label}>Faire avancer le parcours</Text>
      <View style={styles.chips}>
        {baptismFlow.slice(1).map((s) => (
          <Btn key={s} label={baptismStatusLabels[s]} variant={b.status === s ? "primary" : "secondary"} onPress={() => save(s)} style={{ minHeight: 44, paddingHorizontal: 16 }} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  name: { fontFamily: fonts.display, fontSize: 20, color: colors.ink },
  status: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.gold700, marginTop: 4 },
  label: { fontFamily: fonts.bodyBold, fontSize: 13, letterSpacing: 1, textTransform: "uppercase", color: colors.muted, marginTop: 16 },
  motivation: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22, color: colors.ink, marginTop: 6 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  chip: { borderWidth: 1, borderColor: colors.line, borderRadius: 999, paddingHorizontal: 12, minHeight: 40, justifyContent: "center" },
  chipOn: { backgroundColor: colors.gold400, borderColor: colors.gold400 },
  chipText: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.ink },
});
