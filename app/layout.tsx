import type { Metadata, Viewport } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { MobileActionBar } from "@/components/mobile-action-bar";
import { ServiceWorker } from "@/components/service-worker";
import { TextSizeToggle } from "@/components/text-size";
import { schedule, site } from "@/lib/site";
import "./globals.css";

const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"], display: "swap" });
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "AFVN Nantes — Assemblées Fleuve de Vie pour les Nations",
    template: "%s · AFVN Nantes",
  },
  description:
    "Église évangélique à Nantes (44300) : culte de célébration le dimanche à 9h30, enseignement et intercession le vendredi à 19h. " +
    site.tagline,
  applicationName: site.name,
  keywords: ["église Nantes", "église évangélique Nantes", "AFVN", "Fleuve de Vie", "culte dimanche Nantes", "Nantes Est"],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: site.name,
    url: "/",
  },
  appleWebApp: { capable: true, title: "AFVN Nantes", statusBarStyle: "black-translucent" },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  themeColor: "#03141f",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Church",
  name: site.fullName,
  alternateName: site.name,
  url: site.url,
  logo: `${site.url}/emblem-afvn.png`,
  image: `${site.url}/opengraph-image.jpg`,
  telephone: site.phone.display.replace(/\s/g, ""),
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    postalCode: site.address.postalCode,
    addressLocality: site.address.city,
    addressCountry: site.address.country,
  },
  openingHoursSpecification: schedule.map((s) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: `https://schema.org/${s.dayOfWeek}`,
    opens: s.start,
    closes: s.end,
  })),
  sameAs: Object.values(site.socials),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${dmSans.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col pb-[calc(4rem+env(safe-area-inset-bottom))] font-sans lg:pb-0">
        {/* Applique la taille de texte choisie avant l'affichage (évite un saut visuel). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("afvn-text");if(t)document.documentElement.dataset.text=t}catch(e){}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <SiteHeader />
        <main id="contenu" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <MobileActionBar />
        <TextSizeToggle />
        <ServiceWorker />
      </body>
    </html>
  );
}
