import type { Metadata } from "next";
import { Button, Gallery, PageHero } from "@/components/ui";

export const metadata: Metadata = {
  alternates: { canonical: "/apropos/vie-eglise-locale" },
  title: "La vie de l'église locale",
  description: "Cultes, baptêmes, communion fraternelle : découvrez en images la vie de l'AFVN Nantes.",
};

const photos = [
  "/eglise/photo-1.jpg",
  "/eglise/IMG_2766.jpg",
  "/eglise/photo-2.jpg",
  "/eglise/photo-4.jpg",
  "/eglise/IMG_0282.jpg",
  "/eglise/photo-3.jpg",
  "/eglise/photo-5.jpg",
] as const;

export default function VieEgliseLocalePage() {
  return (
    <>
      <PageHero
        eyebrow="Vie de l'église locale"
        title="Nos cultes, notre famille, notre atmosphère."
        intro="Découvrez la vie de l'AFVN Nantes : des temps d'adoration, d'enseignement, de prière, de communion fraternelle et de croissance spirituelle."
        image="/eglise/photo-4.jpg"
      />
      <section className="px-5 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <Gallery photos={photos} alt="Vie de l'église AFVN Nantes" />
          <div className="mt-12 text-center">
            <Button href="/nous-rejoindre">Faire partie de la famille</Button>
          </div>
        </div>
      </section>
    </>
  );
}
