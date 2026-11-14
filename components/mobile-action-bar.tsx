import { site } from "@/lib/site";

const actions = [
  {
    label: "Horaires",
    href: "/#horaires",
    icon: <path d="M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
  },
  {
    label: "Itinéraire",
    href: site.mapsUrl,
    external: true,
    icon: (
      <>
        <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
        <circle cx="12" cy="9.5" r="2.5" />
      </>
    ),
  },
  {
    label: "Appeler",
    href: site.phone.href,
    icon: (
      <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    ),
  },
];

// Barre d'actions fixe en bas de l'écran, sur mobile uniquement.
export function MobileActionBar() {
  return (
    <nav
      aria-label="Actions rapides"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-navy-950/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <ul className="grid grid-cols-3">
        {actions.map((a) => (
          <li key={a.label}>
            <a
              href={a.href}
              {...(a.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="flex flex-col items-center gap-1 py-2.5 text-[0.7rem] font-medium text-white/85 active:text-gold-300"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-5 text-gold-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                {a.icon}
              </svg>
              {a.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
