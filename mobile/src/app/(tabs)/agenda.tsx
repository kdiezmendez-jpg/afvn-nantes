import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { UpcomingList } from "@/components/schedule";
import { Btn, Eyebrow, Hero, Photo, Screen, Section, Title } from "@/components/ui";
import { tap } from "@/lib/open";
import { photos } from "@/lib/photos";
import { colors, fonts, space } from "@/lib/theme";
import { events, formatTime, schedule } from "@shared/site";

const eventPhotos: Record<string, number> = { "/medias/eschatos": photos.eschatos, "/medias/worship-sessions": photos.worship };

export default function Agenda() {
  return (
    <Screen
      hero={
        <Hero eyebrow="Cette semaine à l'AFVN" lead="Une semaine pour" accent="grandir ensemble." intro="Nos rendez-vous hebdomadaires et les temps forts de la communauté.">
          <Btn label="Me rappeler chaque culte" icon="notifications-outline" onPress={() => router.push("/reglages")} style={{ marginTop: space.lg }} />
        </Hero>
      }
    >
      <Section style={{ marginTop: space.xl }}>
        <View style={styles.week}>
          {schedule.map((s, i) => (
            <View key={s.day} style={[styles.slot, i > 0 && styles.slotBorder]}>
              <Text style={styles.short}>{s.short}</Text>
              <Text style={styles.time}>{formatTime(s.start)}</Text>
              <Text style={styles.slotTitle}>{s.title}</Text>
              <Text style={styles.slotDetail}>
                {s.day} · {formatTime(s.start)} — {formatTime(s.end)}
                {"\n"}
                {s.detail}
              </Text>
            </View>
          ))}
        </View>
      </Section>

      <Section>
        <Eyebrow>Calendrier</Eyebrow>
        <Title lead="Les prochains" accent="rendez-vous." size={30} />
        <UpcomingList count={6} />
      </Section>

      <Section>
        <Eyebrow>Temps forts</Eyebrow>
        <Title lead="Vivre l'église" accent="au-delà du dimanche." size={30} />
        <View style={{ gap: 14, marginTop: space.lg }}>
          {events.map((e) => (
            <Pressable
              key={e.href}
              accessibilityRole="button"
              onPress={() => {
                tap();
                router.push({ pathname: "/evenement/[slug]", params: { slug: e.href.split("/").pop()! } });
              }}
              style={styles.event}
            >
              <Photo source={eventPhotos[e.href]} height={180} radius={0} />
              <View style={{ padding: 16 }}>
                <Text style={styles.eventKicker}>{e.kicker}</Text>
                <Text style={styles.eventTitle}>{e.title}</Text>
                <Text style={styles.eventText}>{e.description}</Text>
              </View>
            </Pressable>
          ))}
          <View style={styles.event}>
            <Photo source={photos.theme2026} height={190} radius={0} />
            <View style={{ padding: 16 }}>
              <Text style={styles.eventKicker}>Thème de l&apos;année</Text>
              <Text style={styles.eventTitle}>2026 · Gabaon</Text>
              <Text style={styles.eventText}>Posséder les sommets des montagnes — Deutéronome 11:24</Text>
            </View>
          </View>
        </View>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  week: { backgroundColor: colors.white, borderRadius: 20, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  slot: { padding: 20 },
  slotBorder: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.line },
  short: { fontFamily: fonts.bodyBold, fontSize: 11.5, letterSpacing: 2.4, color: colors.gold700 },
  time: { fontFamily: fonts.display, fontSize: 44, color: colors.ink, marginTop: 4 },
  slotTitle: { fontFamily: fonts.bodyBold, fontSize: 17, color: colors.ink, marginTop: 4 },
  slotDetail: { fontFamily: fonts.body, fontSize: 14, lineHeight: 21, color: colors.muted, marginTop: 4 },
  event: { backgroundColor: colors.white, borderRadius: 20, overflow: "hidden", borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  eventKicker: { fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: colors.gold700 },
  eventTitle: { fontFamily: fonts.display, fontSize: 24, color: colors.ink, marginTop: 4 },
  eventText: { fontFamily: fonts.body, fontSize: 14.5, lineHeight: 21, color: colors.muted, marginTop: 4 },
});
