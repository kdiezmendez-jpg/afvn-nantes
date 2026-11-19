import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Field, FormMessage, emailOk } from "@/components/form";
import { Body, Btn, Eyebrow, Screen, Section, Title } from "@/components/ui";
import { authError, register } from "@/lib/auth";
import { sitePage, tap } from "@/lib/open";
import { colors, fonts, space } from "@/lib/theme";

type Errors = Partial<Record<"firstName" | "lastName" | "email" | "password" | "confirm" | "terms" | "form", string>>;

export default function Inscription() {
  const [f, setF] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "", confirm: "" });
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (v: string) => setF((s) => ({ ...s, [k]: v }));

  const submit = async () => {
    const e: Errors = {};
    if (!f.firstName.trim()) e.firstName = "Indiquez votre prénom.";
    if (!f.lastName.trim()) e.lastName = "Indiquez votre nom.";
    if (!emailOk(f.email)) e.email = "Saisissez une adresse e-mail valide.";
    if (f.password.length < 8 || !/[A-Za-z]/.test(f.password) || !/\d/.test(f.password)) e.password = "Au moins 8 caractères, avec des lettres et au moins un chiffre.";
    if (f.confirm !== f.password) e.confirm = "Les deux mots de passe ne correspondent pas.";
    if (!terms) e.terms = "Vous devez accepter les conditions pour créer un compte.";
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    try {
      await register(f);
      router.replace("/espace");
    } catch (err) {
      setErrors({ form: authError(err) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Screen tabBar={false}>
        <Section style={{ marginTop: space.lg }}>
          <Eyebrow>Rejoindre l&apos;espace membre</Eyebrow>
          <Title as="h1" lead="Créer mon" accent="compte." size={36} />
          <Body>Votre compte sera activé dès qu&apos;un responsable de l&apos;église l&apos;aura validé. Vous recevrez une notification.</Body>
          <Field label="Prénom" value={f.firstName} onChangeText={set("firstName")} error={errors.firstName} autoComplete="given-name" textContentType="givenName" />
          <Field label="Nom" value={f.lastName} onChangeText={set("lastName")} error={errors.lastName} autoComplete="family-name" textContentType="familyName" />
          <Field label="Adresse e-mail" value={f.email} onChangeText={set("email")} error={errors.email} keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" />
          <Field label="Téléphone (facultatif)" value={f.phone} onChangeText={set("phone")} keyboardType="phone-pad" autoComplete="tel" textContentType="telephoneNumber" hint="Utile pour que l'église puisse vous joindre." />
          <Field label="Mot de passe" value={f.password} onChangeText={set("password")} error={errors.password} secureTextEntry autoComplete="new-password" textContentType="newPassword" hint="Au moins 8 caractères, avec des lettres et au moins un chiffre." />
          <Field label="Confirmer le mot de passe" value={f.confirm} onChangeText={set("confirm")} error={errors.confirm} secureTextEntry autoComplete="new-password" textContentType="newPassword" />

          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: terms }}
            onPress={() => {
              tap();
              setTerms(!terms);
            }}
            style={styles.terms}
          >
            <View style={[styles.box, terms && styles.boxOn]}>{terms ? <Ionicons name="checkmark" size={16} color={colors.night950} /> : null}</View>
            <Text style={styles.termsText}>
              J&apos;accepte les conditions d&apos;utilisation et la politique de confidentialité, et je m&apos;engage à échanger avec respect et bienveillance.
            </Text>
          </Pressable>
          {errors.terms ? <Text style={styles.err}>{errors.terms}</Text> : null}
          <View style={styles.legal}>
            <Text accessibilityRole="link" style={styles.link} onPress={() => sitePage("/conditions")}>
              Lire les conditions
            </Text>
            <Text accessibilityRole="link" style={styles.link} onPress={() => sitePage("/confidentialite")}>
              Lire la confidentialité
            </Text>
          </View>
          <FormMessage text={errors.form} />
          <Btn label={busy ? "Création…" : "Créer mon compte"} onPress={submit} style={{ marginTop: space.lg }} />
          <Text style={styles.already}>
            Déjà un compte ?{" "}
            <Link href="/connexion" replace style={styles.link}>
              Se connecter
            </Link>
          </Text>
        </Section>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  terms: { flexDirection: "row", gap: 12, marginTop: space.lg, alignItems: "flex-start" },
  box: { width: 26, height: 26, borderRadius: 7, borderWidth: 1.5, borderColor: "rgba(17,41,59,0.35)", alignItems: "center", justifyContent: "center", backgroundColor: colors.white },
  boxOn: { backgroundColor: colors.gold400, borderColor: colors.gold400 },
  termsText: { flex: 1, fontFamily: fonts.body, fontSize: 14.5, lineHeight: 21, color: colors.ink },
  link: { fontFamily: fonts.bodyBold, color: colors.gold700, textDecorationLine: "underline" },
  legal: { flexDirection: "row", gap: 20, marginTop: 12, marginLeft: 38 },
  err: { fontFamily: fonts.bodyMedium, fontSize: 13, color: "#b42318", marginTop: 6 },
  already: { fontFamily: fonts.body, fontSize: 15, color: colors.muted, textAlign: "center", marginTop: space.lg },
});
