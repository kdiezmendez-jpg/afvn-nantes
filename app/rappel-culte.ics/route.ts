import { schedule, site } from "@/lib/site";

// Fichier calendrier (.ics) : ajoute les cultes hebdomadaires dans l'agenda du téléphone,
// avec un rappel 30 minutes avant. Aucun compte ni donnée personnelle.
export const dynamic = "force-static";

const BYDAY: Record<string, string> = { Sunday: "SU", Friday: "FR", Monday: "MO", Tuesday: "TU", Wednesday: "WE", Thursday: "TH", Saturday: "SA" };
const DAY_INDEX: Record<string, number> = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };

// Première occurrence à partir d'une date de référence fixe (le calendrier répète ensuite chaque semaine).
function firstDate(dayOfWeek: string) {
  const ref = new Date(Date.UTC(2026, 0, 4)); // dimanche 4 janvier 2026
  ref.setUTCDate(ref.getUTCDate() + DAY_INDEX[dayOfWeek]);
  return ref.toISOString().slice(0, 10).replace(/-/g, "");
}

const fold = (line: string) => line.match(/.{1,74}/g)!.join("\r\n ");

export function GET() {
  const address = `${site.address.street}\\, ${site.address.postalCode} ${site.address.city}`;
  const events = schedule.map((s) => {
    const date = firstDate(s.dayOfWeek);
    return [
      "BEGIN:VEVENT",
      `UID:afvn-nantes-${s.dayOfWeek.toLowerCase()}@afvn-nantes`,
      "DTSTAMP:20260101T000000Z",
      `DTSTART;TZID=Europe/Paris:${date}T${s.start.replace(":", "")}00`,
      `DTEND;TZID=Europe/Paris:${date}T${s.end.replace(":", "")}00`,
      `RRULE:FREQ=WEEKLY;BYDAY=${BYDAY[s.dayOfWeek]}`,
      `SUMMARY:${s.title} · AFVN Nantes`,
      `DESCRIPTION:${s.detail}. En direct : ${site.liveUrl}`,
      `LOCATION:${address}`,
      `URL:${site.url}`,
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      `DESCRIPTION:${s.title} dans 30 minutes`,
      "TRIGGER:-PT30M",
      "END:VALARM",
      "END:VEVENT",
    ]
      .map(fold)
      .join("\r\n");
  });

  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//AFVN Nantes//Cultes//FR",
    "CALSCALE:GREGORIAN",
    "X-WR-CALNAME:Cultes AFVN Nantes",
    "X-WR-TIMEZONE:Europe/Paris",
    ...events,
    "END:VCALENDAR",
    "",
  ].join("\r\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="cultes-afvn-nantes.ics"',
    },
  });
}
