import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Chat } from "@/components/chat";
import { MemberGate } from "@/components/member-gate";
import { deletePrivateMessage, sendPrivateMessage, watchBlocked, watchConversation, watchPrivateMessages, type ChatMessage, type Conversation } from "@/lib/community";
import type { Member } from "@/lib/members";

export default function ConversationScreen() {
  return <MemberGate>{(m) => <Content member={m} />}</MemberGate>;
}

function Content({ member }: { member: Member }) {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [conv, setConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [blocked, setBlocked] = useState<string[]>([]);
  useEffect(() => watchConversation(id, setConv), [id]);
  useEffect(() => watchPrivateMessages(id, setMessages), [id]);
  useEffect(() => watchBlocked(member.uid, setBlocked), [member.uid]);
  const other = conv?.members.find((u) => u !== member.uid);

  return (
    <>
      <Stack.Screen options={{ title: other ? conv?.names[other] : "Message" }} />
      <Chat
        meUid={member.uid}
        messages={messages}
        blocked={blocked}
        pathFor={(m) => `conversations/${id}/messages/${m.id}`}
        onSend={(t) => sendPrivateMessage(id, member.uid, t)}
        onDelete={(m) => deletePrivateMessage(id, m.id)}
        emptyText="Écrivez votre premier message."
      />
    </>
  );
}
