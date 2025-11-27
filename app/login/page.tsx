"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Separator } from "../components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { useToast } from "../components/ui/use-toast"

export default function UnifiedAuthForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [identifier, setIdentifier] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
  const [isMounted, setIsMounted] = useState(false)
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null)
  const [clientId, setClientId] = useState<string | null>(null)
  const [state, setState] = useState<string | null>(null)
  const [clientName, setClientName] = useState<string | null>(null)
  const [clientLogo, setClientLogo] = useState<string | null>(null)
  const [skipConsent, setSkipConsent] = useState<boolean>(false)
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    setIsMounted(true)
    
    // Parse URL parameters for SSO flow (comme Google/Microsoft)
    const urlParams = new URLSearchParams(window.location.search)
    const redirect = urlParams.get('redirect_uri')
    const client = urlParams.get('client_id')
    const stateParam = urlParams.get('state')
    const session = urlParams.get('session_id')
    const clientNameParam = urlParams.get('client_name')
    const clientLogoParam = urlParams.get('client_logo')
    const skipConsentParam = urlParams.get('skip_consent')
    
    if (redirect) setRedirectUrl(redirect)
    if (client) setClientId(client)
    if (stateParam) setState(stateParam)
    if (session) setSessionId(session)
    if (clientNameParam) setClientName(clientNameParam)
    if (clientLogoParam) setClientLogo(clientLogoParam)
    if (skipConsentParam) setSkipConsent(skipConsentParam === 'true')
  }, [])

  // Set page title
  useEffect(() => {
    document.title = "Sky Genesis Enterprise - Identity Provider"
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Utiliser l'API Aether Identity comme un vrai Identity Provider
      const response = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: identifier || email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed")
      }

       // Store tokens and user data
       localStorage.setItem("authToken", data.data.tokens.accessToken)
       localStorage.setItem("refreshToken", data.data.tokens.refreshToken)
       localStorage.setItem("idToken", data.data.tokens.idToken || "")
       localStorage.setItem("user", JSON.stringify(data.data.user))
       localStorage.setItem("memberships", JSON.stringify(data.data.user.memberships || []))

       // Show success toast
       toast({
         title: "Connexion réussie",
         description: "Bienvenue sur Sky Genesis Enterprise",
       })

       // Handle SSO redirect or default redirect
       setTimeout(() => {
         if (redirectUrl && clientId) {
           // SSO flow: redirect back to client application with authorization code
           const authCode = btoa(JSON.stringify({
             user: data.data.user,
             tokens: data.data.tokens,
             timestamp: Date.now()
           }))
           
           const redirectUrlWithCode = new URL(redirectUrl)
           redirectUrlWithCode.searchParams.set('code', authCode)
           if (state) redirectUrlWithCode.searchParams.set('state', state)
           
           window.location.href = redirectUrlWithCode.toString()
         } else {
           // Default flow: redirect to dashboard
           router.push("/home")
         }
       }, 1000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred during login"
      setError(errorMessage)
      toast({
        title: "Erreur de connexion",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      toast({
        title: "Erreur de validation",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères")
      toast({
        title: "Erreur de validation",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          fullName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      // Store tokens and user data
      localStorage.setItem("authToken", data.data.tokens.accessToken)
      localStorage.setItem("refreshToken", data.data.tokens.refreshToken)
      localStorage.setItem("idToken", data.data.tokens.idToken || "")
      localStorage.setItem("user", JSON.stringify(data.data.user))
      localStorage.setItem("memberships", JSON.stringify(data.data.user.memberships || []))

       // Show success toast
       toast({
         title: "Inscription réussie",
         description: "Votre compte a été créé avec succès",
       })

       // Handle SSO redirect or default redirect
       setTimeout(() => {
         if (redirectUrl && clientId) {
           // SSO flow: redirect back to client application with authorization code
           const authCode = btoa(JSON.stringify({
             user: data.data.account,
             tokens: data.data.tokens,
             timestamp: Date.now()
           }))
           
           const redirectUrlWithCode = new URL(redirectUrl)
           redirectUrlWithCode.searchParams.set('code', authCode)
           if (state) redirectUrlWithCode.searchParams.set('state', state)
           
           window.location.href = redirectUrlWithCode.toString()
         } else {
           // Default flow: redirect to dashboard
           router.push("/home")
         }
       }, 1000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred during registration"
      setError(errorMessage)
      toast({
        title: "Erreur d'inscription",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider: string) => {
    if (provider === 'keycloak') {
      // Use NextAuth signIn for Keycloak SSO
      window.location.href = '/api/auth/signin/keycloak'
    } else {
      toast({
        title: "Connexion OAuth",
        description: `Connexion avec ${provider} bientôt disponible`,
      })
    }
  }

  // Check if user is already logged in (only redirect from non-login pages)
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    const currentPath = window.location.pathname
    
    if (token && currentPath !== "/login") {
      // User is already logged in and not on login page, redirect to dashboard
      router.push("/admin/dashboard")
    }
  }, [router])

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-gray-200 shadow-2xl">
          <CardHeader className="space-y-4 text-center pb-8">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 2L2 7L12 12L22 7L12 2Z"
                      fill="white"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 17L12 22L22 17"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 12L12 17L22 12"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-center">
              {/* Client logo if available */}
              {clientLogo && (
                <div className="flex justify-center mb-4">
                  <img 
                    src={clientLogo} 
                    alt={clientName || 'Application'} 
                    className="h-12 w-12 rounded-lg object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}
              
              <CardTitle className="text-2xl font-bold text-black">
                {clientName ? `Connectez-vous à ${clientName}` : 'Sky Genesis Identity'}
              </CardTitle>
              
              <CardDescription className="text-gray-600">
                {clientId 
                  ? `Utilisez votre compte Aether Identity pour accéder à ${clientName}`
                  : 'Identity Provider - Single Sign-On'
                }
              </CardDescription>
              
              {/* Security badge */}
              {clientId && (
                <div className="flex items-center justify-center gap-2 mt-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Connexion sécurisée via Aether Identity
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {isMounted ? (
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")} className="w-full" defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="identifier" className="text-sm font-medium text-black">
                      Email, Username, or Phone
                    </Label>
                    <Input
                      id="identifier"
                      type="text"
                      placeholder="Enter your identifier"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      required
                      className="bg-white border-gray-300 text-black placeholder:text-gray-400 focus:border-black focus:ring-black"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium text-black">
                        Password
                      </Label>
                      <button 
                        type="button" 
                        className="text-sm text-gray-500 hover:text-black transition-colors"
                        onClick={() => {
                          // TODO: Implement forgot password functionality
                          console.log("Forgot password clicked")
                        }}
                      >
                        Forgot password?
                      </button>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-white border-gray-300 text-black placeholder:text-gray-400 focus:border-black focus:ring-black"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-black hover:bg-gray-800 text-white font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium text-black">
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="bg-white border-gray-300 text-black placeholder:text-gray-400 focus:border-black focus:ring-black"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-black">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-white border-gray-300 text-black placeholder:text-gray-400 focus:border-black focus:ring-black"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-black">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-white border-gray-300 text-black placeholder:text-gray-400 focus:border-black focus:ring-black"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-black">
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="bg-white border-gray-300 text-black placeholder:text-gray-400 focus:border-black focus:ring-black"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-black hover:bg-gray-800 text-white font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            ) : (
              <div className="w-full">
                <div className="grid w-full grid-cols-2">
                  <button className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium bg-background text-foreground shadow-sm">
                    Sign In
                  </button>
                  <button className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium">
                    Sign Up
                  </button>
                </div>
                <div className="mt-2 space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="identifier" className="text-sm font-medium text-black">
                        Email, Username, or Phone
                      </Label>
                      <Input
                        id="identifier"
                        type="text"
                        placeholder="Enter your identifier"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        required
                        className="bg-white border-gray-300 text-black placeholder:text-gray-400 focus:border-black focus:ring-black"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-black">
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-white border-gray-300 text-black placeholder:text-gray-400 focus:border-black focus:ring-black"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-black hover:bg-gray-800 text-white font-medium"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </div>
              </div>
            )}


          </CardContent>

          <CardFooter className="flex justify-between text-sm text-gray-500 pt-6 border-t">
            <button className="hover:text-black transition-colors">Terms of Service</button>
            <button className="hover:text-black transition-colors">Privacy Policy</button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}