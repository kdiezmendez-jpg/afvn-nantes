import { FieldGroup, Host, Switch } from "@expo/ui";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Field, FormMessage } from "@/components/form";
import { Body, Btn, Card, Eyebrow, Screen, Section, Title } from "@/components/ui";
import { authError, deleteAccount, logout, useAuth } from "@/lib/auth";
import { roleLabels, updateOwnProfile } from "@/lib/members";
import { colors, fonts, space } from "@/lib/theme";

export default function Compte() {
  const { user, member } = useAuth();
  const [firstName, setFirstName] = useState(member?.firstName ?? "");
  const [lastName, setLastName] = useState(member?.lastName ?? "");
  const [phone, setPhone] = useState(member?.phone ?? "");
  const [msg, setMsg] = useState<{ text: string; tone: "error" | "success" }>();
  const [deleting, setDeleting] = useState(false);
  const [password, setPassword] = useState("");

  if (!user) {
    return (
      <Screen tabBar={false}>
        <Section style={{ marginTop: space.lg }}>
          <Body>Vous n&apos;êtes pas connecté.</Body>
          <Btn label="Se connecter" onPress={() => router.replace("/connexion")} style={{ marginTop: space.lg }} />
        </Section>
      </Screen>
    );
  }

  const save = async () => {
    if (!firstName.trim() || !lastName.trim()) return setMsg({ text: "Le prénom et le nom sont obligatoires.", tone: "error" });
    try {
      await updateOwnProfile(user.uid, { firstName: firstName.trim(), lastName: lastName.trim(), phone: phone.trim() });
      setMsg({ text: "Vos informations sont enregistrées.", tone: "success" });
    } catch {
      setMsg({ text: "Enregistrement impossible. Réessayez.", tone: "error" });
    }
  };

  const confirmDelete = () =>
    Alert.alert("Supprimer mon compte ?", "Votre profil et vos données seront définitivement effacés. Cette action est irréversible.", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteAccount(password);
            router.replace("/espace");
          } catch (e) {
            setMsg({ text: authError(e), tone: "error" });
          }
        },
      },
    ]);

  return (
    <Screen tabBar={false}>
      <Section style={{ marginTop: space.lg }}>
        <Eyebrow>Mon compte</Eyebrow>
        <Title as="h1" lead={`${member?.firstName ?? ""} ${member?.lastName ?? ""}`.trim() || "Mon compte"} size={32} />
        <Text style={styles.meta}>
          {user.email} · {member ? member.roles.map((r) => roleLabels[r]).join(", ") : ""}
        </Text>
        <Field label="Prénom" value={firstName} onChangeText={setFirstName} autoComplete="given-name" />
        <Field label="Nom" value={lastName} onChangeText={setLastName} autoComplete="family-name" />
        <Field label="Téléphone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" autoComplete="tel" />
        <FormMessage text={msg?.text} tone={msg?.tone} />
        <Btn label="Enregistrer" onPress={save} style={{ marginTop: space.lg }} />
      </Section>

      {member?.status === "active" ? (
        <View style={{ marginTop: space.xl }}>
          <Host matchContents={{ vertical: true }}>
            <FieldGroup>
              <FieldGroup.Section title="Annuaire des membres">
                <Switch label="Apparaître dans l'annuaire" value={member.directoryVisible} onValueChange={(v) => updateOwnProfile(user.uid, { directoryVisible: v }).catch(() => {})} />
              </FieldGroup.Section>
            </FieldGroup>
          </Host>
          <Body style={{ paddingHorizontal: space.lg, fontSize: 13.5 }}>Seuls les membres validés voient l&apos;annuaire. Désactivé par défaut.</Body>
        </View>
      ) : null}

      <Section>
        <Btn label="Se déconnecter" variant="secondary" icon="log-out-outline" onPress={() => logout().then(() => router.replace("/espace"))} />
      </Section>

      <Section>
        <Card style={{ borderColor: "#fecdca" }}>
          <Text style={styles.danger}>Supprimer mon compte</Text>
          <Text style={styles.dangerText}>Efface définitivement votre profil et vos données de l&apos;application.</Text>
          {deleting ? (
            <>
              <Field label="Mot de passe (pour confirmer)" value={password} onChangeText={setPassword} secureTextEntry autoComplete="current-password" />
              <Btn label="Supprimer définitivement" onPress={confirmDelete} style={{ marginTop: space.md, backgroundColor: "#b42318", borderColor: "#b42318" }} />
            </>
          ) : (
            <Btn label="Supprimer mon compte" variant="secondary" onPress={() => setDeleting(true)} style={{ marginTop: space.md }} />
          )}
        </Card>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  meta: { fontFamily: fonts.body, fontSize: 14, color: colors.muted, marginTop: 6 },
  danger: { fontFamily: fonts.bodyBold, fontSize: 16, color: "#b42318" },
  dangerText: { fontFamily: fonts.body, fontSize: 14, color: colors.muted, marginTop: 4 },
});
