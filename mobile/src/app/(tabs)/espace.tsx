import Ionicons from "@expo/vector-icons/Ionicons";
import { router, type Href } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { Body, Btn, Card, Eyebrow, Hero, RowLink, Screen, Section, Title, type IconName } from "@/components/ui";
import { resendVerification, useAuth } from "@/lib/auth";
import { firebaseConfigured } from "@/lib/firebase";
import { isAdmin, isLeader, isPrayerTeam, isServant, roleLabels } from "@/lib/members";
import { enablePush, pushStatus } from "@/lib/push";
import { call, tap } from "@/lib/open";
import { colors, fonts, space } from "@/lib/theme";

// Modules de l'espace membre, ouverts au fil des étapes du projet.
const modules: { icon: IconName; title: string; text: string; soon?: boolean; href?: Href; servantsOnly?: boolean }[] = [
  { icon: "sparkles", title: "Mes demandes de prière", text: "Confiez un sujet à l'équipe pastorale et suivez-le.", href: "/prieres" },
  { icon: "newspaper-outline", title: "Actualités", text: "Les annonces de l'église, avec notifications.", href: "/actualites" },
  { icon: "calendar-outline", title: "Événements & inscriptions", text: "S'inscrire à ESCHATOS, aux séminaires…", href: "/evenements" },
  { icon: "water-outline", title: "Mon baptême", text: "Demander le baptême et suivre la préparation.", href: "/bapteme" },
  { icon: "school-outline", title: "Formation des serviteurs", text: "Transformation Centrée sur la Vérité : modules, manuels, directs.", href: "/formation", servantsOnly: true },
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
      <PushCard uid={member.uid} />
      {isAdmin(member) || isPrayerTeam(member) || isLeader(member) ? (
        <Section style={{ marginTop: space.xl }}>
          <Eyebrow>Mes services</Eyebrow>
          <View style={{ marginTop: space.md, gap: 10 }}>
            {isPrayerTeam(member) ? <RowLink icon="sparkles" title="Équipe de prière" subtitle="Porter les demandes confiées" onPress={() => router.push("/prieres/equipe")} /> : null}
            {isLeader(member) ? <RowLink icon="megaphone-outline" title="Publier une actualité" subtitle="Avec notification aux membres" onPress={() => router.push("/actualites/nouvelle")} /> : null}
            {isLeader(member) ? <RowLink icon="calendar-outline" title="Créer un événement" subtitle="Avec inscriptions et rappel la veille" onPress={() => router.push("/evenements/nouveau")} /> : null}
            {isLeader(member) ? <RowLink icon="water-outline" title="Demandes de baptême" subtitle="Accompagner les candidats" onPress={() => router.push("/admin/baptemes")} /> : null}
            {isAdmin(member) ? <RowLink icon="shield-checkmark-outline" title="Gérer les membres" subtitle="Valider les inscriptions, attribuer les rôles" onPress={() => router.push("/admin/membres")} /> : null}
          </View>
        </Section>
      ) : null}
      <Section style={{ marginTop: space.xxl }}>
        <Title lead="Vivre l'église" accent="au quotidien." size={28} />
        <View style={{ gap: 10, marginTop: space.lg }}>
          {modules
            .filter((m) => !m.servantsOnly || isServant(member))
            .map((m) => (
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

// Proposition d'activer les notifications, au moment où elles ont du sens (compte validé).
function PushCard({ uid }: { uid: string }) {
  const [status, setStatus] = useState<string>("unknown");
  useEffect(() => {
    let alive = true;
    pushStatus().then((s) => {
      if (!alive) return;
      setStatus(s);
      if (s === "granted") enablePush(uid, false).catch(() => {});
    });
    return () => {
      alive = false;
    };
  }, [uid]);
  if (status !== "ask") return null;
  return (
    <Section style={{ marginTop: space.xl }}>
      <Card style={{ backgroundColor: colors.gold200, borderColor: colors.gold200 }}>
        <Ionicons name="notifications-outline" size={24} color={colors.gold700} />
        <Text style={styles.cardTitle}>Restez informé</Text>
        <Text style={styles.cardText}>Recevez les annonces de l&apos;église et sachez quand l&apos;équipe prie pour vous.</Text>
        <Btn label="Activer les notifications" onPress={() => enablePush(uid).then((ok) => setStatus(ok ? "granted" : "denied"))} style={{ marginTop: 12 }} />
      </Card>
    </Section>
  );
}

function ModuleRow({ icon, title, text, soon, href }: { icon: IconName; title: string; text: string; soon?: boolean; href?: Href }) {
  if (href && !soon) {
    return (
      <Pressable accessibilityRole="button" onPress={() => { tap(); router.push(href); }} style={({ pressed }) => [styles.module, pressed && { backgroundColor: "#efe8da" }]}>
        <View style={styles.moduleIcon}>
          <Ionicons name={icon} size={20} color={colors.gold700} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.moduleTitle}>{title}</Text>
          <Text style={styles.moduleText}>{text}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.muted} />
      </Pressable>
    );
  }
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
