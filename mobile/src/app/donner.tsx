import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";
import { Body, Btn, Card, Eyebrow, Screen, Section, Title } from "@/components/ui";
import { call, openApp } from "@/lib/open";
import { colors, fonts, space } from "@/lib/theme";
import { site } from "@shared/site";

const items = [
  { t: "Dîmes & offrandes", d: "Soutenir la vie de l'église" },
  { t: "Actions sociales", d: "Aider les familles et personnes fragiles" },
  { t: "Projets AFVN", d: "Faire grandir les missions de l'église" },
];

// Les dons à une église ne sont pas des achats numériques : ils passent par une plateforme
// de don externe (ex. HelloAsso), ouverte dans Safari / Chrome (règle 3.2.2 de l'App Store).
export default function Donner() {
  const online = Boolean(site.donationUrl);
  return (
    <Screen tabBar={false}>
      <Section style={{ marginTop: space.lg }}>
        <Eyebrow>Soutenir la mission</Eyebrow>
        <Title as="h1" lead="Donner avec joie." accent="Transformer des vies." size={36} />
        <Body>
          Vos dons permettent à l&apos;église d&apos;accueillir, d&apos;enseigner, d&apos;aider les familles et de faire grandir les missions de l&apos;AFVN.
        </Body>
      </Section>
      <Section style={{ marginTop: space.lg }}>
        <View style={{ gap: 10 }}>
          {items.map((it) => (
            <Card key={it.t} style={{ flexDirection: "row", alignItems: "center", gap: 14, padding: 18 }}>
              <View style={styles.icon}>
                <Ionicons name="sparkles" size={16} color={colors.gold700} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{it.t}</Text>
                <Text style={styles.text}>{it.d}</Text>
              </View>
            </Card>
          ))}
        </View>
        {online ? (
          <Btn label="Faire un don en ligne" icon="lock-closed-outline" onPress={() => openApp(site.donationUrl)} style={{ marginTop: space.lg }} />
        ) : (
          <Card style={{ marginTop: space.lg, backgroundColor: colors.gold200, borderColor: colors.gold200 }}>
            <Text style={styles.title}>Le don en ligne arrive bientôt</Text>
            <Text style={styles.text}>En attendant, vous pouvez donner lors des cultes, au moment des offrandes.</Text>
          </Card>
        )}
        <Body style={{ marginTop: space.lg }}>
          Vos coordonnées bancaires ne transitent jamais par l&apos;application. Une question sur les dons ?
        </Body>
        <Btn label="Appeler l'église" variant="secondary" icon="call-outline" onPress={call} style={{ marginTop: space.md }} />
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  icon: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(248,226,176,0.7)", alignItems: "center", justifyContent: "center" },
  title: { fontFamily: fonts.bodyBold, fontSize: 16, color: colors.ink },
  text: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, color: colors.muted, marginTop: 2 },
});
