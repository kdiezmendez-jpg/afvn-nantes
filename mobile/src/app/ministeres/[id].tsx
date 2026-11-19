import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Chat } from "@/components/chat";
import { MemberGate } from "@/components/member-gate";
import { Body, Btn, Eyebrow, Screen, Section, Title } from "@/components/ui";
import { deleteGroupMessage, joinMinistry, leaveMinistry, sendGroupMessage, watchBlocked, watchGroupMessages, watchMinistries, watchMinistryMembers, type ChatMessage, type Ministry } from "@/lib/community";
import { isLeader, type Member } from "@/lib/members";
import { colors, fonts, space } from "@/lib/theme";

export default function MinistereScreen() {
  return <MemberGate>{(m) => <Content member={m} />}</MemberGate>;
}

function Content({ member }: { member: Member }) {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [ministry, setMinistry] = useState<Ministry | null>(null);
  const [members, setMembers] = useState<{ uid: string; name: string }[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [blocked, setBlocked] = useState<string[]>([]);
  const joined = members.some((m) => m.uid === member.uid);
  const leader = isLeader(member);

  useEffect(() => watchMinistries((l) => setMinistry(l.find((m) => m.id === id) ?? null)), [id]);
  useEffect(() => watchMinistryMembers(id, setMembers), [id]);
  useEffect(() => (joined || leader ? watchGroupMessages(id, setMessages) : undefined), [id, joined, leader]);
  useEffect(() => watchBlocked(member.uid, setBlocked), [member.uid]);

  if (!ministry) return null;

  if (!joined && !leader) {
    return (
      <Screen tabBar={false}>
        <Stack.Screen options={{ title: ministry.name }} />
        <Section style={{ marginTop: space.lg }}>
          <Eyebrow>Ministère</Eyebrow>
          <Title as="h1" lead={ministry.name} size={34} />
          <Body>{ministry.description}</Body>
          <Text style={styles.count}>{members.length} membre{members.length > 1 ? "s" : ""}</Text>
          <Btn label="Rejoindre ce ministère" icon="people-outline" onPress={() => joinMinistry(id, member)} style={{ marginTop: space.lg }} />
        </Section>
      </Screen>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: ministry.name }} />
      <Chat
        meUid={member.uid}
        messages={messages}
        blocked={blocked}
        showNames
        canModerate={leader}
        pathFor={(m) => `ministries/${id}/messages/${m.id}`}
        onSend={(t) => sendGroupMessage(id, member, t).then(() => undefined)}
        onDelete={(m) => deleteGroupMessage(id, m.id)}
        emptyText="Aucun message pour le moment. Lancez la discussion !"
        header={
          <View style={styles.header}>
            <Text style={styles.headerText}>
              {members.length} membre{members.length > 1 ? "s" : ""} · {members.slice(0, 4).map((m) => m.name.split(" ")[0]).join(", ")}
              {members.length > 4 ? "…" : ""}
            </Text>
            {joined ? <Btn label="Quitter" variant="secondary" onPress={() => leaveMinistry(id, member.uid)} style={{ minHeight: 36, paddingHorizontal: 14 }} /> : null}
          </View>
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  count: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.gold700, marginTop: 12 },
  header: { flexDirection: "row", alignItems: "center", gap: 10, paddingBottom: 8, marginBottom: 4, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  headerText: { flex: 1, fontFamily: fonts.body, fontSize: 13, color: colors.muted },
});
