import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Body, Btn, Card, Eyebrow, Hero, RowLink, Screen, Section, Title, type IconName } from "@/components/ui";
import { resendVerification, useAuth } from "@/lib/auth";
import { firebaseConfigured } from "@/lib/firebase";
import { isAdmin, roleLabels } from "@/lib/members";
import { call } from "@/lib/open";
import { colors, fonts, space } from "@/lib/theme";

// Modules de l'espace membre, ouverts au fil des étapes du projet.
const modules: { icon: IconName; title: string; text: string; soon?: boolean }[] = [
  { icon: "sparkles", title: "Mes demandes de prière", text: "Confiez un sujet à l'équipe pastorale et suivez-le.", soon: true },
  { icon: "newspaper-outline", title: "Actualités", text: "Les annonces de l'église, avec notifications.", soon: true },
  { icon: "calendar-outline", title: "Événements & inscriptions", text: "S'inscrire à ESCHATOS, aux séminaires…", soon: true },
  { icon: "water-outline", title: "Mon baptême", text: "Demander le baptême et suivre la préparation.", soon: true },
  { icon: "school-outline", title: "Formation des serviteurs", text: "Transformation holistique centrée sur la Vérité.", soon: true },
  { icon: "people-outline", title: "Ministères & groupes", text: "Rejoindre un ministère, échanger avec son groupe.", soon: true },
  { icon: "chatbubbles-outline", title: "Annuaire & messagerie", text: "Retrouver les frères et sœurs, s'écrire.", soon: true },
];

export default function Espace() {
  const { ready, user, member } = useAuth();

  if (!ready) {
    return (
      <Screen hero={<Hero eyebrow="Mon espace" lead="Un instant…" />}>
        <ActivityIndicator color={colors.gold700} style={{ marginTop: space.xxl }} />
      </Screen>
    );
  }

  // Visiteur
  if (!user) {
    return (
      <Screen hero={<Hero eyebrow="Espace membre" lead="Votre église," accent="dans votre poche." intro="Prière, formation, événements, baptême, ministères : créez votre compte pour vivre l'église au quotidien." />}>
        <Section style={{ marginTop: space.xl }}>
          <Btn label="Créer mon compte" onPress={() => router.push("/inscription")} />
          <Btn label="J'ai déjà un compte" variant="secondary" onPress={() => router.push("/connexion")} style={{ marginTop: 10 }} />
          {!firebaseConfigured ? <Body style={{ fontSize: 13, textAlign: "center" }}>Espace membre en cours d&apos;ouverture.</Body> : null}
        </Section>
        <Section>
          <Eyebrow>Dans votre espace</Eyebrow>
          <View style={{ gap: 10, marginTop: space.md }}>
            {modules.map((m) => (
              <ModuleRow key={m.title} {...m} soon={false} />
            ))}
          </View>
        </Section>
      </Screen>
    );
  }

  const name = member?.firstName ?? "";

  // Compte créé, en attente de validation par un responsable
  if (!member || member.status === "pending") {
    return (
      <Screen hero={<Hero eyebrow="Mon espace" lead={`Bienvenue${name ? ` ${name}` : ""},`} accent="votre compte est créé." />}>
        <Section style={{ marginTop: space.xl }}>
          <Card>
            <Ionicons name="hourglass-outline" size={26} color={colors.gold700} />
            <Text style={styles.cardTitle}>En attente de validation</Text>
            <Text style={styles.cardText}>Un responsable de l&apos;église va valider votre compte. Cela prend en général moins de 48 heures. Vous aurez ensuite accès à tout votre espace.</Text>
          </Card>
          {!user.emailVerified ? <VerifyEmail /> : null}
          <View style={{ gap: 10, marginTop: space.lg }}>
            <RowLink icon="person-circle-outline" title="Mon compte" subtitle={user.email ?? ""} onPress={() => router.push("/compte")} />
            <RowLink icon="call-outline" title="Contacter l'église" onPress={call} external />
          </View>
        </Section>
      </Screen>
    );
  }

  if (member.status !== "active") {
    return (
      <Screen hero={<Hero eyebrow="Mon espace" lead="Accès" accent="non disponible." />}>
        <Section style={{ marginTop: space.xl }}>
          <Body>Votre compte n&apos;a pas été activé. Si vous pensez qu&apos;il s&apos;agit d&apos;une erreur, contactez l&apos;église.</Body>
          <Btn label="Appeler l'église" icon="call-outline" onPress={call} style={{ marginTop: space.lg }} />
          <Btn label="Mon compte" variant="secondary" onPress={() => router.push("/compte")} style={{ marginTop: 10 }} />
        </Section>
      </Screen>
    );
  }

  // Membre validé
  return (
    <Screen
      hero={
        <Hero eyebrow="Mon espace" lead={`Bonjour ${name},`} accent="heureux de vous voir.">
          <View style={styles.roles}>
            {member.roles.map((r) => (
              <View key={r} style={styles.role}>
                <Text style={styles.roleText}>{roleLabels[r]}</Text>
              </View>
            ))}
          </View>
        </Hero>
      }
    >
      {isAdmin(member) ? (
        <Section style={{ marginTop: space.xl }}>
          <Eyebrow>Administration</Eyebrow>
          <View style={{ marginTop: space.md }}>
            <RowLink icon="shield-checkmark-outline" title="Gérer les membres" subtitle="Valider les inscriptions, attribuer les rôles" onPress={() => router.push("/admin/membres")} />
          </View>
        </Section>
      ) : null}
      <Section style={{ marginTop: isAdmin(member) ? space.xxl : space.xl }}>
        <Title lead="Vivre l'église" accent="au quotidien." size={28} />
        <View style={{ gap: 10, marginTop: space.lg }}>
          {modules.map((m) => (
            <ModuleRow key={m.title} {...m} />
          ))}
        </View>
      </Section>
      <Section>
        <RowLink icon="person-circle-outline" title="Mon compte" subtitle="Profil, annuaire, déconnexion" onPress={() => router.push("/compte")} />
      </Section>
    </Screen>
  );
}

