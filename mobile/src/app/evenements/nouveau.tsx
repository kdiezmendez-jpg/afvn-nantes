import { FieldGroup, Host, Switch } from "@expo/ui";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { Field, FormMessage } from "@/components/form";
import { MemberGate } from "@/components/member-gate";
import { Btn, Eyebrow, Screen, Section, Title } from "@/components/ui";
import { createEvent, parseDateTime } from "@/lib/events";
import { isLeader, type Member } from "@/lib/members";
import { colors, fonts, space } from "@/lib/theme";
import { site } from "@shared/site";

export default function NouvelEvenement() {
  return <MemberGate allow={isLeader}>{(m) => <Content member={m} />}</MemberGate>;
}

function Content({ member }: { member: Member }) {
  const [f, setF] = useState({ title: "", date: "", time: "09:30", location: `${site.address.street}, ${site.address.city}`, capacity: "", description: "" });
  const [servantsOnly, setServantsOnly] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (k: keyof typeof f) => (v: string) => setF((s) => ({ ...s, [k]: v }));

  const submit = async () => {
    const e: Record<string, string> = {};
    const startsAt = parseDateTime(f.date, f.time);
    if (f.title.trim().length < 3) e.title = "Indiquez un titre (3 caractères minimum).";
    if (!startsAt) e.date = "Date au format JJ/MM/AAAA et heure au format HH:MM.";
    else if (startsAt.getTime() < Date.now()) e.date = "La date doit être dans le futur.";
    if (f.capacity && !/^\d+$/.test(f.capacity)) e.capacity = "Indiquez un nombre, ou laissez vide pour illimité.";
    setErrors(e);
    if (Object.keys(e).length || !startsAt) return;
    try {
      await createEvent({ title: f.title.trim(), description: f.description.trim(), location: f.location.trim(), startsAt, audience: servantsOnly ? "servants" : "all", capacity: f.capacity ? Number(f.capacity) : null, registrationOpen: true, createdBy: member.uid });
      router.back();
    } catch {
      setErrors({ form: "Création impossible. Vérifiez votre connexion." });
    }
  };

  return (
    <Screen tabBar={false}>
      <Section style={{ marginTop: space.lg }}>
        <Eyebrow>Organiser</Eyebrow>
        <Title as="h1" lead="Nouvel" accent="événement." size={34} />
        <Field label="Titre" value={f.title} onChangeText={set("title")} error={errors.title} maxLength={120} />
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={{ flex: 1.4 }}>
            <Field label="Date" value={f.date} onChangeText={set("date")} placeholder="JJ/MM/AAAA" keyboardType="numbers-and-punctuation" error={errors.date} />
          </View>
          <View style={{ flex: 1 }}>
            <Field label="Heure" value={f.time} onChangeText={set("time")} placeholder="HH:MM" keyboardType="numbers-and-punctuation" />
          </View>
        </View>
        <Field label="Lieu" value={f.location} onChangeText={set("location")} maxLength={200} />
        <Field label="Places (facultatif)" value={f.capacity} onChangeText={set("capacity")} keyboardType="number-pad" error={errors.capacity} hint="Laissez vide pour un nombre illimité." />
        <TextInput value={f.description} onChangeText={set("description")} multiline maxLength={5000} placeholder="Description (programme, intervenants…)" placeholderTextColor="#8a96a0" accessibilityLabel="Description de l'événement" style={styles.input} />
      </Section>
      <View style={{ marginTop: space.lg }}>
        <Host matchContents={{ vertical: true }}>
          <FieldGroup>
            <FieldGroup.Section title="Public">
              <Switch label="Réservé aux serviteurs" value={servantsOnly} onValueChange={setServantsOnly} />
            </FieldGroup.Section>
          </FieldGroup>
        </Host>
      </View>
      <Section style={{ marginTop: space.lg }}>
        <FormMessage text={errors.form} />
        <Btn label="Créer l'événement" icon="calendar-outline" onPress={submit} />
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: { minHeight: 130, marginTop: 16, borderWidth: 1.5, borderColor: "rgba(17,41,59,0.2)", borderRadius: 16, padding: 14, fontFamily: fonts.body, fontSize: 16, lineHeight: 23, color: colors.ink, backgroundColor: colors.white, textAlignVertical: "top" },
});
