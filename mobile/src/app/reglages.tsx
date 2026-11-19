import { FieldGroup, Host, Switch } from "@expo/ui";
import * as Application from "expo-application";
import { useEffect, useState } from "react";
import { Alert, Linking, Platform, StyleSheet, Text, View } from "react-native";
import { Body, Eyebrow, RowLink, Screen, Section, Title } from "@/components/ui";
import { getPrefs, LEAD_MINUTES, setPrefs, type ReminderPrefs } from "@/lib/reminders";
import { sitePage } from "@/lib/open";
import { colors, fonts, space } from "@/lib/theme";
import { formatTime, schedule } from "@shared/site";

export default function Reglages() {
  const [prefs, setLocal] = useState<ReminderPrefs>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getPrefs().then(setLocal);
  }, []);

  const toggle = async (day: string, value: boolean) => {
    const next = { ...prefs, [day]: value };
    setLocal(next);
    setBusy(true);
    const res = await setPrefs(next);
    setBusy(false);
    if (!res.ok) {
      setLocal(prefs);
      Alert.alert("Rappels non activés", res.reason, [
        { text: "Fermer", style: "cancel" },
        ...(Platform.OS !== "web" ? [{ text: "Ouvrir les réglages", onPress: () => Linking.openSettings() }] : []),
      ]);
    }
  };

  return (
    <Screen tabBar={false}>
      <Section style={{ marginTop: space.lg }}>
        <Eyebrow>Rappels</Eyebrow>
        <Title lead="Ne manquez" accent="aucun culte." size={30} />
        <Body>Recevez une notification {LEAD_MINUTES} minutes avant chaque rendez-vous choisi. Les rappels sont programmés sur votre téléphone : aucune donnée n&apos;est envoyée.</Body>
      </Section>

      <View style={{ marginTop: space.lg, opacity: busy ? 0.6 : 1 }}>
        <Host matchContents={{ vertical: true }}>
          <FieldGroup>
            <FieldGroup.Section title="Rappels de culte">
              {schedule.map((s) => (
                <Switch
                  key={s.dayOfWeek}
                  label={`${s.day} ${formatTime(s.start)} · ${s.title}`}
                  value={Boolean(prefs[s.dayOfWeek])}
                  onValueChange={(v) => toggle(s.dayOfWeek, v)}
                  disabled={busy}
                />
              ))}
            </FieldGroup.Section>
          </FieldGroup>
        </Host>
      </View>

      <Section>
        <Eyebrow>Informations</Eyebrow>
        <View style={{ gap: 10, marginTop: space.md }}>
          <RowLink icon="shield-checkmark-outline" title="Politique de confidentialité" onPress={() => sitePage("/confidentialite")} external />
          <RowLink icon="document-text-outline" title="Conditions d'utilisation" onPress={() => sitePage("/conditions")} external />
          <RowLink icon="information-circle-outline" title="Mentions légales" onPress={() => sitePage("/mentions-legales")} external />
        </View>
      </Section>

      <Section>
        <View style={styles.privacy}>
          <Text style={styles.privacyTitle}>Votre vie privée</Text>
          <Text style={styles.privacyText}>
            L&apos;application ne contient ni publicité, ni pisteur, ni mesure d&apos;audience, et ne demande aucun compte. Seules vos préférences de rappel sont enregistrées, sur votre téléphone.
          </Text>
        </View>
        <Text style={styles.version}>
          AFVN Nantes · version {Application.nativeApplicationVersion ?? "1.0.0"} ({Application.nativeBuildVersion ?? "1"})
        </Text>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  privacy: { backgroundColor: colors.sage, borderRadius: 18, padding: 18 },
  privacyTitle: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.ink },
  privacyText: { fontFamily: fonts.body, fontSize: 14, lineHeight: 21, color: colors.muted, marginTop: 4 },
  version: { fontFamily: fonts.body, fontSize: 12.5, color: colors.muted, textAlign: "center", marginTop: space.lg },
});
