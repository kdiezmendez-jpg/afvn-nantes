import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MemberGate } from "@/components/member-gate";
import { Body, Btn, Eyebrow, Title } from "@/components/ui";
import { VideoView } from "@/components/video-view";
import { MAX_PARTICIPANTS, useGroupCall } from "@/lib/call";
import { isServant, type Member } from "@/lib/members";
import { tap } from "@/lib/open";
import { colors, fonts, space } from "@/lib/theme";
import { watchSession, type TrainingSession } from "@/lib/training";

export default function Appel() {
  return <MemberGate allow={isServant}>{(m) => <Content member={m} />}</MemberGate>;
}

function Content({ member }: { member: Member }) {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [session, setSession] = useState<TrainingSession | null>(null);
  useEffect(() => watchSession(id, setSession), [id]);
  const call = useGroupCall(id, { uid: member.uid, name: `${member.firstName} ${member.lastName}` });
  const insets = useSafeAreaInsets();
  const others = call.participants.filter((p) => p.uid !== member.uid);

  if (!call.joined) {
    return (
      <View style={[styles.lobby, { paddingBottom: insets.bottom + 24 }]}>
        <Stack.Screen options={{ title: "Appel de formation" }} />
        <Eyebrow tone="dark">Petit groupe · {MAX_PARTICIPANTS} personnes maximum</Eyebrow>
        <Title tone="dark" as="h1" lead={session?.title ?? "Appel"} size={30} />
        <Body tone="dark">
          {others.length === 0 ? "Personne n'est encore dans l'appel." : `Déjà présents : ${others.map((p) => p.name.split(" ")[0]).join(", ")}.`}
        </Body>
        <Body tone="dark" style={{ fontSize: 14 }}>
          L&apos;appel passe directement entre les téléphones : rien n&apos;est enregistré, aucun serveur vidéo.
        </Body>
        {call.error ? <Text style={styles.error}>{call.error}</Text> : null}
        <Btn label="Rejoindre l'appel" icon="videocam-outline" onPress={call.join} style={{ marginTop: space.xl }} />
      </View>
    );
  }

  const tiles = [{ uid: member.uid, name: "Vous", stream: call.local, state: "connected", me: true }, ...call.remotes.map((r) => ({ ...r, me: false }))];
  const cols = tiles.length <= 2 ? 1 : 2;

  return (
    <View style={{ flex: 1, backgroundColor: colors.night950 }}>
      <Stack.Screen options={{ title: `${tiles.length} participant${tiles.length > 1 ? "s" : ""}` }} />
      <View style={styles.grid} accessibilityLabel={`${tiles.length} participants dans l'appel`}>
        {tiles.map((t) => (
          <View key={t.uid} style={[styles.tile, { width: cols === 1 ? "100%" : "49%", height: tiles.length <= 2 ? "49%" : tiles.length <= 4 ? "49%" : "32%" }]}>
            <VideoView stream={t.stream} mirror={t.me} muted={t.me} />
            {!t.stream || (t.me && !call.camOn) ? (
              <View style={styles.placeholder}>
                <Text style={styles.initial}>{t.name.slice(0, 1)}</Text>
              </View>
            ) : null}
            <View style={styles.label}>
              <Text style={styles.labelText}>
                {t.name}
                {t.me && !call.micOn ? " · micro coupé" : ""}
                {!t.me && t.state !== "connected" ? " · connexion…" : ""}
              </Text>
            </View>
          </View>
        ))}
      </View>
      <View style={[styles.controls, { paddingBottom: insets.bottom + 16 }]}>
        <Control icon={call.micOn ? "mic" : "mic-off"} label={call.micOn ? "Couper le micro" : "Activer le micro"} onPress={call.toggleMic} off={!call.micOn} />
        <Control icon={call.camOn ? "videocam" : "videocam-off"} label={call.camOn ? "Couper la caméra" : "Activer la caméra"} onPress={call.toggleCam} off={!call.camOn} />
        <Control icon="camera-reverse" label="Changer de caméra" onPress={call.switchCamera} />
        <Control
          icon="call"
          label="Quitter l'appel"
          danger
          onPress={async () => {
            await call.leave();
            router.back();
          }}
        />
      </View>
    </View>
  );
}

function Control({ icon, label, onPress, off, danger }: { icon: React.ComponentProps<typeof Ionicons>["name"]; label: string; onPress: () => void; off?: boolean; danger?: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => {
        tap();
        onPress();
      }}
      style={[styles.ctrl, off && { backgroundColor: colors.white }, danger && { backgroundColor: "#d92d20" }]}
    >
      <Ionicons name={icon} size={24} color={off ? colors.night950 : colors.white} style={danger ? { transform: [{ rotate: "135deg" }] } : undefined} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  lobby: { flex: 1, backgroundColor: colors.night950, padding: space.lg, justifyContent: "center" },
  error: { fontFamily: fonts.bodyMedium, fontSize: 14, color: "#fda29b", marginTop: space.md },
  grid: { flex: 1, flexDirection: "row", flexWrap: "wrap", gap: 6, padding: 6, justifyContent: "center", alignContent: "flex-start" },
  tile: { borderRadius: 16, overflow: "hidden", backgroundColor: colors.night800 },
  placeholder: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center", backgroundColor: colors.night800 },
  initial: { fontFamily: fonts.display, fontSize: 40, color: colors.gold300 },
  label: { position: "absolute", left: 8, bottom: 8, backgroundColor: "rgba(3,20,31,0.7)", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  labelText: { fontFamily: fonts.bodyMedium, fontSize: 12.5, color: colors.white },
  controls: { flexDirection: "row", justifyContent: "center", gap: 18, paddingTop: 14, backgroundColor: colors.night900 },
  ctrl: { width: 58, height: 58, borderRadius: 29, backgroundColor: "rgba(255,255,255,0.14)", alignItems: "center", justifyContent: "center" },
});
