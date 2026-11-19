import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { MemberGate } from "@/components/member-gate";
import { Body, Btn, Eyebrow, Screen, Section, Title } from "@/components/ui";
import { directory, openConversation } from "@/lib/community";
import { roleLabels, type Member } from "@/lib/members";
import { tap } from "@/lib/open";
import { colors, fonts, space } from "@/lib/theme";

export default function Annuaire() {
  return <MemberGate>{(m) => <Content member={m} />}</MemberGate>;
}

function Content({ member }: { member: Member }) {
  const [list, setList] = useState<Member[] | null>(null);
  const [q, setQ] = useState("");
  useEffect(() => {
    let alive = true;
    directory().then((l) => alive && setList(l)).catch(() => alive && setList([]));
    return () => {
      alive = false;
    };
  }, []);
  const shown = (list ?? []).filter((m) => m.uid !== member.uid && `${m.firstName} ${m.lastName}`.toLowerCase().includes(q.trim().toLowerCase()));

  const write = async (m: Member) => {
    tap();
    const id = await openConversation(member, m);
    router.push({ pathname: "/messages/[id]", params: { id } });
  };

  return (
    <Screen tabBar={false}>
      <Section style={{ marginTop: space.lg }}>
        <Eyebrow>Annuaire</Eyebrow>
        <Title as="h1" lead="Les frères" accent="et sœurs." size={34} />
        <Body>Seuls les membres qui l&apos;ont accepté apparaissent ici.{member.directoryVisible ? "" : " Vous n'y figurez pas : activez-le dans « Mon compte »."}</Body>
        {!member.directoryVisible ? <Btn label="Apparaître dans l'annuaire" variant="secondary" onPress={() => router.push("/compte")} style={{ marginTop: space.md }} /> : null}
        <TextInput value={q} onChangeText={setQ} placeholder="Rechercher un nom" placeholderTextColor="#8a96a0" accessibilityLabel="Rechercher un membre" style={styles.search} />
      </Section>
      <View style={{ gap: 8, marginTop: space.lg }}>
        {list && shown.length === 0 ? <Body>Personne à afficher.</Body> : null}
        {shown.map((m) => (
          <View key={m.uid} style={styles.row}>
            <View style={styles.avatar}>
              <Text style={styles.initials}>{(m.firstName[0] ?? "") + (m.lastName[0] ?? "")}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>
                {m.firstName} {m.lastName}
              </Text>
              <Text style={styles.roles}>{m.roles.filter((r) => r !== "member").map((r) => roleLabels[r]).join(" · ") || "Membre"}</Text>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel={`Écrire à ${m.firstName}`} onPress={() => write(m)} style={styles.write}>
              <Ionicons name="chatbubble-outline" size={20} color={colors.gold700} />
            </Pressable>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: { minHeight: 48, marginTop: space.lg, borderRadius: 14, borderWidth: 1.5, borderColor: "rgba(17,41,59,0.2)", paddingHorizontal: 14, fontFamily: fonts.body, fontSize: 16, color: colors.ink, backgroundColor: colors.white },
  row: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: colors.white, borderRadius: 16, padding: 12, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.night900, alignItems: "center", justifyContent: "center" },
  initials: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.gold300 },
  name: { fontFamily: fonts.bodyBold, fontSize: 15.5, color: colors.ink },
  roles: { fontFamily: fonts.body, fontSize: 13, color: colors.muted, marginTop: 2 },
  write: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center" },
});
