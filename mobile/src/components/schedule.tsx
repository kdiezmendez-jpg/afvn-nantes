import { useEffect, useMemo, useState } from "react";
import { AppState, StyleSheet, Text, View } from "react-native";
import { frDayNum, frMonth, relativeDay, upcoming, type Occurrence } from "@shared/schedule";
import { formatTime, schedule } from "@shared/site";
import { colors, fonts, space } from "@/lib/theme";

// Horloge : se met à jour régulièrement et au retour dans l'appli.
export function useNow(ms: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), ms);
    const sub = AppState.addEventListener("change", (s) => s === "active" && setNow(Date.now()));
    return () => {
      clearInterval(id);
      sub.remove();
    };
  }, [ms]);
  return now;
}

// Prochains rendez-vous, calculés à l'heure de Nantes (même code que le site).
export function useUpcoming(count: number, tick = 30_000): Occurrence[] {
  const now = useNow(tick);
  return useMemo(() => {
    try {
      return upcoming(count, new Date(now));
    } catch {
      return [];
    }
  }, [now, count]);
}

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return [
    ["jours", Math.floor(s / 86400)],
    ["heures", Math.floor((s % 86400) / 3600)],
    ["min", Math.floor((s % 3600) / 60)],
    ["sec", s % 60],
  ] as const;
}

export function Countdown() {
  const next = useUpcoming(1)[0];
  const now = useNow(1000);
  if (!next) {
    return <Text style={styles.fallback}>{schedule.map((s) => `${s.day} ${formatTime(s.start)}`).join(" · ")}</Text>;
  }
  const label = `${next.live ? "En ce moment" : "Prochain culte"} · ${relativeDay(next.start)} ${formatTime(next.slot.start)}`;
  return (
    <View accessible accessibilityLabel={next.live ? `${next.slot.title} en cours` : `${label}, ${next.slot.title}`}>
      <Text style={styles.label}>{label}</Text>
      {next.live ? (
        <Text style={styles.live}>{next.slot.title} en cours</Text>
      ) : (
        <View style={styles.cells}>
          {parts(next.start.getTime() - now).map(([l, v]) => (
            <View key={l} style={styles.cell}>
              <Text style={styles.cellNum}>{String(v).padStart(2, "0")}</Text>
              <Text style={styles.cellLabel}>{l}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export function NextPill() {
  const next = useUpcoming(1)[0];
  if (!next) return null;
  return (
    <View style={styles.pill}>
      <View style={[styles.dot, { backgroundColor: next.live ? "#ef4444" : colors.gold400 }]} />
      <View>
        <Text style={styles.pillLabel}>{next.live ? "En ce moment" : "Prochain culte"}</Text>
        <Text style={styles.pillText}>
          {next.live ? next.slot.title : `${relativeDay(next.start)} · ${formatTime(next.slot.start)} — ${formatTime(next.slot.end)}`}
        </Text>
      </View>
    </View>
  );
}

export function UpcomingList({ count = 3 }: { count?: number }) {
  const list = useUpcoming(count, 60_000);
  return (
    <View style={{ gap: 12, marginTop: space.lg }}>
      {list.map((o, i) => {
        const featured = i === 0;
        return (
          <View key={o.start.toISOString()} style={[styles.item, featured ? styles.itemFeatured : null]}>
            <View style={[styles.date, { borderColor: featured ? "rgba(239,181,74,0.6)" : colors.line }]}>
              <Text style={[styles.dateNum, { color: featured ? colors.white : colors.ink }]}>{frDayNum(o.start)}</Text>
              <Text style={[styles.dateMonth, { color: featured ? colors.gold400 : colors.gold700 }]}>{frMonth(o.start)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.itemKicker, { color: featured ? colors.gold400 : colors.gold700 }]}>{o.live ? "En ce moment" : relativeDay(o.start)}</Text>
              <Text style={[styles.itemTitle, { color: featured ? colors.white : colors.ink }]}>{o.slot.title}</Text>
              <Text style={[styles.itemTime, { color: featured ? "rgba(255,255,255,0.7)" : colors.muted }]}>
                {formatTime(o.slot.start)} — {formatTime(o.slot.end)}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: { fontFamily: fonts.bodyBold, color: colors.white, fontSize: 16 },
  label: { fontFamily: fonts.bodyBold, fontSize: 11.5, letterSpacing: 2.2, textTransform: "uppercase", color: colors.gold400 },
  live: { fontFamily: fonts.display, fontSize: 26, color: colors.white, marginTop: 10 },
  cells: { flexDirection: "row", gap: 8, marginTop: 14 },
  cell: { flex: 1, borderRadius: 14, borderWidth: 1, borderColor: colors.lineDark, backgroundColor: "rgba(255,255,255,0.04)", paddingVertical: 12, alignItems: "center" },
  cellNum: { fontFamily: fonts.display, fontSize: 30, color: colors.gold400, fontVariant: ["tabular-nums"] },
  cellLabel: { fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginTop: 2 },
  pill: { flexDirection: "row", alignItems: "center", gap: 10, alignSelf: "flex-start", borderRadius: 999, borderWidth: 1, borderColor: colors.lineDark, backgroundColor: "rgba(6,28,43,0.8)", paddingHorizontal: 14, paddingVertical: 8 },
  dot: { width: 9, height: 9, borderRadius: 5 },
  pillLabel: { fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 1.6, textTransform: "uppercase", color: "rgba(255,255,255,0.6)" },
  pillText: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.white },
  item: { flexDirection: "row", gap: 16, padding: 16, borderRadius: 18, backgroundColor: colors.white, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line, alignItems: "center" },
  itemFeatured: { backgroundColor: colors.night900, borderColor: colors.night800 },
  date: { width: 60, borderWidth: 1, paddingVertical: 8, alignItems: "center" },
  dateNum: { fontFamily: fonts.display, fontSize: 26, lineHeight: 30 },
  dateMonth: { fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase" },
  itemKicker: { fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 1.6, textTransform: "uppercase" },
  itemTitle: { fontFamily: fonts.display, fontSize: 19, marginTop: 2 },
  itemTime: { fontFamily: fonts.body, fontSize: 14, marginTop: 2 },
});
