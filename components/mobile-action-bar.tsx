import { Icon, type IconName } from "./icons";
import { site } from "@/lib/site";

const actions: { label: string; href: string; icon: IconName; external?: boolean }[] = [
  { label: "Horaires", href: "/agenda", icon: "clock" },
  { label: "Live", href: site.liveUrl, icon: "play", external: true },
  { label: "Itinéraire", href: site.mapsUrl, icon: "pin", external: true },
  { label: "Appeler", href: site.phone.href, icon: "phone" },
];

// Barre d'actions fixe en bas de l'écran, sur mobile uniquement.
export function MobileActionBar() {
  return (
    <nav
      aria-label="Actions rapides"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-night-950/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <ul className="grid grid-cols-4">
        {actions.map((a) => (
          <li key={a.label}>
            <a
              href={a.href}
              {...(a.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="flex flex-col items-center gap-1 py-2.5 text-[0.7rem] font-medium text-white/85 active:text-gold-300"
            >
              <Icon name={a.icon} className="size-5 text-gold-400" />
              {a.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
