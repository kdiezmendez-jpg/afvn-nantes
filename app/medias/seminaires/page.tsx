import type { Metadata } from "next";
import { Button, ComingSoon, PageHero } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Séminaires",
  description: "Les séminaires AFVN : équiper les croyants pour qu'ils deviennent des disciples matures et formés.",
};

export default function SeminairesPage() {
  return (
    <>
      <PageHero
        eyebrow="Formation • Équipement • Croissance"
        title="Séminaires"
        image="/medias/eschatos/photo-2.jpg"
        intro="Les séminaires AFVN ont pour objectif d'équiper les croyants afin qu'ils deviennent des disciples matures, formés et utiles pour le Royaume de Dieu."
      />
      <section className="px-5 py-20 md:px-8">
        <div className="mx-auto max-w-4xl">
          <ComingSoon what="photos et vidéos des séminaires" />
          <div className="mt-8 flex justify-center">
            <Button href={site.socials.youtube} external variant="navy">
              Voir sur YouTube
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
