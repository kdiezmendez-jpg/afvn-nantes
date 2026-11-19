import { FieldGroup, Host, Switch } from "@expo/ui";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { Field, FormMessage } from "@/components/form";
import { MemberGate } from "@/components/member-gate";
import { Btn, Eyebrow, Screen, Section, Title } from "@/components/ui";
import { isLeader, type Member } from "@/lib/members";
import { publishNews } from "@/lib/news";
import { colors, fonts, space } from "@/lib/theme";

export default function NouvelleActualite() {
  return <MemberGate allow={isLeader}>{(m) => <Content member={m} />}</MemberGate>;
}

function Content({ member }: { member: Member }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [servantsOnly, setServantsOnly] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [notify, setNotify] = useState(true);
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (title.trim().length < 3) return setError("Le titre doit contenir au moins 3 caractères.");
    if (body.trim().length < 3) return setError("Écrivez le texte de l'actualité.");
    setError(undefined);
    setBusy(true);
    try {
      await publishNews({ title, body, audience: servantsOnly ? "servants" : "all", pinned, notify, authorUid: member.uid, authorName: `${member.firstName} ${member.lastName}` });
      router.back();
    } catch {
      setError("Publication impossible. Vérifiez votre connexion.");
      setBusy(false);
    }
  };

  return (
    <Screen tabBar={false}>
      <Section style={{ marginTop: space.lg }}>
        <Eyebrow>Publier</Eyebrow>
        <Title as="h1" lead="Nouvelle" accent="actualité." size={34} />
        <Field label="Titre" value={title} onChangeText={setTitle} maxLength={120} />
        <TextInput value={body} onChangeText={setBody} multiline maxLength={5000} placeholder="Texte de l'annonce" placeholderTextColor="#8a96a0" accessibilityLabel="Texte de l'actualité" style={styles.input} />
      </Section>
      <View style={{ marginTop: space.lg }}>
        <Host matchContents={{ vertical: true }}>
          <FieldGroup>
            <FieldGroup.Section title="Options">
              <Switch label="Envoyer une notification" value={notify} onValueChange={setNotify} />
              <Switch label="Réservée aux serviteurs" value={servantsOnly} onValueChange={setServantsOnly} />
              <Switch label="Épingler en haut" value={pinned} onValueChange={setPinned} />
            </FieldGroup.Section>
          </FieldGroup>
        </Host>
      </View>
      <Section style={{ marginTop: space.lg }}>
        <FormMessage text={error} />
        <Btn label={busy ? "Publication…" : "Publier"} icon="megaphone-outline" onPress={submit} />
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: { minHeight: 160, marginTop: 16, borderWidth: 1.5, borderColor: "rgba(17,41,59,0.2)", borderRadius: 16, padding: 14, fontFamily: fonts.body, fontSize: 16, lineHeight: 23, color: colors.ink, backgroundColor: colors.white, textAlignVertical: "top" },
});
