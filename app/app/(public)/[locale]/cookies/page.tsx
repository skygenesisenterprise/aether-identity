import { Locale, isValidLocale, defaultLocale } from "@/lib/locale";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";

interface PageProps {
  params: Promise<{ locale?: string }>;
}

export default async function CookiesPage({ params }: PageProps) {
  const { locale: paramLocale } = await params;
  const locale: Locale = paramLocale && isValidLocale(paramLocale) ? paramLocale : defaultLocale;

  return (
    <div className="min-h-screen flex flex-col bg-background">
     <Header locale={locale as import("@/lib/locale").Locale} />
     
      <main className="flex-1">
        <article className="mx-auto max-w-4xl px-4 py-12">
          <h1 className="font-serif text-4xl font-bold text-foreground mb-8">
            Politique relative aux Cookies
          </h1>

          <div className="prose prose-lg max-w-none text-foreground/80 space-y-6">
            <p className="text-sm text-muted-foreground">Dernière mise à jour : Avril 2026</p>

            <section>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                1. Qu&apos;est-ce qu&apos;un cookie ?
              </h2>
              <p>
                Un cookie est un petit fichier texte déposé sur votre appareil lors de la visite
                d&apos;un site web. Les cookies permettent de mémoriser des informations relatives à
                votre navigation et de faciliter votre expérience sur le site.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                2. Types de cookies utilisés
              </h2>
              <p>The Etheria Times utilise les types de cookies suivants :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Cookies essentiels</strong> : nécessaires au fonctionnement du site
                  (authentification, panier, préférences de langue)
                </li>
                <li>
                  <strong>Cookies analytiques</strong> : nous permettent de comprendre comment les
                  visiteurs utilisent notre site (pages visitées, temps passé)
                </li>
                <li>
                  <strong>Cookies fonctionnels</strong> : améliorent votre expérience (mémorisation
                  des préférences)
                </li>
                <li>
                  <strong>Cookies publicitaires</strong> : utilisés pour afficher des publicités
                  pertinentes
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                3. Finalités des cookies
              </h2>
              <p>Les cookies que nous utilisons ont les finalités suivantes :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Authentifier les utilisateurs et sécuriser leur session</li>
                <li>Mémoriser vos préférences et paramètres</li>
                <li>Analyser l&apos;audience et améliorer nos services</li>
                <li>Personnaliser le contenu et les publicités</li>
                <li>Mesurer l&apos;efficacité de nos campagnes</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                4. Gestion des cookies
              </h2>
              <p>
                Vous pouvez à tout moment modifier vos préférences concernant les cookies non
                essentiels via notre bandeau de cookies ou les paramètres de votre navigateur.
              </p>
              <p className="mt-2">La plupart des navigateurs vous permettent de :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Voir les cookies stockés sur votre appareil</li>
                <li>Supprimer certains ou tous les cookies</li>
                <li>Bloquer tous ou certains types de cookies</li>
                <li>Configurer des notifications pour les nouveaux cookies</li>
              </ul>
              <p className="mt-2">
                Veuillez noter que la désactivation de certains cookies peut affecter certaines
                fonctionnalités du site.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                5. Cookies tiers
              </h2>
              <p>
                Notre site peut contenir des cookies provenant de tiers (partenaires publicitaires,
                réseaux sociaux, analytiques). Nous n&apos;contrôlons pas ces cookies et vous
                invitons à consulter les politiques de confidentialité de ces tiers.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                6. Durée de conservation
              </h2>
              <p>Les cookies ont une durée de vie limitée :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cookies de session : supprimés à la fermeture du navigateur</li>
                <li>Cookies persistants : conservés pour une durée maximale de 13 mois</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                7. Consentement
              </h2>
              <p>
                Lors de votre première visite, un bandeau vous permet d&apos;accepter ou de refuser
                les cookies non essentiels. Votre consentement est valide pour une durée de 13 mois.
              </p>
              <p className="mt-2">
                Vous pouvez modifier vos préférences à tout moment en cliquant sur le lien
                &quot;Gestion des cookies&quot; en bas de page.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                8. Mise à jour de cette politique
              </h2>
              <p>
                Cette politique peut être modifiée à tout moment. En cas de modification
                substantielle, nous vous en informerons via le site.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">9. Contact</h2>
              <p>
                Pour toute question concernant notre politique de cookies, vous pouvez nous
                contacter à l&apos;adresse : contact@etheriatimes.com
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer locale={locale} />
    </div>
  );
}