function ModuleRow({ icon, title, text, soon }: { icon: IconName; title: string; text: string; soon?: boolean }) {
  return (
    <View style={styles.module} accessible accessibilityLabel={`${title}. ${text}${soon ? ". Bientôt disponible" : ""}`}>
      <View style={styles.moduleIcon}>
        <Ionicons name={icon} size={20} color={colors.gold700} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.moduleTitle}>{title}</Text>
        <Text style={styles.moduleText}>{text}</Text>
      </View>
      {soon ? <Text style={styles.soon}>Bientôt</Text> : null}
    </View>
  );
}

function VerifyEmail() {
  const [sent, setSent] = useState(false);
  return (
    <Card style={{ marginTop: 12, backgroundColor: colors.gold200, borderColor: colors.gold200 }}>
      <Text style={styles.cardTitle}>Confirmez votre adresse e-mail</Text>
      <Text style={styles.cardText}>Cliquez sur le lien reçu par e-mail. Pensez à vérifier vos courriers indésirables.</Text>
      <Btn
        label={sent ? "E-mail renvoyé ✓" : "Renvoyer l'e-mail"}
        variant="secondary"
        onPress={() => resendVerification().then(() => setSent(true)).catch(() => {})}
        style={{ marginTop: 12 }}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  cardTitle: { fontFamily: fonts.display, fontSize: 21, color: colors.ink, marginTop: 10 },
  cardText: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22, color: colors.muted, marginTop: 6 },
  roles: { flexDirection: "row", gap: 8, marginTop: space.md, flexWrap: "wrap" },
  role: { borderWidth: 1, borderColor: "rgba(239,181,74,0.5)", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5 },
  roleText: { fontFamily: fonts.bodyBold, fontSize: 12.5, color: colors.gold300 },
  module: { flexDirection: "row", alignItems: "center", gap: 14, padding: 14, borderRadius: 16, backgroundColor: colors.white, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  moduleIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(248,226,176,0.7)", alignItems: "center", justifyContent: "center" },
  moduleTitle: { fontFamily: fonts.bodyBold, fontSize: 15.5, color: colors.ink },
  moduleText: { fontFamily: fonts.body, fontSize: 13.5, lineHeight: 19, color: colors.muted, marginTop: 2 },
  soon: { fontFamily: fonts.bodyBold, fontSize: 11.5, color: colors.gold700, backgroundColor: "rgba(248,226,176,0.7)", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, overflow: "hidden" },
});
