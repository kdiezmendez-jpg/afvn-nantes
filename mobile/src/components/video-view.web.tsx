import { useEffect, useRef } from "react";

// Affiche un flux vidéo (navigateur).
export function VideoView({ stream, mirror, muted }: { stream: MediaStream | null; mirror?: boolean; muted?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (ref.current && ref.current.srcObject !== stream) ref.current.srcObject = stream;
  }, [stream]);
  if (!stream) return null;
  return (
    <video
      ref={ref}
      autoPlay
      playsInline
      muted={muted}
      data-testid={muted ? "local-video" : "remote-video"}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: mirror ? "scaleX(-1)" : undefined }}
    />
  );
}
