import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { NextPill } from "@/components/schedule";
import { Body, Btn, Eyebrow, Hero, RowLink, Screen, Section, Title } from "@/components/ui";
import { openApp, tap } from "@/lib/open";
import { colors, fonts, space } from "@/lib/theme";
import { featuredVideos, formatTime, schedule, site } from "@shared/site";

const sunday = schedule.find((s) => s.live) ?? schedule[0];

export default function Live() {
  return (
    <Screen
      hero={
        <Hero eyebrow="L'église partout avec vous" lead="Vivez le culte." accent="Où que vous soyez." intro="Rejoignez la célébration chaque dimanche, retrouvez les replays et partagez un message d'espérance.">
          <View style={{ marginTop: space.lg }}>
            <NextPill />
          </View>
          <Btn label="Regarder le direct sur YouTube" icon="play" onPress={() => openApp(site.liveUrl)} style={{ marginTop: space.lg }} />
          <Text style={styles.when}>
            Direct chaque {sunday.day.toLowerCase()} · {formatTime(sunday.start)} — {formatTime(sunday.end)}
          </Text>
        </Hero>
      }
    >
      <Section style={{ marginTop: space.xl }}>
        <Eyebrow>Nourrir sa foi</Eyebrow>
        <Title lead="Derniers" accent="messages." size={30} />
        <View style={{ gap: 18, marginTop: space.lg }}>
          {featuredVideos.map((v) => (
            <Pressable
              key={v.id}
              accessibilityRole="link"
              accessibilityLabel={`Regarder sur YouTube : ${v.title}`}
              onPress={() => {
                tap();
                openApp(`https://www.youtube.com/watch?v=${v.id}`);
              }}
            >
              <View style={styles.thumb}>
                <Image alt="" source={{ uri: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg` }} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
                <View style={styles.play}>
                  <Ionicons name="play" size={26} color={colors.night950} style={{ marginLeft: 3 }} />
                </View>
              </View>
              <Text style={styles.kind}>{v.kind}</Text>
              <Text style={styles.videoTitle}>{v.title}</Text>
            </Pressable>
          ))}
        </View>
      </Section>

      <Section>
        <Eyebrow>Restons connectés</Eyebrow>
        <Body>Abonnez-vous pour être averti de chaque nouvelle prédication.</Body>
        <View style={{ gap: 10, marginTop: space.lg }}>
          <RowLink icon="logo-youtube" title="Chaîne YouTube" subtitle="Prédications, louange, replays" onPress={() => openApp(site.socials.youtube)} external />
          <RowLink icon="logo-instagram" title="Instagram" subtitle="@afvnnantes" onPress={() => openApp(site.socials.instagram)} external />
          <RowLink icon="logo-facebook" title="Facebook" subtitle="AFVN Église de Nantes" onPress={() => openApp(site.socials.facebook)} external />
        </View>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  when: { fontFamily: fonts.bodyMedium, fontSize: 13.5, color: "rgba(255,255,255,0.65)", marginTop: 12, textAlign: "center" },
  thumb: { aspectRatio: 16 / 9, borderRadius: 18, overflow: "hidden", backgroundColor: colors.night900, alignItems: "center", justifyContent: "center" },
  play: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.gold400, alignItems: "center", justifyContent: "center" },
  kind: { fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: colors.gold700, marginTop: 12 },
  videoTitle: { fontFamily: fonts.display, fontSize: 20, color: colors.ink, marginTop: 2 },
});
