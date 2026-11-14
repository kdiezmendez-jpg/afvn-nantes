import { site } from "@/lib/site";

const icons = {
  youtube: (
    <path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8ZM9.7 15.1V8.9l5.8 3.1-5.8 3.1Z" />
  ),
  instagram: (
    <path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4ZM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4ZM12 2.2c2.7 0 3 0 4 .1 1 0 1.5.2 1.9.4.5.2.8.4 1.2.8.4.4.6.7.8 1.2.1.4.3.9.4 1.9v8c-.1 1-.2 1.5-.4 1.9-.2.5-.4.8-.8 1.2-.4.4-.7.6-1.2.8-.4.1-.9.3-1.9.4h-8c-1-.1-1.5-.2-1.9-.4a3 3 0 0 1-1.2-.8 3 3 0 0 1-.8-1.2c-.1-.4-.3-.9-.4-1.9v-8c.1-1 .2-1.5.4-1.9.2-.5.4-.8.8-1.2.4-.4.7-.6 1.2-.8.4-.1.9-.3 1.9-.4h4Z" />
  ),
  facebook: (
    <path d="M13.5 21.5v-8.2h2.8l.4-3.2h-3.2V8c0-.9.3-1.6 1.6-1.6h1.7V3.6a23 23 0 0 0-2.5-.1c-2.5 0-4.2 1.5-4.2 4.3v2.3H7.3v3.2h2.8v8.2h3.4Z" />
  ),
};

const labels = { youtube: "YouTube", instagram: "Instagram", facebook: "Facebook" } as const;

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex gap-2 ${className}`}>
      {(Object.keys(icons) as (keyof typeof icons)[]).map((key) => (
        <li key={key}>
          <a
            href={site.socials[key]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${labels[key]} (nouvel onglet)`}
            className="grid size-10 place-items-center rounded-full border border-white/15 text-white/80 transition hover:border-gold-400 hover:text-gold-300"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
              {icons[key]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
