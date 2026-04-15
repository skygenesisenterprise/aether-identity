import { LoginForm } from "@/components/auth/login-form";
import { Shield, Lock, Clock, CheckCircle } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary text-primary-foreground flex-col justify-between p-12">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Sky Genesis Enterprise</h1>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold leading-tight text-balance">
                Bienvenue sur le Portail Officiel
              </h2>
              <p className="mt-4 text-primary-foreground/80 leading-relaxed">
                Accédez à vos services enterprise en toute sécurité.
                Notre plateforme garantit la confidentialité et l&apos;intégrité de vos données.
              </p>
            </div>

            <div className="space-y-4 pt-8 border-t border-primary-foreground/20">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary-foreground/10 rounded-lg">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Protection Avancée</h3>
                  <p className="text-sm text-primary-foreground/70">Chiffrement de bout en bout conforme aux normes gouvernementales</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary-foreground/10 rounded-lg">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Conformité Réglementaire</h3>
                  <p className="text-sm text-primary-foreground/70">Certifié ISO 27001 et conforme RGPD</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary-foreground/10 rounded-lg">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Disponibilité 24/7</h3>
                  <p className="text-sm text-primary-foreground/70">Infrastructure redondante et support technique continu</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm text-primary-foreground/60">
          <p>&copy; 2026 Sky Genesis Enterprise. Tous droits réservés.</p>
          <p className="mt-1">Version 1.0.0 | Dernière mise à jour : Avril 2026</p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden bg-primary text-primary-foreground p-6">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl font-bold">Sky Genesis Enterprise</h1>
              <p className="text-primary-foreground/70 text-sm">Portail Institutionnel</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8 bg-background">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-bold text-foreground">Connexion</h2>
              <p className="mt-2 text-muted-foreground">
                Veuillez vous authentifier pour accéder à votre espace sécurisé
              </p>
            </div>

            <LoginForm />

            <div className="pt-6 border-t border-border">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Connexion sécurisée SSL/TLS</span>
              </div>
            </div>
          </div>
        </div>

        <footer className="p-6 bg-muted/50 border-t border-border">
          <div className="max-w-md mx-auto text-center text-sm text-muted-foreground space-y-2">
            <p>
              En vous connectant, vous acceptez nos{" "}
              <a href="#" className="text-primary hover:underline">Conditions d&apos;utilisation</a>
              {" "}et notre{" "}
              <a href="#" className="text-primary hover:underline">Politique de confidentialité</a>
            </p>
            <p className="text-xs">
              Toute tentative d&apos;accès non autorisé est strictement interdite et sera signalée aux autorités compétentes.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
