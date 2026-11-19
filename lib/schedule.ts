import { schedule } from "./site";

// Calculs d'horaires à l'heure de Nantes (Europe/Paris), quel que soit le fuseau du visiteur.

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const TZ = "Europe/Paris";

type Slot = (typeof schedule)[number];

export type Occurrence = { slot: Slot; start: Date; end: Date; live: boolean };

// Formateurs créés une seule fois (leur création coûte cher).
const partsFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

function parisParts(d: Date) {
  const parts = partsFormatter.formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "0";
  return {
    y: Number(get("year")),
    m: Number(get("month")),
    d: Number(get("day")),
    dow: DAYS.indexOf(get("weekday")),
    h: Number(get("hour")),
    min: Number(get("minute")),
    s: Number(get("second")),
  };
}

// Convertit une date/heure « murale » de Paris en instant réel.
function parisWallToDate(y: number, m: number, d: number, hh: number, mm: number) {
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  const p = parisParts(new Date(guess));
  const asUtc = Date.UTC(p.y, p.m - 1, p.d, p.h, p.min, p.s);
  return new Date(guess - (asUtc - guess));
}

export function upcoming(count: number, from = new Date()): Occurrence[] {
  const now = parisParts(from);
  const out: Occurrence[] = [];
  for (let offset = 0; offset < 21 && out.length < count * 2; offset++) {
    const dow = (now.dow + offset) % 7;
    const base = new Date(Date.UTC(now.y, now.m - 1, now.d + offset));
    for (const slot of schedule) {
      if (DAYS.indexOf(slot.dayOfWeek) !== dow) continue;
      const [sh, sm] = slot.start.split(":").map(Number);
      const [eh, em] = slot.end.split(":").map(Number);
      const y = base.getUTCFullYear();
      const mo = base.getUTCMonth() + 1;
      const da = base.getUTCDate();
      const start = parisWallToDate(y, mo, da, sh, sm);
      const end = parisWallToDate(y, mo, da, eh, em);
      if (end <= from) continue;
      out.push({ slot, start, end, live: start <= from });
    }
  }
  return out.sort((a, b) => a.start.getTime() - b.start.getTime()).slice(0, count);
}

const fDay = new Intl.DateTimeFormat("fr-FR", { weekday: "long", timeZone: TZ });
const fNum = new Intl.DateTimeFormat("fr-FR", { day: "numeric", timeZone: TZ });
const fMonth = new Intl.DateTimeFormat("fr-FR", { month: "short", timeZone: TZ });
export const frDay = (d: Date) => fDay.format(d);
export const frDayNum = (d: Date) => fNum.format(d);
export const frMonth = (d: Date) => fMonth.format(d).replace(".", "");

export function relativeDay(d: Date, from = new Date()) {
  const a = parisParts(d);
  const b = parisParts(from);
  const diff = Math.round((Date.UTC(a.y, a.m - 1, a.d) - Date.UTC(b.y, b.m - 1, b.d)) / 86400000);
  if (diff === 0) return "aujourd'hui";
  if (diff === 1) return "demain";
  return frDay(d);
}
