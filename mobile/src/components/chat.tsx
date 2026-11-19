import Ionicons from "@expo/vector-icons/Ionicons";
import { useRef, useState, type ComponentRef } from "react";
import { ActionSheetIOS, Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { blockUser, reasonLabels, reportContent, type ChatMessage, type ReportReason } from "@/lib/community";
import { formatDate } from "@/lib/news";
import { tap } from "@/lib/open";
import { colors, fonts } from "@/lib/theme";

type Props = {
  meUid: string;
  messages: ChatMessage[];
  pathFor: (m: ChatMessage) => string; // chemin Firestore du message (pour le signalement)
  onSend: (text: string) => Promise<void>;
  onDelete: (m: ChatMessage) => void;
  canModerate?: boolean;
  blocked: string[];
  showNames?: boolean;
  header?: React.ReactNode;
  emptyText: string;
};

// Discussion (groupe ou privée) : appui long sur un message → signaler, bloquer ou supprimer.
export function Chat({ meUid, messages, pathFor, onSend, onDelete, canModerate, blocked, showNames, header, emptyText }: Props) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const insets = useSafeAreaInsets();
  const visible = messages.filter((m) => !blocked.includes(m.uid));

  const send = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      await onSend(text);
      setText("");
    } catch {
      Alert.alert("Message non envoyé", "Vérifiez votre connexion. Si ce membre vous a bloqué, il ne reçoit plus vos messages.");
    } finally {
      setSending(false);
    }
  };

  const report = (m: ChatMessage) => {
    const reasons = Object.keys(reasonLabels) as ReportReason[];
    const doReport = (r: ReportReason) =>
      reportContent(meUid, m.uid, pathFor(m), m.text, r).then(() => Alert.alert("Merci", "Le message a été signalé aux administrateurs, qui vont le vérifier."));
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions({ title: "Pourquoi signaler ce message ?", options: [...reasons.map((r) => reasonLabels[r]), "Annuler"], cancelButtonIndex: reasons.length }, (i) => i < reasons.length && doReport(reasons[i]));
    } else {
      Alert.alert("Pourquoi signaler ce message ?", undefined, [...reasons.slice(0, 2).map((r) => ({ text: reasonLabels[r], onPress: () => doReport(r) })), { text: "Autre", onPress: () => doReport("other") }]);
    }
  };

  const options = (m: ChatMessage) => {
    tap();
    const mine = m.uid === meUid;
    const actions: { text: string; style?: "destructive" | "cancel"; onPress?: () => void }[] = [];
    if (mine || canModerate) actions.push({ text: "Supprimer le message", style: "destructive", onPress: () => onDelete(m) });
    if (!mine) {
      actions.push({ text: "Signaler", onPress: () => report(m) });
      actions.push({
        text: "Bloquer ce membre",
        style: "destructive",
        onPress: () =>
          Alert.alert("Bloquer ce membre ?", "Vous ne verrez plus ses messages et il ne pourra plus vous écrire en privé.", [
            { text: "Annuler", style: "cancel" },
            { text: "Bloquer", style: "destructive", onPress: () => blockUser(meUid, m.uid) },
          ]),
      });
    }
    actions.push({ text: "Annuler", style: "cancel" });
    Alert.alert("Message", m.text.slice(0, 120), actions);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.cream }} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={90}>
      <ScrollView ref={scroll} contentContainerStyle={{ padding: 16, gap: 8 }} onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: false })}>
        {header}
        {visible.length === 0 ? <Text style={styles.empty}>{emptyText}</Text> : null}
        {visible.map((m) => {
          const mine = m.uid === meUid;
          return (
            <Pressable key={m.id} onLongPress={() => options(m)} accessibilityHint="Appui long pour signaler, bloquer ou supprimer" style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
              {showNames && !mine ? <Text style={styles.name}>{m.name}</Text> : null}
              <Text style={[styles.text, mine && { color: colors.night950 }]}>{m.text}</Text>
              <Text style={[styles.time, mine && { color: "rgba(3,20,31,0.6)" }]}>{formatDate(m.createdAt)}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <View style={[styles.bar, { paddingBottom: 10 + insets.bottom }]}>
        <TextInput value={text} onChangeText={setText} placeholder="Écrire un message" placeholderTextColor="#8a96a0" multiline maxLength={2000} accessibilityLabel="Écrire un message" style={styles.input} />
        <Pressable accessibilityRole="button" accessibilityLabel="Envoyer" onPress={send} style={[styles.send, !text.trim() && { opacity: 0.4 }]}>
          <Ionicons name="send" size={18} color={colors.night950} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  empty: { fontFamily: fonts.body, fontSize: 15, color: colors.muted, textAlign: "center", marginTop: 24 },
  bubble: { maxWidth: "82%", borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
  mine: { alignSelf: "flex-end", backgroundColor: colors.gold400, borderBottomRightRadius: 6 },
  theirs: { alignSelf: "flex-start", backgroundColor: colors.white, borderBottomLeftRadius: 6, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  name: { fontFamily: fonts.bodyBold, fontSize: 12.5, color: colors.gold700, marginBottom: 2 },
  text: { fontFamily: fonts.body, fontSize: 15.5, lineHeight: 21, color: colors.ink },
  time: { fontFamily: fonts.body, fontSize: 11, color: colors.muted, marginTop: 4, alignSelf: "flex-end" },
  bar: { flexDirection: "row", alignItems: "flex-end", gap: 8, paddingHorizontal: 12, paddingTop: 10, backgroundColor: colors.white, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  input: { flex: 1, minHeight: 44, maxHeight: 120, borderRadius: 22, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 16, paddingTop: 11, paddingBottom: 11, fontFamily: fonts.body, fontSize: 16, color: colors.ink, backgroundColor: colors.cream },
  send: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.gold400, alignItems: "center", justifyContent: "center" },
});
