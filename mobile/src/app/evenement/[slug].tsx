import { Image } from "expo-image";
import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Body, Btn, Eyebrow, Photo, Screen, Section, Title } from "@/components/ui";
import { openApp, openWeb } from "@/lib/open";
import { photos } from "@/lib/photos";
import { colors, fonts, space } from "@/lib/theme";
import { featuredVideos, site } from "@shared/site";

const eschatosPhotos = [photos.eschatos1, photos.eschatos2, photos.eschatos3, photos.eschatos4, photos.eschatos5];

export default function Evenement() {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  if (slug === "worship-sessions") {
    return (
      <Screen tabBar={false}>
        <Stack.Screen options={{ title: "Worship Sessions" }} />
        <Photo source={photos.worship2} height={260} radius={0} style={{ marginHorizontal: -space.lg, width: undefined }} />
        <Section style={{ marginTop: space.lg }}>
          <Eyebrow>Adoration · Louange · Présence de Dieu</Eyebrow>
          <Title as="h1" lead="Worship" accent="Sessions" size={38} />
          <Body>
            Des moments spécialement consacrés à la louange, à l&apos;adoration et à la recherche de la présence de Dieu. À travers les chants, les prières spontanées et les temps de communion, nous créons un environnement propice à la rencontre avec le Saint-Esprit.
          </Body>
          <View style={{ gap: 10, marginTop: space.lg }}>
            {featuredVideos.map((v) => (
              <Btn key={v.id} label={`Regarder : ${v.title}`} icon="logo-youtube" variant="secondary" onPress={() => openApp(`https://www.youtube.com/watch?v=${v.id}`)} />
            ))}
          </View>
        </Section>
      </Screen>
    );
  }

  return (
    <Screen tabBar={false}>
      <Stack.Screen options={{ title: "ESCHATOS 2026" }} />
      <Photo source={photos.eschatos} height={240} radius={0} style={{ marginHorizontal: -space.lg, width: undefined }} />
      <Section style={{ marginTop: space.lg }}>
        <Eyebrow>Conférence annuelle d&apos;eschatologie</Eyebrow>
        <Title as="h1" lead="ESCHATOS" accent="2026" size={40} />
        <Text style={styles.theme}>La bataille de Gog et Magog sur les Montagnes d&apos;Israël</Text>
        <Body>
          ESCHATOS est la conférence annuelle des Assemblées Fleuve de Vie pour les Nations consacrée à l&apos;étude des temps de la fin, des prophéties bibliques et des événements annonçant le retour glorieux de notre Seigneur Jésus-Christ.
        </Body>
        <Body>Cette édition a marqué la présentation du premier ouvrage du Pasteur Diez Mendez Kambault : « La Dernière Génération ».</Body>
        <Btn label="Se procurer le livre" onPress={() => openWeb(site.bookShop)} style={{ marginTop: space.lg }} />
      </Section>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -space.lg, marginTop: space.xl }} contentContainerStyle={{ paddingHorizontal: space.lg, gap: 12 }}>
        {eschatosPhotos.map((p, i) => (
          <Image key={i} source={p} alt={`ESCHATOS 2026 — photo ${i + 1}`} style={styles.photo} contentFit="cover" />
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  theme: { fontFamily: fonts.displayItalic, fontSize: 19, lineHeight: 25, color: colors.gold700, marginTop: 8 },
  photo: { width: 260, height: 180, borderRadius: 16 },
});
