import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { FormMessage } from "@/components/form";
import { MemberGate } from "@/components/member-gate";
import { Body, Btn, Card, Eyebrow, Screen, Section, Title } from "@/components/ui";
import { deleteEvent, formatEventDate, listRegistrations, myRegistration, placesLeft, register, setRegistrationOpen, unregister, watchEvent, type ChurchEvent, type Registration } from "@/lib/events";
import { isLeader, type Member } from "@/lib/members";
import { tap } from "@/lib/open";
import { colors, fonts, space } from "@/lib/theme";

export default function Evenement() {
  return <MemberGate>{(m) => <Content member={m} />}</MemberGate>;
}

function Content({ member }: { member: Member }) {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [event, setEvent] = useState<ChurchEvent | null | undefined>(undefined);
  const [mine, setMine] = useState<Registration | null | undefined>(undefined);
  const [guests, setGuests] = useState(0);
  const [msg, setMsg] = useState<string>();
  const [people, setPeople] = useState<Registration[] | null>(null);
  const leader = isLeader(member);

  useEffect(() => watchEvent(id, setEvent), [id]);
  const refreshMine = useCallback(() => myRegistration(id, member.uid).then(setMine), [id, member.uid]);
  useEffect(() => {
    refreshMine();
  }, [refreshMine]);

  if (event === undefined) return null;
  if (event === null) return <Body style={{ padding: space.lg }}>Cet événement n&apos;existe plus.</Body>;
  const left = placesLeft(event);
  const canRegister = event.registrationOpen && (left == null || left >= 1 + guests);

  const join = async () => {
    try {
      await register(event.id, member.uid, `${member.firstName} ${member.lastName}`, guests);
      setMsg(undefined);
      refreshMine();
    } catch {
      setMsg("Inscription impossible : l'événement est peut-être complet ou fermé.");
    }
  };
  const leave = () =>
    Alert.alert("Annuler votre inscription ?", undefined, [
      { text: "Non", style: "cancel" },
      { text: "Oui, annuler", style: "destructive", onPress: () => unregister(event.id, member.uid).then(refreshMine) },
    ]);

  return (
    <Screen tabBar={false}>
      <Stack.Screen options={{ title: event.title }} />
      <Section style={{ marginTop: space.lg }}>
        <Eyebrow>{formatEventDate(event.startsAt)}</Eyebrow>
        <Title as="h1" lead={event.title} size={32} />
        <View style={styles.meta}>
          <Ionicons name="location-outline" size={16} color={colors.muted} />
          <Text style={styles.metaText}>{event.location}</Text>
        </View>
        {event.description ? <Body>{event.description}</Body> : null}
      </Section>

      <Section style={{ marginTop: space.xl }}>
        {mine ? (
          <Card style={{ backgroundColor: "#ecfdf3", borderColor: "#abefc6" }}>
            <Text style={styles.ok}>✓ Vous êtes inscrit(e){mine.guests ? ` avec ${mine.guests} accompagnant${mine.guests > 1 ? "s" : ""}` : ""}</Text>
            <Text style={styles.okText}>Vous recevrez un rappel la veille.</Text>
            <Btn label="Annuler mon inscription" variant="secondary" onPress={leave} style={{ marginTop: 12 }} />
          </Card>
        ) : mine === null ? (
          <Card>
            <Text style={styles.cardTitle}>{left == null ? "Inscription" : `${left} place${left > 1 ? "s" : ""} restante${left > 1 ? "s" : ""}`}</Text>
            <View style={styles.guests}>
              <Text style={styles.guestsLabel}>Accompagnants</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Retirer un accompagnant" onPress={() => { tap(); setGuests(Math.max(0, guests - 1)); }} style={styles.step}>
                <Ionicons name="remove" size={20} color={colors.ink} />
              </Pressable>
              <Text style={styles.guestsNum} accessibilityLabel={`${guests} accompagnants`}>{guests}</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Ajouter un accompagnant" onPress={() => { tap(); setGuests(Math.min(5, guests + 1)); }} style={styles.step}>
                <Ionicons name="add" size={20} color={colors.ink} />
              </Pressable>
            </View>
            <FormMessage text={msg} />
            <Btn label={!event.registrationOpen ? "Inscriptions fermées" : canRegister ? "Je m'inscris" : "Complet"} onPress={canRegister ? join : () => {}} style={{ marginTop: 12, opacity: canRegister ? 1 : 0.5 }} />
          </Card>
        ) : null}
      </Section>

      {leader ? (
        <Section>
          <Eyebrow>Gestion</Eyebrow>
          <Text style={styles.count}>
            {event.registeredCount} inscrit{event.registeredCount > 1 ? "s" : ""}
            {event.capacity ? ` sur ${event.capacity}` : ""}
          </Text>
          <View style={{ gap: 10, marginTop: space.md }}>
            <Btn label={people ? "Actualiser la liste" : "Voir les inscrits"} variant="secondary" icon="people-outline" onPress={() => listRegistrations(event.id).then(setPeople)} />
            {people?.map((p) => (
              <Text key={p.uid} style={styles.person}>
                {p.name}
                {p.guests ? ` + ${p.guests}` : ""}
              </Text>
            ))}
            <Btn label={event.registrationOpen ? "Fermer les inscriptions" : "Rouvrir les inscriptions"} variant="secondary" onPress={() => setRegistrationOpen(event, !event.registrationOpen)} />
            <Btn label="Supprimer l'événement" variant="secondary" onPress={() => Alert.alert("Supprimer cet événement ?", undefined, [{ text: "Annuler", style: "cancel" }, { text: "Supprimer", style: "destructive", onPress: () => deleteEvent(event.id).then(() => router.back()) }])} />
          </View>
        </Section>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  meta: { flexDirection: "row", gap: 6, alignItems: "center", marginTop: 8 },
  metaText: { fontFamily: fonts.body, fontSize: 15, color: colors.muted },
  ok: { fontFamily: fonts.bodyBold, fontSize: 16, color: "#05603a" },
  okText: { fontFamily: fonts.body, fontSize: 14, color: "#05603a", marginTop: 4 },
  cardTitle: { fontFamily: fonts.display, fontSize: 20, color: colors.ink },
  guests: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 14 },
  guestsLabel: { flex: 1, fontFamily: fonts.bodyMedium, fontSize: 15, color: colors.ink },
  step: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center" },
  guestsNum: { fontFamily: fonts.display, fontSize: 22, color: colors.ink, minWidth: 24, textAlign: "center" },
  count: { fontFamily: fonts.display, fontSize: 22, color: colors.ink, marginTop: 6 },
  person: { fontFamily: fonts.body, fontSize: 15, color: colors.ink, paddingVertical: 4, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
});
