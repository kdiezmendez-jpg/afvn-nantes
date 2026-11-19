import { useState, type ComponentProps } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { colors, fonts } from "@/lib/theme";

type FieldProps = ComponentProps<typeof TextInput> & { label: string; error?: string; hint?: string };

// Champ de formulaire avec libellé, aide et message d'erreur sous le champ.
export function Field({ label, error, hint, style, ...props }: FieldProps) {
  const [focus, setFocus] = useState(false);
  return (
    <View style={{ marginTop: 16 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor="#8a96a0"
        onFocus={(e) => {
          setFocus(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocus(false);
          props.onBlur?.(e);
        }}
        style={[styles.input, { borderColor: error ? "#b42318" : focus ? colors.gold700 : "rgba(17,41,59,0.2)" }, style]}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

export function FormMessage({ text, tone = "error" }: { text?: string; tone?: "error" | "success" }) {
  if (!text) return null;
  return (
    <View style={[styles.msg, tone === "success" ? styles.msgOk : styles.msgErr]} accessibilityLiveRegion="polite">
      <Text style={[styles.msgText, { color: tone === "success" ? "#05603a" : "#b42318" }]}>{text}</Text>
    </View>
  );
}

export const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

const styles = StyleSheet.create({
  label: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.ink, marginBottom: 6 },
  input: { minHeight: 52, borderWidth: 1.5, borderRadius: 14, paddingHorizontal: 14, fontFamily: fonts.body, fontSize: 16, color: colors.ink, backgroundColor: colors.white },
  error: { fontFamily: fonts.bodyMedium, fontSize: 13, color: "#b42318", marginTop: 6 },
  hint: { fontFamily: fonts.body, fontSize: 13, color: colors.muted, marginTop: 6 },
  msg: { borderRadius: 12, padding: 12, marginTop: 16 },
  msgErr: { backgroundColor: "#fef3f2" },
  msgOk: { backgroundColor: "#ecfdf3" },
  msgText: { fontFamily: fonts.bodyMedium, fontSize: 14, lineHeight: 20 },
});
