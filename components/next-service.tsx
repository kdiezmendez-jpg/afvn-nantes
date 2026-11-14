"use client";

import { useEffect, useState } from "react";
import { formatTime, schedule } from "@/lib/site";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Heure actuelle à Nantes, quel que soit le fuseau du visiteur.
function nowInParis() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Paris",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "0";
  return { day: DAYS.indexOf(get("weekday")), minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

function computeNext() {
  const { day, minutes } = nowInParis();
  let best: { label: string; live: boolean; inDays: number; time: string; score: number } | null = null;
  for (const s of schedule) {
    const sDay = DAYS.indexOf(s.dayOfWeek);
    const start = toMinutes(s.start);
    const end = toMinutes(s.end);
    if (sDay === day && minutes >= start && minutes < end) {
      return { label: s.title, live: true, inDays: 0, time: formatTime(s.start), score: 0 };
    }
    let inDays = (sDay - day + 7) % 7;
    if (inDays === 0 && minutes >= end) inDays = 7;
    const score = inDays * 1440 + start;
    if (!best || score < best.score) {
      best = { label: s.title, live: false, inDays, time: formatTime(s.start), score };
    }
  }
  return best;
}

function dayWord(inDays: number) {
  if (inDays === 0) return "aujourd'hui";
  if (inDays === 1) return "demain";
  const d = new Date();
  d.setDate(d.getDate() + inDays);
  return new Intl.DateTimeFormat("fr-FR", { weekday: "long", timeZone: "Europe/Paris" }).format(d);
}

// Affiche « Prochain culte : dimanche à 9h30 » ou « En ce moment ».
export function NextService({ className = "" }: { className?: string }) {
  const [next, setNext] = useState<ReturnType<typeof computeNext>>(null);

  useEffect(() => {
    const update = () => setNext(computeNext());
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <p
      className={`inline-flex min-h-9 items-center gap-2.5 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur ${className}`}
      aria-live="polite"
    >
      <span className="relative flex size-2.5" aria-hidden>
        <span className={`absolute inline-flex size-full rounded-full ${next?.live ? "animate-ping bg-red-400" : "bg-gold-400"} opacity-75`} />
        <span className={`relative inline-flex size-2.5 rounded-full ${next?.live ? "bg-red-500" : "bg-gold-400"}`} />
      </span>
      {next ? (
        next.live ? (
          <span>
            <strong className="font-semibold">En ce moment :</strong> {next.label}
          </span>
        ) : (
          <span>
            <strong className="font-semibold">Prochain culte :</strong> {dayWord(next.inDays)} à {next.time}
          </span>
        )
      ) : (
        <span>Dimanche 9h30 · Vendredi 19h00</span>
      )}
    </p>
  );
}
