import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Body, Btn, Card, Chip, Eyebrow, Hero, Photo, RowLink, Screen, Section, Title, type IconName } from "@/components/ui";
import { call, openWeb } from "@/lib/open";
import { galleryPhotos, photos } from "@/lib/photos";
import { colors, fonts, space } from "@/lib/theme";
import { ministries, pastorQuote, site } from "@shared/site";

const ministryIcons: Record<string, IconName> = { target: "locate-outline", music: "musical-notes-outline", spark: "sparkles", heart: "heart-outline", diamond: "diamond-outline", arrow: "megaphone-outline" };

const timeline = [
  { when: "1988", what: "La vision naît dans le cœur de l'Apôtre Pamphile Jean Sylvain MAYINGUIDI." },
  { when: "République du Congo", what: "Premières assemblées et développement de la vision." },
  { when: "RD Congo", what: "La vision se déploie en République Démocratique du Congo." },
  { when: "France", what: "Implantation d'églises de proximité, dont l'église de Nantes." },
];

export default function Eglise() {
  return (
    <Screen hero={<Hero eyebrow="Notre église" lead="Un fleuve de vie" accent="au cœur de Nantes." intro="Une vision apostolique portée par la Parole, l'Esprit et la Croix, afin de former des porteurs de vie pour les nations." />}>
      <Section style={{ marginTop: space.xl }}>
        <Photo source={photos.visionnaires} height={250} alt="Apôtre Pamphile Jean Sylvain MAYINGUIDI et Ancienne Octavie Estelle MAYINGUIDI" />
        <Card tone="dark" style={{ marginTop: -18, marginHorizontal: 8 }}>
          <Text style={styles.leader}>Apôtre Pamphile Jean Sylvain MAYINGUIDI</Text>
          <Text style={styles.leaderRole}>Visionnaire des Assemblées Fleuve de Vie pour les Nations</Text>
          <View style={styles.sep} />
          <Text style={styles.leader}>Ancienne Octavie Estelle MAYINGUIDI</Text>
          <Text style={styles.leaderRole}>Son épouse</Text>
        </Card>
      </Section>

      <Section>
        <Eyebrow>Historique & vision</Eyebrow>
        <Title lead="Le fleuve," accent="l'Évangile en mouvement." size={30} />
        <Body>
          Née dans le cœur de son leader depuis la fin de l&apos;année 1988, la vision des AFVN s&apos;est développée en République du Congo, puis en RD Congo et en France. Elle est centrée sur la communication de la vie de Dieu à travers la prédication de l&apos;Évangile.
        </Body>
        <View style={styles.chips}>
          {["La Parole", "L'Esprit", "La Croix"].map((c) => (
            <Chip key={c} label={c} />
          ))}
        </View>
        <View style={styles.timeline}>
          {timeline.map((t) => (
            <View key={t.when} style={styles.step}>
              <View style={styles.stepDot} />
              <Text style={styles.stepWhen}>{t.when}</Text>
              <Text style={styles.stepWhat}>{t.what}</Text>
            </View>
          ))}
        </View>
      </Section>

      <Section>
        <Card tone="dark">
          <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
            <Image source={photos.pasteur} alt="Pasteur Diez Mendez Kambault" style={styles.pastorImg} accessibilityIgnoresInvertColors />
            <View style={{ flex: 1 }}>
              <Text style={styles.kicker}>Le pasteur local</Text>
              <Text style={styles.pastorName}>Pasteur Diez Mendez Kambault</Text>
            </View>
          </View>
          <Text style={styles.quote}>« {pastorQuote} »</Text>
          <Body tone="dark">
            Marié et père d&apos;une fille, il prêche l&apos;Évangile depuis 2013. Son ministère : formation des disciples, mentorat transformationnel et accompagnement spirituel. Auteur de « La Dernière Génération ».
          </Body>
          <View style={{ gap: 10, marginTop: space.lg }}>
            <Btn label="Se procurer le livre" variant="ghostDark" onPress={() => openWeb(site.bookShop)} />
            <Btn label="Contacter le pasteur" variant="ghostDark" icon="call-outline" onPress={call} />
          </View>
        </Card>
      </Section>

      <Section>
        <Eyebrow>Une place pour chacun</Eyebrow>
        <Title lead="Découvrez nos" accent="ministères." size={30} />
        <View style={styles.grid}>
          {ministries.map((m) => (
            <View key={m.title} style={styles.ministry}>
              <Ionicons name={ministryIcons[m.icon]} size={22} color={colors.gold700} />
              <Text style={styles.ministryTitle}>{m.title}</Text>
              <Text style={styles.ministryText}>{m.text}</Text>
            </View>
          ))}
        </View>
        <Btn label="Je veux servir" onPress={() => router.push("/nouveau")} style={{ marginTop: space.lg }} />
      </Section>

      <Section>
        <Eyebrow>Vie de l&apos;église</Eyebrow>
        <Title lead="Nos cultes," accent="notre famille." size={30} />
      </Section>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -space.lg, marginTop: space.lg }} contentContainerStyle={{ paddingHorizontal: space.lg, gap: 12 }}>
        {galleryPhotos.map((p) => (
          <Image key={p.alt} source={p.src} alt={p.alt} style={styles.galleryImg} contentFit="cover" transition={200} />
        ))}
      </ScrollView>

      <Section>
        <View style={{ gap: 10 }}>
          <RowLink icon="gift-outline" title="Donner" subtitle="Dîmes, offrandes et projets" onPress={() => router.push("/donner")} />
          <RowLink icon="settings-outline" title="Réglages & rappels" subtitle="Notifications, mentions légales" onPress={() => router.push("/reglages")} />
        </View>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  leader: { fontFamily: fonts.display, fontSize: 18, color: colors.gold300 },
  leaderRole: { fontFamily: fonts.body, fontSize: 13.5, color: "rgba(255,255,255,0.65)", marginTop: 3 },
  sep: { height: StyleSheet.hairlineWidth, backgroundColor: colors.lineDark, marginVertical: 14 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: space.lg },
  timeline: { marginTop: space.lg, borderLeftWidth: 1, borderLeftColor: "rgba(226,163,58,0.5)", marginLeft: 4 },
  step: { paddingLeft: 20, paddingBottom: 18 },
  stepDot: { position: "absolute", left: -5, top: 4, width: 9, height: 9, borderRadius: 5, backgroundColor: colors.gold400 },
  stepWhen: { fontFamily: fonts.bodyBold, fontSize: 11.5, letterSpacing: 2, textTransform: "uppercase", color: colors.gold700 },
  stepWhat: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22, color: colors.muted, marginTop: 2 },
  pastorImg: { width: 72, height: 72, borderRadius: 36 },
  kicker: { fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: colors.gold400 },
  pastorName: { fontFamily: fonts.display, fontSize: 21, color: colors.white, marginTop: 4 },
  quote: { fontFamily: fonts.display, fontSize: 18, lineHeight: 25, color: colors.white, marginTop: space.lg, borderLeftWidth: 2, borderLeftColor: colors.gold400, paddingLeft: 14 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: space.lg },
  ministry: { width: "48.5%", backgroundColor: colors.white, borderRadius: 18, padding: 16, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  ministryTitle: { fontFamily: fonts.display, fontSize: 19, color: colors.ink, marginTop: 12 },
  ministryText: { fontFamily: fonts.body, fontSize: 13.5, lineHeight: 19, color: colors.muted, marginTop: 4 },
  galleryImg: { width: 220, height: 280, borderRadius: 16 },
});
