import { useState } from "react";
import { Field, FormMessage, emailOk } from "@/components/form";
import { Body, Btn, Eyebrow, Screen, Section, Title } from "@/components/ui";
import { authError, resetPassword } from "@/lib/auth";
import { space } from "@/lib/theme";

export default function MotDePasse() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [done, setDone] = useState(false);

  const submit = async () => {
    if (!emailOk(email)) return setError("Saisissez une adresse e-mail valide.");
    setError(undefined);
    try {
      await resetPassword(email);
    } catch (e) {
      const msg = authError(e);
      if ((e as { code?: string })?.code !== "auth/user-not-found") return setError(msg);
    }
    setDone(true); // même message que le compte existe ou non (ne révèle pas les adresses inscrites)
  };

  return (
    <Screen tabBar={false}>
      <Section style={{ marginTop: space.lg }}>
        <Eyebrow>Mot de passe oublié</Eyebrow>
        <Title as="h1" lead="Pas de" accent="panique." size={36} />
        <Body>Indiquez votre adresse e-mail : vous recevrez un lien pour choisir un nouveau mot de passe.</Body>
        <Field label="Adresse e-mail" value={email} onChangeText={setEmail} error={error} keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" />
        <FormMessage tone="success" text={done ? "Si un compte existe avec cette adresse, un e-mail vient de vous être envoyé. Pensez à vérifier vos indésirables." : undefined} />
        <Btn label="Recevoir le lien" onPress={submit} style={{ marginTop: space.lg }} />
      </Section>
    </Screen>
  );
}
