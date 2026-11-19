import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Field, FormMessage } from "@/components/form";
import { MemberGate } from "@/components/member-gate";
import { Body, Btn, Eyebrow, Screen, Section, Title } from "@/components/ui";
import { parseDateTime } from "@/lib/events";
import { isTrainer, type Member } from "@/lib/members";
import { space } from "@/lib/theme";
import { course, createSession, isYouTubeUrl, type SessionKind } from "@/lib/training";

export default function NouvelleSession() {
  return <MemberGate allow={isTrainer}>{(m) => <Content member={m} />}</MemberGate>;
}

function Content({ member }: { member: Member }) {
  const [moduleId, setModuleId] = useState<string>(course.modules[0].id);
  const [kind, setKind] = useState<SessionKind>("live");
  const [f, setF] = useState({ title: "", date: "", time: "19:00", url: "" });
  const [error, setError] = useState<string>();
  const set = (k: keyof typeof f) => (v: string) => setF((s) => ({ ...s, [k]: v }));

  const submit = async () => {
    const startsAt = parseDateTime(f.date, f.time);
    if (f.title.trim().length < 3) return setError("Indiquez un titre (ex. « Leçon 1 : Toute l'histoire »).");
    if (!startsAt) return setError("Date au format JJ/MM/AAAA et heure au format HH:MM.");
    if (f.url && !isYouTubeUrl(f.url)) return setError("Le lien doit être un lien YouTube.");
    try {
      await createSession({ moduleId, title: f.title.trim(), startsAt, kind, youtubeUrl: kind === "live" && f.url ? f.url.trim() : null, createdBy: member.uid });
      router.back();
    } catch {
      setError("Création impossible. Vérifiez votre connexion.");
    }
  };

  return (
    <Screen tabBar={false}>
      <Section style={{ marginTop: space.lg }}>
        <Eyebrow>Formation</Eyebrow>
        <Title as="h1" lead="Programmer une" accent="session." size={32} />
        <Body>Les serviteurs reçoivent une notification dès la création.</Body>
        <View style={{ gap: 8, marginTop: space.lg }}>
          {course.modules.map((m, i) => (
            <Btn key={m.id} label={`Module ${i + 1} · ${m.title}`} variant={moduleId === m.id ? "primary" : "secondary"} onPress={() => setModuleId(m.id)} style={{ minHeight: 44 }} />
          ))}
        </View>
        <View style={{ flexDirection: "row", gap: 8, marginTop: space.md }}>
          <Btn label="Direct YouTube" variant={kind === "live" ? "primary" : "secondary"} onPress={() => setKind("live")} style={{ flex: 1, minHeight: 44 }} />
          <Btn label="Petit groupe" variant={kind === "group" ? "primary" : "secondary"} onPress={() => setKind("group")} style={{ flex: 1, minHeight: 44 }} />
        </View>
        <Field label="Titre" value={f.title} onChangeText={set("title")} maxLength={120} />
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={{ flex: 1.4 }}>
            <Field label="Date" value={f.date} onChangeText={set("date")} placeholder="JJ/MM/AAAA" />
          </View>
          <View style={{ flex: 1 }}>
            <Field label="Heure" value={f.time} onChangeText={set("time")} placeholder="HH:MM" />
          </View>
        </View>
        {kind === "live" ? <Field label="Lien YouTube (facultatif, ajoutable plus tard)" value={f.url} onChangeText={set("url")} autoCapitalize="none" keyboardType="url" hint="Créez le direct en « non répertorié » sur la chaîne de l'église." /> : null}
        <FormMessage text={error} />
        <Btn label="Programmer la session" icon="calendar-outline" onPress={submit} style={{ marginTop: space.lg }} />
      </Section>
    </Screen>
  );
}
