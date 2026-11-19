import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";
import { Body, Btn, Card, Eyebrow, Photo, RowLink, Screen, Section, Title } from "@/components/ui";
import { call, directions, openWeb } from "@/lib/open";
import { photos } from "@/lib/photos";
import { colors, fonts, space } from "@/lib/theme";
import { faq, formatTime, schedule, site } from "@shared/site";

const expect = [
  { t: "Un accueil personnel", d: "L'équipe CESA vous reçoit, vous présente l'église et répond à vos questions." },
  { t: "Un culte vivant", d: "Louange, prière et prédication de la Parole : la célébration du dimanche dure environ deux heures." },
  { t: "Une famille", d: "Après le culte, prenez le temps de faire connaissance : vous êtes ici chez vous." },
];

export default function Nouveau() {
  return (
    <Screen tabBar={false}>
      <Section style={{ marginTop: space.lg }}>
        <Eyebrow>Venez comme vous êtes</Eyebrow>
        <Title as="h1" lead="Bienvenue" accent="à la Maison." size={38} />
        <Body>{faq[2].a}</Body>
        <Btn label="Remplir le formulaire d'accueil (2 min)" onPress={() => openWeb(site.welcomeForm)} style={{ marginTop: space.lg }} />
        <View style={styles.private}>
          <Ionicons name="lock-closed-outline" size={14} color={colors.gold700} />
          <Text style={styles.privateText}>Vos informations vont uniquement à l&apos;équipe d&apos;accueil.</Text>
        </View>
      </Section>

      <Section>
        <Photo source={photos.sortie} height={210} />
        <Eyebrow>{"\n"}Votre première visite</Eyebrow>
        <Title lead="À quoi" accent="vous attendre ?" size={30} />
        <View style={{ gap: 18, marginTop: space.lg }}>
          {expect.map((e, i) => (
            <View key={e.t} style={{ flexDirection: "row", gap: 14 }}>
              <Text style={styles.num}>0{i + 1}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepTitle}>{e.t}</Text>
                <Text style={styles.stepText}>{e.d}</Text>
              </View>
            </View>
          ))}
        </View>
      </Section>

      <Section>
        <Card tone="dark">
          <Text style={styles.kicker}>Infos pratiques</Text>
          {schedule.map((s) => (
            <View key={s.day} style={{ marginTop: 14 }}>
              <Text style={styles.dt}>{s.day}</Text>
              <Text style={styles.dd}>
                {s.title} · {formatTime(s.start)}
              </Text>
            </View>
          ))}
          <View style={{ marginTop: 14 }}>
            <Text style={styles.dt}>Adresse</Text>
            <Text style={styles.dd}>
              {site.address.street}, {site.address.postalCode} {site.address.city}
            </Text>
          </View>
        </Card>
        <View style={{ gap: 10, marginTop: space.md }}>
          <RowLink icon="navigate-outline" title="Itinéraire" subtitle="Ouvrir dans l'application Plans" onPress={directions} external />
          <RowLink icon="call-outline" title="Appeler l'église" subtitle={site.phone.display} onPress={call} external />
        </View>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  private: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12, justifyContent: "center" },
  privateText: { fontFamily: fonts.body, fontSize: 13, color: colors.muted },
  num: { fontFamily: fonts.display, fontSize: 30, color: colors.gold700 },
  stepTitle: { fontFamily: fonts.display, fontSize: 20, color: colors.ink },
  stepText: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22, color: colors.muted, marginTop: 3 },
  kicker: { fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: colors.gold400 },
  dt: { fontFamily: fonts.body, fontSize: 13, color: "rgba(255,255,255,0.6)" },
  dd: { fontFamily: fonts.display, fontSize: 19, color: colors.white, marginTop: 2 },
});
