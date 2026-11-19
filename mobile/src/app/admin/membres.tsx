import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { Body, Btn, Eyebrow, Title } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { isAdmin, listMembers, roleLabels, setMemberRoles, setMemberStatus, type Member, type Role, type Status } from "@/lib/members";
import { tap } from "@/lib/open";
import { colors, fonts, space } from "@/lib/theme";

const tabs: { key: Status; label: string }[] = [
  { key: "pending", label: "En attente" },
  { key: "active", label: "Membres" },
  { key: "rejected", label: "Refusés" },
];
const assignable: Role[] = ["servant", "intercessor", "trainer", "leader", "admin"];

export default function AdminMembres() {
  const { member: me } = useAuth();
  const [tab, setTab] = useState<Status>("pending");
  const [list, setList] = useState<Member[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(() => listMembers(tab).catch(() => [] as Member[]), [tab]);

  useEffect(() => {
    let alive = true;
    load().then((l) => alive && setList(l));
    return () => {
      alive = false;
    };
  }, [load]);

  if (!isAdmin(me)) {
    return (
      <View style={{ padding: space.lg }}>
        <Body>Réservé aux administrateurs.</Body>
        <Btn label="Retour" onPress={() => router.back()} style={{ marginTop: space.lg }} />
      </View>
    );
  }

  const decide = async (m: Member, status: Status) => {
    await setMemberStatus(m.uid, status);
    setList((l) => l?.filter((x) => x.uid !== m.uid) ?? null);
  };

  const toggleRole = async (m: Member, r: Role) => {
    if (m.uid === me?.uid && r === "admin") return Alert.alert("Action impossible", "Vous ne pouvez pas retirer vos propres droits d'administrateur.");
    const roles = m.roles.includes(r) ? m.roles.filter((x) => x !== r) : [...m.roles, r];
    await setMemberRoles(m.uid, roles);
    setList((l) => l?.map((x) => (x.uid === m.uid ? { ...x, roles } : x)) ?? null);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.cream }}
      contentContainerStyle={{ padding: space.lg, paddingBottom: 48 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); setList(await load()); setRefreshing(false); }} />}
    >
      <Eyebrow>Administration</Eyebrow>
      <Title as="h1" lead="Gérer les" accent="membres." size={32} />
      <View style={styles.tabs} accessibilityRole="tablist">
        {tabs.map((t) => (
          <Pressable key={t.key} accessibilityRole="tab" accessibilityState={{ selected: tab === t.key }} onPress={() => { tap(); setList(null); setTab(t.key); }} style={[styles.tab, tab === t.key && styles.tabOn]}>
            <Text style={[styles.tabText, tab === t.key && { color: colors.night950 }]}>{t.label}</Text>
          </Pressable>
        ))}
      </View>
      {list === null ? (
        <ActivityIndicator color={colors.gold700} style={{ marginTop: space.xl }} />
      ) : list.length === 0 ? (
        <Body>Aucune personne dans cette liste.</Body>
      ) : (
        <View style={{ gap: 12, marginTop: space.md }}>
          {list.map((m) => (
            <View key={m.uid} style={styles.card}>
              <Text style={styles.name}>
                {m.firstName} {m.lastName}
              </Text>
              <Text style={styles.meta}>
                {m.email}
                {m.phone ? ` · ${m.phone}` : ""}
              </Text>
              {tab === "pending" ? (
                <View style={styles.actions}>
                  <Btn label="Valider" icon="checkmark" onPress={() => decide(m, "active")} style={{ flex: 1 }} />
                  <Btn label="Refuser" variant="secondary" onPress={() => decide(m, "rejected")} style={{ flex: 1 }} />
                </View>
              ) : tab === "active" ? (
                <View style={[styles.actions, { flexWrap: "wrap" }]}>
                  {assignable.map((r) => {
                    const on = m.roles.includes(r);
                    return (
                      <Pressable key={r} accessibilityRole="switch" accessibilityState={{ checked: on }} onPress={() => { tap(); toggleRole(m, r); }} style={[styles.roleChip, on && styles.roleOn]}>
                        <Text style={[styles.roleText, on && { color: colors.night950 }]}>{roleLabels[r]}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              ) : (
                <Btn label="Réexaminer" variant="secondary" onPress={() => decide(m, "pending")} style={{ marginTop: 12 }} />
              )}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: "row", gap: 8, marginTop: space.lg, marginBottom: space.sm },
  tab: { paddingHorizontal: 14, minHeight: 40, justifyContent: "center", borderRadius: 999, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white },
  tabOn: { backgroundColor: colors.gold400, borderColor: colors.gold400 },
  tabText: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.ink },
  card: { backgroundColor: colors.white, borderRadius: 18, padding: 16, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  name: { fontFamily: fonts.display, fontSize: 20, color: colors.ink },
  meta: { fontFamily: fonts.body, fontSize: 13.5, color: colors.muted, marginTop: 2 },
  actions: { flexDirection: "row", gap: 8, marginTop: 12 },
  roleChip: { paddingHorizontal: 14, minHeight: 40, justifyContent: "center", borderRadius: 999, borderWidth: 1, borderColor: colors.line },
  roleOn: { backgroundColor: colors.gold400, borderColor: colors.gold400 },
  roleText: { fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.ink },
});
