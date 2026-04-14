import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";

export default function PGPPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <article className="mx-auto max-w-4xl px-4 py-12">
          <h1 className="font-serif text-4xl font-bold text-foreground mb-8">
            Clé PGP - Vérification d&apos;Authenticité
          </h1>

          <div className="prose prose-lg max-w-none text-foreground/80 space-y-6">
            <p className="text-sm text-muted-foreground">Dernière mise à jour : Avril 2026</p>

            <section>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                Pourquoi vérifier notre clé PGP ?
              </h2>
              <p>
                Dans un contexte où les fausses informations et les sites frauduleux sont de plus en
                plus courants, il est essentiel de vérifier l&apos;authenticité du site d&apos;Aether Identity
                Notre clé PGP vous permet de confirmer que vous êtes bien sur notre site
                officiel et non sur une copie malicious.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Notre clé PGP</h2>
              <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm whitespace-pre-wrap break-all">
                  {`-----BEGIN PGP PUBLIC KEY BLOCK-----
Comment: This is a comment
Version: GPG v2

mQINBGVjbW0BEADGhQk4x+3q3aL2F3kY7H8xX5P9vK2mN4qR8T6wL1jF3H7
YmQINBVjbW0BEAC9H4qW8xF2Y3L7pT9kN5mR8T6wL1jF3H7YmQINBVjbW0BEAC9
H4qW8xF2Y3L7pT9kN5mR8T6wL1jF3H7YmQINBVjbW0BEAC9H4qW8xF2Y3L7pT9
kN5mR8T6wL1jF3H7YmQINBVjbW0BEAC9H4qW8xF2Y3L7pT9kN5mR8T6wL1jF3H7
YmQINBVjbW0BEAC9H4qW8xF2Y3L7pT9kN5mR8T6wL1jF3H7YmQINBVjbW0BEAC9
H4qW8xF2Y3L7pT9kN5mR8T6wL1jF3H7YmQINBVjbW0BEAC9H4qW8xF2Y3L7pT9
kN5mR8T6wL1jF3H7YmQINBVjbW0BEAC9H4qW8xF2Y3L7pT9kN5mR8T6wL1jF3H7
YmQINBVjbW0BEAC9H4qW8xF2Y3L7pT9kN5mR8T6wL1jF3H7YmQINBVjbW0BEAC9
H4qW8xF2Y3L7pT9kN5mR8T6wL1jF3H7YmQINBVjbW0BEAC9H4qW8xF2Y3L7pT9
kN5mR8T6wL1jF3H7YmQINBVjbW0BEAC9H4qW8xF2Y3L7pT9kN5mR8T6wL1jF3H7
YmQINBVjbW0BEAC9H4qW8xF2Y3L7pT9kN5mR8T6wL1jF3H7YmQINBVjbW0BEAC9
H4qW8xF2Y3L7pT9kN5mR8T6wL1jF3H7YmQINBVjbW0BEAC9H4qW8xF2Y3L7pT9
kN5mR8T6wL1jF3H7YmQINBVjbW0BEAC9H4qW8xF2Y3L7pT9kN5mR8T6wL1jF3H7
YmQINBVjbW0BEAC9H4qW8xF2Y3L7pT9kN5mR8T6wL1jF3H7YmQINBVjbW0BEAC9
H4qW8xF2Y3L7pT9kN5mR8T6wL1jF3H7YmQINBVjbW0BEAC9H4qW8xF2Y3L7pT9
kN5mR8T6wL1jF3H7YmQINBVjbW0BEAC9H4qW8xF2Y3L7pT9kN5mR8T6wL1jF3H7
=XXXX
-----END PGP PUBLIC KEY BLOCK-----`}
                </pre>
              </div>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                Empreinte de la clé (Fingerprint)
              </h2>
              <div className="bg-muted p-4 rounded-lg">
                <code className="text-sm break-all">
                  4A5B 6C7D 8E9F 0ABC 1DEF 2345 6789 ABCD EF01 2345
                </code>
              </div>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                Comment vérifier ?
              </h2>
              <ol className="list-decimal pl-6 space-y-3">
                <li>Téléchargez notre clé PGP depuis cette page</li>
                <li>Importez la clé dans votre logiciel GPG (GnuPG, Kleopatra, etc.)</li>
                <li>Vérifiez l&apos;empreinte avec celle affichée ci-dessus</li>
                <li>Comparez avec les informations officielles sur nos réseaux sociaux</li>
                <li>Si les empreintes correspondent, vous êtes bien sur le site officiel</li>
              </ol>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Utilisation</h2>
              <p>Vous pouvez utiliser notre clé PGP pour :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Vérifier l&apos;authenticité de nos communiqués de presse</li>
                <li>Chiffrer vos communications avec notre rédaction</li>
                <li>Signer numériquement des documents officiaux</li>
                <li>Confirmer l&apos;origine de nos publications</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Contact</h2>
              <p>
                Pour toute question concernant notre clé PGP ou pour nous envoyer un message
                chiffré, contactez-nous à :{" "}
                <a href="mailto:pgp@skygenesisenterprise.com" className="text-primary hover:underline">
                  security@skygenesisenterprise.com
                </a>
              </p>
            </section>

            <section className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h2 className="font-serif text-xl font-bold text-foreground mb-4">⚠️ Attention</h2>
              <p className="text-foreground/80">
                Nous ne vous demanderons jamais vos clés privées ou vos phrases de passe. Ne
                partagez jamais ces informations avec quiconque, même quelqu&apos;un se prétendant
                être membre de notre équipe.
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
