import { StyleSheet } from "react-native";
import { RTCView } from "react-native-webrtc";

// Affiche un flux vidéo (natif).
export function VideoView({ stream, mirror }: { stream: { toURL: () => string } | null; mirror?: boolean; muted?: boolean }) {
  if (!stream) return null;
  return <RTCView streamURL={stream.toURL()} objectFit="cover" mirror={mirror} style={StyleSheet.absoluteFill} />;
}
