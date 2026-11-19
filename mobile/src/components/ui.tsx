import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import type { ComponentProps, ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, type ImageStyle, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { tap } from "@/lib/open";
import { colors, fonts, space } from "@/lib/theme";

type Tone = "light" | "dark";
export type IconName = ComponentProps<typeof Ionicons>["name"];

// Écran défilant. `hero` est affiché en haut sur fond nuit (sous la barre d'état).
export function Screen({ children, hero, tabBar = true, underHeader = false }: { children: ReactNode; hero?: ReactNode; tabBar?: boolean; underHeader?: boolean }) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.cream }}
      contentContainerStyle={{ paddingBottom: (tabBar ? 32 : 24) + insets.bottom }}
      contentInsetAdjustmentBehavior="never"
    >
      {hero ? <View style={[styles.hero, { paddingTop: (underHeader ? 0 : insets.top) + space.lg }]}>{hero}</View> : null}
      <View style={styles.body}>{children}</View>
    </ScrollView>
  );
}

export function Eyebrow({ children, tone = "light" }: { children: ReactNode; tone?: Tone }) {
  return <Text style={[styles.eyebrow, { color: tone === "dark" ? colors.gold400 : colors.gold700 }]}>{children}</Text>;
}

export function Title({ lead, accent, tone = "light", size = 34, as = "h2" }: { lead: string; accent?: string; tone?: Tone; size?: number; as?: "h1" | "h2" }) {
  return (
    <Text
      accessibilityRole="header"
      aria-level={as === "h1" ? 1 : 2}
      style={[styles.title, { fontSize: size, lineHeight: size * 1.1, color: tone === "dark" ? colors.white : colors.ink }]}
    >
      {lead}
      {accent ? (
        <Text style={{ fontFamily: fonts.displayItalic, color: tone === "dark" ? colors.gold400 : colors.gold700 }}> {accent}</Text>
      ) : null}
    </Text>
  );
}

export function Body({ children, tone = "light", style }: { children: ReactNode; tone?: Tone; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.body_text, { color: tone === "dark" ? "rgba(255,255,255,0.78)" : colors.muted }, style]}>{children}</Text>;
}

type BtnVariant = "primary" | "secondary" | "ghostDark";

export function Btn({
  label,
  onPress,
  variant = "primary",
  icon,
  style,
  accessibilityHint,
}: {
  label: string;
  onPress: () => void;
  variant?: BtnVariant;
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
}) {
  const v = {
    primary: { bg: colors.gold400, fg: colors.night950, border: colors.gold400 },
    secondary: { bg: "transparent", fg: colors.ink, border: "rgba(17,41,59,0.25)" },
    ghostDark: { bg: "transparent", fg: colors.white, border: "rgba(255,255,255,0.35)" },
  }[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint={accessibilityHint}
      onPress={() => {
        tap();
        onPress();
      }}
      style={({ pressed }) => [styles.btn, { backgroundColor: v.bg, borderColor: v.border, transform: [{ scale: pressed ? 0.97 : 1 }] }, style]}
    >
      {icon ? <Ionicons name={icon} size={18} color={v.fg} /> : null}
      <Text style={[styles.btnText, { color: v.fg }]}>{label}</Text>
    </Pressable>
  );
}

export function Card({ children, tone = "light", style }: { children: ReactNode; tone?: Tone; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, tone === "dark" ? styles.cardDark : null, style]}>{children}</View>;
}

export function Section({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ marginTop: space.xxl }, style]}>{children}</View>;
}

// Ligne cliquable : icône, titre, sous-titre, chevron.
export function RowLink({ icon, title, subtitle, onPress, tone = "light", external }: { icon: IconName; title: string; subtitle?: string; onPress: () => void; tone?: Tone; external?: boolean }) {
  const dark = tone === "dark";
  return (
    <Pressable
      accessibilityRole={external ? "link" : "button"}
      onPress={() => {
        tap();
        onPress();
      }}
      style={({ pressed }) => [styles.row, { backgroundColor: pressed ? (dark ? "rgba(255,255,255,0.06)" : "#efe8da") : dark ? "transparent" : colors.white, borderColor: dark ? colors.lineDark : colors.line }]}
    >
      <View style={[styles.rowIcon, { backgroundColor: dark ? "rgba(239,181,74,0.14)" : "rgba(248,226,176,0.7)" }]}>
        <Ionicons name={icon} size={20} color={dark ? colors.gold400 : colors.gold700} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowTitle, { color: dark ? colors.white : colors.ink }]}>{title}</Text>
        {subtitle ? <Text style={[styles.rowSub, { color: dark ? "rgba(255,255,255,0.65)" : colors.muted }]}>{subtitle}</Text> : null}
      </View>
      <Ionicons name={external ? "open-outline" : "chevron-forward"} size={18} color={dark ? "rgba(255,255,255,0.5)" : colors.muted} />
    </Pressable>
  );
}

export function Photo({ source, height = 220, radius = 18, style, alt = "" }: { source: number; height?: number; radius?: number; style?: StyleProp<ImageStyle>; alt?: string }) {
  return <Image source={source} alt={alt} contentFit="cover" transition={200} accessibilityIgnoresInvertColors style={[{ width: "100%", height, borderRadius: radius }, style]} />;
}

export function Chip({ label }: { label: string }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.night950, paddingHorizontal: space.lg, paddingBottom: space.xl },
  body: { paddingHorizontal: space.lg },
  eyebrow: { fontFamily: fonts.bodyBold, fontSize: 11.5, letterSpacing: 2.6, textTransform: "uppercase" },
  title: { fontFamily: fonts.display, marginTop: 10, letterSpacing: -0.3 },
  body_text: { fontFamily: fonts.body, fontSize: 16.5, lineHeight: 26, marginTop: 12 },
  btn: { minHeight: 52, borderRadius: 999, borderWidth: 1, paddingHorizontal: 22, flexDirection: "row", gap: 8, alignItems: "center", justifyContent: "center" },
  btnText: { fontFamily: fonts.bodyBold, fontSize: 15.5 },
  card: { backgroundColor: colors.white, borderRadius: 20, padding: space.lg, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  cardDark: { backgroundColor: colors.night950, borderColor: colors.night800 },
  row: { flexDirection: "row", alignItems: "center", gap: 14, padding: 14, borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, minHeight: 64 },
  rowIcon: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  rowTitle: { fontFamily: fonts.bodyBold, fontSize: 16 },
  rowSub: { fontFamily: fonts.body, fontSize: 13.5, marginTop: 2 },
  chip: { borderWidth: 1, borderColor: "rgba(17,41,59,0.2)", borderRadius: 999, paddingHorizontal: 14, paddingVertical: 7 },
  chipText: { fontFamily: fonts.bodyBold, fontSize: 12.5, color: colors.ink },
});

// En-tête standard d'un onglet (fond nuit).
export function Hero({ eyebrow, lead, accent, intro, children }: { eyebrow: string; lead: string; accent?: string; intro?: string; children?: ReactNode }) {
  return (
    <>
      <Eyebrow tone="dark">{eyebrow}</Eyebrow>
      <Title tone="dark" as="h1" lead={lead} accent={accent} size={40} />
      {intro ? <Body tone="dark">{intro}</Body> : null}
      {children}
    </>
  );
}
