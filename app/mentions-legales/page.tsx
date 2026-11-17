import type { Metadata } from "next";
import { L, LegalPage } from "@/components/legal";
import { legal } from "@/lib/legal";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Mentions légales · AFVN Nantes",
  description: "Mentions légales du site de l'AFVN Nantes : éditeur, directeur de la publication, hébergeur et propriété intellectuelle.",
  path: "/mentions-legales",
});

export default function MentionsLegalesPage() {
  return (
    <LegalPage eyebrow="Informations légales" lead="Mentions" accent="légales." updated={legal.lastUpdate}>
      <section>
        <h2>Éditeur du site</h2>
        <p>
          <L v={legal.publisherName} hint="nom officiel de l'association" />
          <br />
          <L v={legal.publisherForm} hint="forme juridique" />
          <br />
          Numéro RNA ou SIREN : <L v={legal.rna} hint="numéro RNA ou SIREN" />
          <br />
          Siège : {site.address.street}, {site.address.postalCode} {site.address.city}
          <br />
          Téléphone : <a href={site.phone.href}>{site.phone.display}</a>
          <br />
          E-mail : {legal.email ? <a href={`mailto:${legal.email}`}>{legal.email}</a> : <L v="" hint="adresse e-mail de contact" />}
        </p>
      </section>
      <section>
        <h2>Directeur de la publication</h2>
        <p>
          <L v={legal.publicationDirector} hint="nom du directeur de la publication" />
        </p>
      </section>
      <section>
        <h2>Hébergeur</h2>
        <p>
          {legal.host.name}
          <br />
          {legal.host.address}
          <br />
          <a href={legal.host.url} target="_blank" rel="noopener noreferrer">
            vercel.com
          </a>
        </p>
      </section>
      <section>
        <h2>Propriété intellectuelle</h2>
        <p>
          Les textes, photographies, logos et vidéos de ce site appartiennent à l&apos;église AFVN Nantes ou sont utilisés
          avec l&apos;accord de leurs auteurs. Toute reproduction sans autorisation préalable est interdite. Les
          personnes photographiées peuvent demander le retrait d&apos;une image en nous contactant.
        </p>
      </section>
      <section>
        <h2>Données personnelles et cookies</h2>
        <p>
          Voir notre <a href="/confidentialite">politique de confidentialité</a> et nos{" "}
          <a href="/conditions">conditions générales d&apos;utilisation</a>.
        </p>
      </section>
    </LegalPage>
  );
}
