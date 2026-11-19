import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { router } from "expo-router";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Countdown, NextPill, UpcomingList } from "@/components/schedule";
import { Body, Btn, Card, Eyebrow, Photo, Screen, Section, Title, type IconName } from "@/components/ui";
import { directions, openApp, tap } from "@/lib/open";
import { photos } from "@/lib/photos";
import { colors, fonts, space } from "@/lib/theme";
import { announcement, dna, pastorQuote, site } from "@shared/site";

const quick: { t: string; d: string; icon: IconName; onPress: () => void }[] = [
  { t: "Suivre le direct", d: "Dimanche · 9h30", icon: "play", onPress: () => openApp(site.liveUrl) },
  { t: "Demande de prière", d: "Confidentielle", icon: "sparkles", onPress: () => router.push("/priere") },
  { t: "Je suis nouveau", d: "Accueil CESA", icon: "hand-left-outline", onPress: () => router.push("/nouveau") },
  { t: "Itinéraire", d: "69 bis, rue du Bêle", icon: "navigate-outline", onPress: directions },
];

const dnaIcons: Record<string, IconName> = { spark: "sparkles", diamond: "diamond-outline", heart: "heart-outline" };

export default function Home() {
  return (
    <ScreenWithSettings>
      <Section style={{ marginTop: space.xl }}>
        <Card tone="dark" style={{ padding: space.lg }}>
          <Title tone="dark" lead="Nous vous attendons." size={28} />
          <Text style={styles.address}>{site.address.street}, {site.address.postalCode} {site.address.city}</Text>
          <View style={{ marginTop: space.lg }}>
            <Countdown />
          </View>
        </Card>
        <View style={styles.quickGrid}>
          {quick.map((q) => (
            <Pressable
              key={q.t}
              accessibilityRole="button"
              onPress={() => {
                tap();
                q.onPress();
              }}
              style={({ pressed }) => [styles.quick, pressed && { backgroundColor: "#efe8da" }]}
            >
              <Ionicons name={q.icon} size={20} color={colors.gold700} />
              <Text style={styles.quickTitle}>{q.t}</Text>
              <Text style={styles.quickSub}>{q.d}</Text>
            </Pressable>
          ))}
        </View>
      </Section>

      {announcement ? (
        <Pressable accessibilityRole="button" onPress={() => router.push("/agenda")} style={styles.announce}>
          <Text style={styles.announceKicker}>Annonce à la une</Text>
          <Text style={styles.announceTitle}>{announcement.title}</Text>
          <Text style={styles.announceText}>{announcement.text}</Text>
        </Pressable>
      ) : null}

      <Section>
        <Eyebrow>Notre ADN</Eyebrow>
        <Title lead="Une église qui ne se contente pas d'exister." accent="Elle porte la vie." />
        <View style={{ gap: 12, marginTop: space.lg }}>
          {dna.map((d, i) => (
            <View key={d.title} style={styles.dna}>
              <Ionicons name={dnaIcons[d.icon]} size={22} color={colors.gold700} />
              <View style={{ flex: 1 }}>
                <Text style={styles.dnaTitle}>{d.title}</Text>
                <Text style={styles.dnaText}>{d.text}</Text>
              </View>
              <Text style={styles.dnaNum}>0{i + 1}</Text>
            </View>
          ))}
        </View>
      </Section>

      <Section>
        <Eyebrow>Vivre l&apos;AFVN</Eyebrow>
        <Title lead="Les prochains" accent="rendez-vous." />
        <UpcomingList count={3} />
        <Btn label="Activer les rappels de culte" icon="notifications-outline" variant="secondary" onPress={() => router.push("/reglages")} style={{ marginTop: space.md }} />
      </Section>

      <Section>
        <Card tone="dark">
          <Text style={styles.quoteKicker}>Le mot du pasteur</Text>
          <Text style={styles.quote}>« {pastorQuote} »</Text>
          <View style={styles.pastor}>
            <Image source={photos.pasteur} alt="" style={styles.pastorImg} accessibilityIgnoresInvertColors />
            <View>
              <Text style={styles.pastorName}>Pasteur Diez Mendez Kambault</Text>
              <Text style={styles.pastorRole}>Pasteur local</Text>
            </View>
          </View>
        </Card>
      </Section>

      <Section>
        <Eyebrow>Vous êtes ici pour la première fois ?</Eyebrow>
        <Title lead="Il y a une place" accent="pour vous." />
        <Body>Pas besoin de s&apos;inscrire : nos cultes sont ouverts à tous. Découvrez ce qui vous attend lors de votre première visite.</Body>
        <Photo source={photos.sortie} height={200} style={{ marginTop: space.lg }} />
        <Btn label="Préparer ma première visite" onPress={() => router.push("/nouveau")} style={{ marginTop: space.lg }} />
      </Section>
    </ScreenWithSettings>
  );
}

