import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { MemberGate } from "@/components/member-gate";
import { Body, Card, Eyebrow, Screen, Section, Title } from "@/components/ui";
import { isTrainer } from "@/lib/members";
import { colors, fonts, space } from "@/lib/theme";
import { allProgress, course, type ProgressRow } from "@/lib/training";

export default function Suivi() {
  return <MemberGate allow={isTrainer}>{() => <Content />}</MemberGate>;
}

function Content() {
  const [rows, setRows] = useState<ProgressRow[] | null>(null);
  useEffect(() => {
    let alive = true;
    allProgress().then((r) => alive && setRows(r)).catch(() => alive && setRows([]));
    return () => {
      alive = false;
    };
  }, []);
  const people = [...new Set((rows ?? []).map((r) => r.uid))];

  return (
    <Screen tabBar={false}>
      <Section style={{ marginTop: space.lg }}>
        <Eyebrow>Suivi de la formation</Eyebrow>
        <Title as="h1" lead="Progression des" accent="serviteurs." size={32} />
        {rows && people.length === 0 ? <Body>Aucun serviteur n&apos;a encore commencé la formation.</Body> : null}
      </Section>
      <View style={{ gap: 10, marginTop: space.lg }}>
        {people.map((uid) => {
          const mine = (rows ?? []).filter((r) => r.uid === uid);
          return (
            <Card key={uid}>
              <Text style={styles.name}>{mine[0]?.name}</Text>
              {course.modules.map((m, i) => {
                const done = mine.find((r) => r.moduleId === m.id)?.lessons.length ?? 0;
                const pct = Math.round((done / m.lessons.length) * 100);
                return (
                  <View key={m.id} style={{ marginTop: 10 }}>
                    <Text style={styles.mod}>
                      Module {i + 1} · {done}/{m.lessons.length}
                    </Text>
                    <View style={styles.bar}>
                      <View style={[styles.fill, { width: `${pct}%` }]} />
                    </View>
                  </View>
                );
              })}
            </Card>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  name: { fontFamily: fonts.display, fontSize: 19, color: colors.ink },
  mod: { fontFamily: fonts.bodyMedium, fontSize: 13.5, color: colors.muted },
  bar: { height: 8, borderRadius: 4, backgroundColor: colors.sage, marginTop: 6, overflow: "hidden" },
  fill: { height: 8, backgroundColor: colors.gold400 },
});
