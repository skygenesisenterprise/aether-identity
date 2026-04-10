import { RegisterForm } from "@/components/auth/register-form"
import { Shield, Lock, Clock, CheckCircle } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary text-primary-foreground flex-col justify-between p-12 overflow-y-auto">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Sky Genesis Enterprise</h1>
              <p className="text-primary-foreground/70 text-sm">Portail Institutionnel Sécurisé</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold leading-tight text-balance">
                Rejoindre le Portail Officiel de Sky Genesis Enterprise
              </h2>
              <p className="mt-4 text-primary-foreground/80 leading-relaxed">
                Créez votre compte pour accéder à l&apos;ensemble des services institutionnels.
                Votre inscription sera vérifiée par nos équipes de sécurité.
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
          <p>&copy; 2024 Sky Genesis Enterprise. Tous droits réservés.</p>
          <p className="mt-1">Version 2.4.1 | Dernière mise à jour : Janvier 2024</p>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="w-full lg:w-1/2 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-primary text-primary-foreground p-4 shrink-0">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-lg font-bold">Sky Genesis Enterprise</h1>
              <p className="text-primary-foreground/70 text-xs">Portail Institutionnel</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-6 bg-background overflow-y-auto">
          <div className="w-full max-w-md space-y-4">
            <div className="text-center lg:text-left">
              <h2 className="text-lg lg:text-xl font-bold text-foreground">Créer un compte</h2>
              <p className="mt-1 text-xs lg:text-sm text-muted-foreground">
                Inscrivez-vous pour accéder à votre espace sécurisé
              </p>
            </div>

            <RegisterForm />

            <div className="pt-3 border-t border-border">
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Connexion sécurisée SSL/TLS</span>
              </div>
            </div>
          </div>
        </div>

        <footer className="p-4 bg-muted/50 border-t border-border shrink-0">
          <div className="max-w-md mx-auto text-center text-xs lg:text-sm text-muted-foreground space-y-1">
            <p>
              En vous inscrivant, vous acceptez nos{" "}
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