// En-tête de l'accueil : emblème, accroche « La Parole. L'Esprit. La Vie. » et prochain culte.
function ScreenWithSettings({ children }: { children: ReactNode }) {
  return (
    <Screen
      hero={
        <>
          <View style={styles.top}>
            <View style={styles.brand}>
              <View style={styles.logoTile}>
                <Image source={photos.emblem} alt="" style={{ width: 38, height: 38, borderRadius: 19 }} accessibilityIgnoresInvertColors />
              </View>
              <View>
                <Text style={styles.brandName}>Assemblées Fleuve de Vie</Text>
                <Text style={styles.brandSub}>pour les Nations · Nantes</Text>
              </View>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="Réglages et rappels" hitSlop={12} onPress={() => router.push("/reglages")} style={styles.gear}>
              <Ionicons name="settings-outline" size={22} color={colors.white} />
            </Pressable>
          </View>
          <Text accessibilityRole="header" style={styles.h1}>
            La Parole.{"\n"}
            <Text style={styles.h1Accent}>L&apos;Esprit.</Text>
            {"\n"}La Vie.
          </Text>
          <Body tone="dark">Une église où la Parole et l&apos;Esprit s&apos;accordent pour engendrer les porteurs de vie.</Body>
          <View style={{ marginTop: space.lg }}>
            <NextPill />
          </View>
          <View style={styles.verse}>
            <Text style={styles.verseRef}>Jean 10:10</Text>
            <Text style={styles.verseText}>« Je suis venu afin que les brebis aient la vie, et qu&apos;elles soient dans l&apos;abondance. »</Text>
          </View>
        </>
      }
    >
      {children}
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  brand: { flexDirection: "row", alignItems: "center", gap: 12 },
  logoTile: { width: 48, height: 48, borderRadius: 12, backgroundColor: colors.white, alignItems: "center", justifyContent: "center" },
  brandName: { fontFamily: fonts.display, fontSize: 16, color: colors.white },
  brandSub: { fontFamily: fonts.bodyMedium, fontSize: 11, letterSpacing: 1.6, textTransform: "uppercase", color: "rgba(255,255,255,0.6)" },
  gear: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  h1: { fontFamily: fonts.display, fontSize: 52, lineHeight: 54, color: colors.white, marginTop: space.xl },
  h1Accent: { fontFamily: fonts.displayItalic, color: colors.gold400 },
  verse: { marginTop: space.lg, backgroundColor: colors.cream, borderLeftWidth: 4, borderLeftColor: colors.gold400, padding: 16 },
  verseRef: { fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: colors.gold700 },
  verseText: { fontFamily: fonts.display, fontSize: 17, lineHeight: 23, color: colors.ink, marginTop: 6 },
  address: { fontFamily: fonts.body, fontSize: 14, color: "rgba(255,255,255,0.65)", marginTop: 6 },
  quickGrid: { flexDirection: "row", flexWrap: "wrap", marginTop: 12, borderRadius: 18, overflow: "hidden", borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line, backgroundColor: colors.white },
  quick: { width: "50%", padding: 16, minHeight: 96, borderColor: colors.line, borderRightWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth },
  quickTitle: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.ink, marginTop: 10 },
  quickSub: { fontFamily: fonts.body, fontSize: 12.5, color: colors.muted, marginTop: 2 },
  announce: { marginTop: space.xl, backgroundColor: colors.gold400, padding: 18, borderRadius: 16 },
  announceKicker: { fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: colors.night950 },
  announceTitle: { fontFamily: fonts.display, fontSize: 21, color: colors.night950, marginTop: 4 },
  announceText: { fontFamily: fonts.body, fontSize: 14.5, lineHeight: 21, color: colors.night950, marginTop: 4 },
  dna: { flexDirection: "row", gap: 14, alignItems: "flex-start", backgroundColor: colors.white, borderRadius: 18, padding: 18, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  dnaTitle: { fontFamily: fonts.display, fontSize: 21, color: colors.ink },
  dnaText: { fontFamily: fonts.body, fontSize: 14.5, lineHeight: 21, color: colors.muted, marginTop: 3 },
  dnaNum: { fontFamily: fonts.bodyBold, fontSize: 12, color: colors.gold700 },
  quoteKicker: { fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: colors.gold400 },
  quote: { fontFamily: fonts.display, fontSize: 21, lineHeight: 29, color: colors.white, marginTop: 12 },
  pastor: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: space.lg },
  pastorImg: { width: 48, height: 48, borderRadius: 24 },
  pastorName: { fontFamily: fonts.bodyBold, fontSize: 14.5, color: colors.white },
  pastorRole: { fontFamily: fonts.body, fontSize: 13, color: "rgba(255,255,255,0.6)" },
});
