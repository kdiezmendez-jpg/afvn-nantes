import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Body, Btn, Card, Eyebrow, Hero, RowLink, Screen, Section, Title } from "@/components/ui";
import { call, openWeb } from "@/lib/open";
import { colors, fonts, space } from "@/lib/theme";
import { site } from "@shared/site";

const support = [
  { t: "Accompagnement pastoral", d: "Un temps d'écoute et de prière avec le pasteur ou un responsable.", icon: "chatbubbles-outline" as const },
  { t: "Baptême & intégration", d: "Faire le pas du baptême et trouver sa place dans l'église.", icon: "water-outline" as const },
  { t: "Visite et soutien", d: "Être visité et soutenu dans les moments difficiles.", icon: "heart-outline" as const },
];

export default function Priere() {
  const hasForm = Boolean(site.prayerForm);
  return (
    <Screen
      tabBar={false}
      underHeader
      hero={
        <Hero eyebrow="Nous prions avec vous" lead="Vous n'avez pas à" accent="porter cela seul." intro="Confiez-nous votre sujet de prière. Votre demande est reçue uniquement par l'équipe pastorale et vous pouvez rester anonyme.">
          {hasForm ? (
            <Btn label="Déposer une demande de prière" icon="create-outline" onPress={() => openWeb(site.prayerForm)} style={{ marginTop: space.lg }} />
          ) : null}
          <Btn label="Appeler l'équipe de prière" icon="call-outline" variant={hasForm ? "ghostDark" : "primary"} onPress={call} style={{ marginTop: 10 }} />
          <View style={styles.private}>
            <Ionicons name="lock-closed-outline" size={14} color={colors.gold400} />
            <Text style={styles.privateText}>Confidentiel & respectueux de votre vie privée</Text>
          </View>
        </Hero>
      }
    >
      <Section style={{ marginTop: space.xl }}>
        <Eyebrow>Nous marchons avec vous</Eyebrow>
        <Title lead="Un accompagnement" accent="à chaque saison." size={30} />
        <View style={{ gap: 12, marginTop: space.lg }}>
          {support.map((s) => (
            <Card key={s.t}>
              <Ionicons name={s.icon} size={22} color={colors.gold700} />
              <Text style={styles.title}>{s.t}</Text>
              <Text style={styles.text}>{s.d}</Text>
            </Card>
          ))}
        </View>
      </Section>
      <Section>
        <Body>Vous traversez une épreuve ou vous faites un nouveau pas dans la foi ? Faisons connaissance.</Body>
        <View style={{ marginTop: space.md }}>
          <RowLink icon="hand-left-outline" title="Être accompagné(e)" subtitle="Formulaire d'accueil CESA" onPress={() => router.push("/nouveau")} />
        </View>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  private: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: space.lg, justifyContent: "center" },
  privateText: { fontFamily: fonts.bodyMedium, fontSize: 13, color: "rgba(255,255,255,0.75)" },
  title: { fontFamily: fonts.display, fontSize: 21, color: colors.ink, marginTop: 12 },
  text: { fontFamily: fonts.body, fontSize: 14.5, lineHeight: 21, color: colors.muted, marginTop: 4 },
});
