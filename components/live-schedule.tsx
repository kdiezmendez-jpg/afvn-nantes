"use client";

import { useMemo, useSyncExternalStore } from "react";
import { formatTime, schedule } from "@/lib/site";
import { frDayNum, frMonth, relativeDay, upcoming, type Occurrence } from "@/lib/schedule";

// Horloge partagée : un seul minuteur par fréquence, lu via useSyncExternalStore
// (le site est statique, les dates sont donc calculées au moment de la visite).
type Clock = { now: number; subs: Set<() => void>; id?: ReturnType<typeof setInterval> };
const clocks = new Map<number, Clock>();

function getClock(ms: number) {
  let c = clocks.get(ms);
  if (!c) {
    c = { now: Date.now(), subs: new Set() };
    clocks.set(ms, c);
  }
  return c;
}

function useNow(ms: number): number | null {
  return useSyncExternalStore(
    (cb) => {
      const c = getClock(ms);
      c.subs.add(cb);
      if (!c.id) {
        c.id = setInterval(() => {
          c.now = Date.now();
          c.subs.forEach((f) => f());
        }, ms);
      }
      return () => {
        c.subs.delete(cb);
        if (!c.subs.size && c.id) {
          clearInterval(c.id);
          c.id = undefined;
        }
      };
    },
    () => getClock(ms).now,
    () => null,
  );
}

function useUpcoming(count: number, tick = 60_000): Occurrence[] | null {
  const now = useNow(tick);
  return useMemo(() => (now === null ? null : upcoming(count, new Date(now))), [now, count]);
}

const fallback = schedule.map((s) => `${s.day} ${formatTime(s.start)}`).join(" · ");

export function NextServicePill({ className = "" }: { className?: string }) {
  const list = useUpcoming(1);
  const next = list?.[0];
  return (
    <p
      aria-live="polite"
      className={`inline-flex min-h-10 items-center gap-3 rounded-full border border-white/15 bg-night-900/70 px-4 py-2 text-white backdrop-blur ${className}`}
    >
      <span className="relative flex size-2.5" aria-hidden>
        {next?.live ? <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75" /> : null}
        <span className={`relative inline-flex size-2.5 rounded-full ${next?.live ? "bg-red-500" : "bg-gold-400"}`} />
      </span>
      <span className="leading-tight">
        <span className="eyebrow block !text-[0.6rem] text-white/60">{next?.live ? "En ce moment" : "Prochain culte"}</span>
        <span className="text-sm font-semibold">
          {next
            ? next.live
              ? next.slot.title
              : `${relativeDay(next.start)} · ${formatTime(next.slot.start)} — ${formatTime(next.slot.end)}`
            : fallback}
        </span>
      </span>
    </p>
  );
}

function splitDuration(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { j: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

export function Countdown() {
  const list = useUpcoming(1, 1000);
  const now = useNow(1000);

  const next = list?.[0];
  const parts = next && now ? splitDuration(next.start.getTime() - now) : null;
  const cells: [string, number | undefined][] = [
    ["jours", parts?.j],
    ["heures", parts?.h],
    ["min", parts?.m],
    ["sec", parts?.s],
  ];

  return (
    <div>
      <p className="eyebrow text-gold-400">
        {next ? (next.live ? "En ce moment · " : "Prochain culte · ") + `${relativeDay(next.start)} ${formatTime(next.slot.start)}` : "Prochain culte"}
      </p>
      {next?.live ? (
        <p className="font-display mt-4 text-3xl text-white">{next.slot.title} en cours</p>
      ) : (
        <ol className="mt-5 grid grid-cols-4 gap-2 sm:gap-3" aria-label="Temps restant avant le prochain culte">
          {cells.map(([label, v]) => (
            <li key={label} className="rounded-xl border border-white/10 bg-white/[0.04] px-2 py-3 text-center">
              <span className="font-display block text-3xl tabular-nums text-gold-400 sm:text-4xl">
                {v === undefined ? "––" : String(v).padStart(2, "0")}
              </span>
              <span className="eyebrow mt-1 block !text-[0.55rem] text-white/50">{label}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export function UpcomingList({ count = 3, tone = "light" }: { count?: number; tone?: "light" | "dark" }) {
  const list = useUpcoming(count);
  if (!list) {
    return <div className="h-48 animate-pulse rounded-2xl bg-ink/5" aria-hidden />;
  }
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {list.map((o, i) => {
        const featured = i === 0;
        return (
          <li
            key={o.start.toISOString()}
            className={`flex gap-5 rounded-2xl p-6 ${
              featured
                ? "bg-gradient-to-br from-night-900 to-night-700 text-white"
                : tone === "dark"
                  ? "border border-white/10 bg-white/[0.03] text-white"
                  : "border border-ink/10 bg-white"
            }`}
          >
            <div
              className={`flex w-16 shrink-0 flex-col items-center justify-center border py-3 ${
                featured ? "border-gold-400/60" : "border-ink/10"
              }`}
            >
              <span className="font-display text-3xl leading-none">{frDayNum(o.start)}</span>
              <span className={`eyebrow mt-1 !text-[0.55rem] ${featured ? "text-gold-400" : "text-gold-700"}`}>{frMonth(o.start)}</span>
            </div>
            <div>
              <p className={`eyebrow !text-[0.6rem] ${featured ? "text-gold-400" : "text-gold-700"}`}>
                {o.live ? "En ce moment" : relativeDay(o.start)}
              </p>
              <p className="font-display mt-1 text-xl font-semibold leading-snug">{o.slot.title}</p>
              <p className={`mt-1 text-sm ${featured ? "text-white/70" : "text-muted"}`}>
                {formatTime(o.slot.start)} — {formatTime(o.slot.end)}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
