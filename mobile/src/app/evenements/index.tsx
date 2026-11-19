import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MemberGate } from "@/components/member-gate";
import { Body, Btn, Eyebrow, Screen, Section, Title } from "@/components/ui";
import { formatEventDate, placesLeft, watchEvents, type ChurchEvent } from "@/lib/events";
import { isLeader, isServant, type Member } from "@/lib/members";
import { tap } from "@/lib/open";
import { colors, fonts, space } from "@/lib/theme";

export default function Evenements() {
  return <MemberGate>{(m) => <Content member={m} />}</MemberGate>;
}

function Content({ member }: { member: Member }) {
  const [list, setList] = useState<ChurchEvent[] | null>(null);
  const servant = isServant(member);
  useEffect(() => watchEvents(servant, setList), [servant]);

  return (
    <Screen tabBar={false}>
      <Section style={{ marginTop: space.lg }}>
        <Eyebrow>Temps forts</Eyebrow>
        <Title as="h1" lead="Événements &" accent="inscriptions." size={34} />
        {isLeader(member) ? <Btn label="Créer un événement" icon="add" onPress={() => router.push("/evenements/nouveau")} style={{ marginTop: space.lg }} /> : null}
      </Section>
      <View style={{ gap: 12, marginTop: space.lg }}>
        {list?.length === 0 ? <Body>Aucun événement à venir pour le moment.</Body> : null}
        {(list ?? []).map((e) => {
          const left = placesLeft(e);
          return (
            <Pressable key={e.id} accessibilityRole="button" onPress={() => { tap(); router.push({ pathname: "/evenements/[id]", params: { id: e.id } }); }} style={({ pressed }) => [styles.card, pressed && { backgroundColor: "#efe8da" }]}>
              <Text style={styles.date}>{formatEventDate(e.startsAt)}</Text>
              <Text style={styles.title}>{e.title}</Text>
              <View style={styles.meta}>
                <Ionicons name="location-outline" size={15} color={colors.muted} />
                <Text style={styles.metaText}>{e.location}</Text>
              </View>
              <Text style={[styles.status, !e.registrationOpen || left === 0 ? { color: colors.muted } : null]}>
                {!e.registrationOpen ? "Inscriptions fermées" : left === 0 ? "Complet" : left == null ? "Inscriptions ouvertes" : `${left} place${left > 1 ? "s" : ""} restante${left > 1 ? "s" : ""}`}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: 20, padding: 18, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  date: { fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 1.4, textTransform: "uppercase", color: colors.gold700 },
  title: { fontFamily: fonts.display, fontSize: 22, color: colors.ink, marginTop: 6 },
  meta: { flexDirection: "row", gap: 6, alignItems: "center", marginTop: 6 },
  metaText: { fontFamily: fonts.body, fontSize: 14, color: colors.muted },
  status: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.gold700, marginTop: 10 },
});
