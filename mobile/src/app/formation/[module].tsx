import Ionicons from "@expo/vector-icons/Ionicons";
import * as DocumentPicker from "expo-document-picker";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { FormMessage } from "@/components/form";
import { MemberGate } from "@/components/member-gate";
import { Body, Btn, Card, Eyebrow, Screen, Section, Title } from "@/components/ui";
import { isServant, isTrainer, type Member } from "@/lib/members";
import { openWeb, tap } from "@/lib/open";
import { colors, fonts, space } from "@/lib/theme";
import { deleteFile, fileUrl, lessonId, moduleById, saveProgress, uploadFile, watchFiles, watchProgress, type FileKind, type TrainingFile } from "@/lib/training";

export default function ModuleScreen() {
  return <MemberGate allow={isServant}>{(m) => <Content member={m} />}</MemberGate>;
}

function Content({ member }: { member: Member }) {
  const { module: id } = useLocalSearchParams<{ module: string }>();
  const mod = moduleById(id);
  const trainer = isTrainer(member);
  const [done, setDone] = useState<string[]>([]);
  const [files, setFiles] = useState<TrainingFile[]>([]);
  const [msg, setMsg] = useState<{ text: string; tone: "error" | "success" }>();
  const [busy, setBusy] = useState(false);
  useEffect(() => watchProgress(member.uid, id, setDone), [member.uid, id]);
  useEffect(() => watchFiles(id, trainer, setFiles), [id, trainer]);
  if (!mod) return <Body style={{ padding: space.lg }}>Module introuvable.</Body>;

  const toggle = (lid: string) => {
    tap();
    const next = done.includes(lid) ? done.filter((x) => x !== lid) : [...done, lid];
    setDone(next);
    saveProgress(member.uid, `${member.firstName} ${member.lastName}`, id, next).catch(() => setMsg({ text: "Progression non enregistrée (connexion ?).", tone: "error" }));
  };

  const open = async (f: TrainingFile) => {
    try {
      await openWeb(await fileUrl(f));
    } catch {
      setMsg({ text: "Impossible d'ouvrir ce manuel.", tone: "error" });
    }
  };

  const upload = async (kind: FileKind) => {
    const res = await DocumentPicker.getDocumentAsync({ type: "application/pdf", copyToCacheDirectory: true });
    if (res.canceled || !res.assets[0]) return;
    const a = res.assets[0];
    if ((a.size ?? 0) > 30 * 1024 * 1024) return setMsg({ text: "Fichier trop lourd (30 Mo maximum).", tone: "error" });
    setBusy(true);
    try {
      await uploadFile(id, kind, a.name.replace(/\.pdf$/i, ""), a.uri, member.uid);
      setMsg({ text: "Manuel ajouté.", tone: "success" });
    } catch {
      setMsg({ text: "Envoi impossible. Réessayez.", tone: "error" });
    } finally {
      setBusy(false);
    }
  };

  const groups: { kind: FileKind; label: string }[] = trainer
    ? [
        { kind: "student", label: "Manuels de l'étudiant" },
        { kind: "trainer", label: "Réservé aux formateurs (guide de l'enseignant, supports visuels)" },
      ]
    : [{ kind: "student", label: "Manuels de l'étudiant" }];

  return (
    <Screen tabBar={false}>
      <Stack.Screen options={{ title: mod.title }} />
      <Section style={{ marginTop: space.lg }}>
        <Eyebrow>
          {done.length} / {mod.lessons.length} leçons terminées
        </Eyebrow>
        <Title as="h1" lead={mod.title} size={30} />
      </Section>

      <Section style={{ marginTop: space.lg }}>
        {groups.map((g) => {
          const list = files.filter((f) => f.kind === g.kind);
          return (
            <View key={g.kind} style={{ marginBottom: space.lg }}>
              <Text style={styles.group}>{g.label}</Text>
              {list.length === 0 ? <Body style={{ fontSize: 14 }}>Aucun document pour le moment.</Body> : null}
              <View style={{ gap: 8, marginTop: 8 }}>
                {list.map((f) => (
                  <View key={f.id} style={styles.file}>
                    <Pressable accessibilityRole="link" onPress={() => open(f)} style={styles.fileMain}>
                      <Ionicons name="document-text-outline" size={22} color={colors.gold700} />
                      <Text style={styles.fileName}>{f.name}</Text>
                    </Pressable>
                    {trainer ? (
                      <Pressable accessibilityRole="button" accessibilityLabel={`Supprimer ${f.name}`} onPress={() => Alert.alert("Supprimer ce document ?", f.name, [{ text: "Annuler", style: "cancel" }, { text: "Supprimer", style: "destructive", onPress: () => deleteFile(f) }])} style={styles.trash}>
                        <Ionicons name="trash-outline" size={18} color={colors.muted} />
                      </Pressable>
                    ) : null}
                  </View>
                ))}
              </View>
              {trainer ? <Btn label={busy ? "Envoi…" : "Ajouter un PDF"} icon="cloud-upload-outline" variant="secondary" onPress={() => upload(g.kind)} style={{ marginTop: 10, minHeight: 44 }} /> : null}
            </View>
          );
        })}
        <FormMessage text={msg?.text} tone={msg?.tone} />
      </Section>

      <Section style={{ marginTop: space.lg }}>
        <Eyebrow>Leçons</Eyebrow>
        <View style={{ gap: 8, marginTop: space.md }}>
          {mod.lessons.map((title, i) => {
            const lid = lessonId(id, i);
            const ok = done.includes(lid);
            return (
              <Pressable key={lid} accessibilityRole="checkbox" accessibilityState={{ checked: ok }} onPress={() => toggle(lid)}>
                <Card style={[styles.lesson, ok && { borderColor: "#abefc6" }]}>
                  <Ionicons name={ok ? "checkmark-circle" : "ellipse-outline"} size={24} color={ok ? "#12b76a" : colors.muted} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.lessonNum}>Leçon {i + 1}</Text>
                    <Text style={styles.lessonTitle}>{title}</Text>
                  </View>
                </Card>
              </Pressable>
            );
          })}
        </View>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  group: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.ink },
  file: { flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  fileMain: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10, padding: 14, minHeight: 52 },
  fileName: { flex: 1, fontFamily: fonts.bodyMedium, fontSize: 15, color: colors.ink },
  trash: { width: 48, height: 48, alignItems: "center", justifyContent: "center" },
  lesson: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  lessonNum: { fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 1.6, textTransform: "uppercase", color: colors.gold700 },
  lessonTitle: { fontFamily: fonts.display, fontSize: 17, color: colors.ink, marginTop: 2 },
});
