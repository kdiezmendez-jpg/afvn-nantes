import { Link, router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { Field, FormMessage, emailOk } from "@/components/form";
import { Body, Btn, Eyebrow, Screen, Section, Title } from "@/components/ui";
import { authError, login } from "@/lib/auth";
import { colors, fonts, space } from "@/lib/theme";

export default function Connexion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const e: typeof errors = {};
    if (!emailOk(email)) e.email = "Saisissez une adresse e-mail valide.";
    if (!password) e.password = "Saisissez votre mot de passe.";
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    try {
      await login(email, password);
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
          <Eyebrow>Espace membre</Eyebrow>
          <Title as="h1" lead="Bon retour" accent="parmi nous." size={36} />
          <Body>Connectez-vous pour retrouver votre espace personnel.</Body>
          <Field label="Adresse e-mail" value={email} onChangeText={setEmail} error={errors.email} keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" />
          <Field label="Mot de passe" value={password} onChangeText={setPassword} error={errors.password} secureTextEntry autoComplete="current-password" textContentType="password" onSubmitEditing={submit} />
          <FormMessage text={errors.form} />
          <Btn label={busy ? "Connexion…" : "Se connecter"} onPress={submit} style={{ marginTop: space.lg }} />
          <View style={{ marginTop: space.lg, gap: 14, alignItems: "center" }}>
            <Link href="/mot-de-passe" style={{ fontFamily: fonts.bodyBold, color: colors.gold700, fontSize: 15 }}>
              Mot de passe oublié ?
            </Link>
            <Text style={{ fontFamily: fonts.body, color: colors.muted, fontSize: 15 }}>
              Pas encore de compte ?{" "}
              <Link href="/inscription" replace style={{ fontFamily: fonts.bodyBold, color: colors.gold700 }}>
                Créer mon compte
              </Link>
            </Text>
          </View>
        </Section>
      </Screen>
    </KeyboardAvoidingView>
  );
}
