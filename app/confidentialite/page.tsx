import type { Metadata } from "next";
import { ManageCookiesButton } from "@/components/cookie-banner";
import { L, LegalPage } from "@/components/legal";
import { legal } from "@/lib/legal";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Politique de confidentialité · AFVN Nantes",
  description: "Quelles données le site de l'AFVN Nantes collecte, pourquoi, combien de temps, et comment exercer vos droits (RGPD, cookies).",
  path: "/confidentialite",
});

export default function ConfidentialitePage() {
  const contact = (
    <>
      {legal.email ? <a href={`mailto:${legal.email}`}>{legal.email}</a> : <L v="" hint="adresse e-mail de contact" />}, par téléphone au{" "}
      <a href={site.phone.href}>{site.phone.display}</a> ou par courrier au {site.address.street}, {site.address.postalCode}{" "}
      {site.address.city}
    </>
  );
  return (
    <LegalPage eyebrow="Vos données" lead="Politique de" accent="confidentialité." updated={legal.lastUpdate}>
      <section>
        <h2>En bref</h2>
        <ul>
          <li>Le site ne contient ni publicité, ni cookie publicitaire, ni compte utilisateur.</li>
          <li>Les vidéos YouTube, la carte Google Maps et la mesure d&apos;audience ne sont chargées qu&apos;avec votre accord.</li>
          <li>Vos données ne sont jamais vendues ni cédées.</li>
        </ul>
      </section>
      <section>
        <h2>Responsable du traitement</h2>
        <p>
          <L v={legal.publisherName} hint="nom officiel de l'association" />, {site.address.street}, {site.address.postalCode}{" "}
          {site.address.city}. Contact : {contact}.
        </p>
      </section>
      <section>
        <h2>Les données que nous collectons</h2>
        <p>
          <strong>Formulaire d&apos;accueil (CESA).</strong> Si vous le remplissez, nous recevons les informations que vous
          y indiquez (nom, coordonnées, date de visite, éventuellement un sujet de prière). Elles servent uniquement à
          vous accueillir et à vous recontacter. Le formulaire est hébergé par Google Forms (Google Ireland Ltd). Ces
          informations peuvent révéler une appartenance religieuse : elles ne sont traitées qu&apos;avec votre accord,
          consultées par la seule équipe d&apos;accueil et conservées {legal.welcomeRetention}.
        </p>
        <p>
          <strong>Appels et demandes de prière.</strong> Ce que vous nous confiez par téléphone n&apos;est pas enregistré
          par le site et reste confidentiel au sein de l&apos;équipe pastorale.
        </p>
        <p>
          <strong>Mesure d&apos;audience (avec votre accord).</strong> Vercel Web Analytics compte les pages vues de façon
          anonyme et agrégée, sans cookie ni identifiant permanent. Nous ne voyons aucune donnée individuelle.
        </p>
        <p>
          <strong>Contenus externes (avec votre accord).</strong> Les vidéos YouTube (en mode « confidentialité renforcée
          ») et la carte Google Maps sont fournies par Google, qui peut déposer ses propres cookies lorsque vous les
          chargez.
        </p>
        <p>
          <strong>Hébergement.</strong> Notre hébergeur, Vercel Inc., traite techniquement les adresses IP pour afficher
          le site et le protéger contre les attaques, pendant une durée limitée.
        </p>
      </section>
      <section>
        <h2>Ce qui est enregistré sur votre appareil</h2>
        <ul>
          <li>votre choix sur les cookies (conservé 6 mois, puis redemandé) ;</li>
          <li>la taille de texte choisie avec le bouton « Aa » ;</li>
          <li>une copie des pages visitées, pour consulter le site hors connexion (application installée).</li>
        </ul>
        <p>Ces éléments sont strictement nécessaires au fonctionnement du site et restent sur votre appareil.</p>
        <p>
          Vous pouvez modifier vos choix à tout moment : <ManageCookiesButton className="font-semibold text-gold-700 underline" />.
        </p>
      </section>
      <section>
        <h2>Transferts hors de l&apos;Union européenne</h2>
        <p>
          Google et Vercel peuvent traiter des données aux États-Unis. Ces transferts sont encadrés par le cadre de
          protection des données UE–États-Unis (Data Privacy Framework) et les clauses contractuelles types de la
          Commission européenne.
        </p>
      </section>
      <section>
        <h2>Vos droits</h2>
        <p>
          Vous pouvez demander l&apos;accès, la rectification, la suppression ou la limitation de vos données, vous
          opposer à leur traitement et retirer votre consentement à tout moment, en nous contactant : {contact}. Nous
          répondons sous un mois.
        </p>
        <p>
          Si vous estimez que vos droits ne sont pas respectés, vous pouvez saisir la CNIL (
          <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer">
            cnil.fr
          </a>
          ).
        </p>
      </section>
    </LegalPage>
  );
}
