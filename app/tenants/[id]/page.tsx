"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Star,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Home,
  Heart,
  DollarSign,
  Calendar,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient, type TenantProfile } from "@/lib/supabase"

export default function TenantDetailPage() {
  const params = useParams()
  const [tenant, setTenant] = useState<TenantProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTenant = async () => {
      setLoading(true)
      setError(null)
      const supabase = createClient()
      if (!params.id) {
        setError("Aucun identifiant de locataire fourni.")
        setLoading(false)
        return
      }
      try {
        const { data, error } = await supabase
          .from("tenant_profiles")
          .select("*")
          .eq("id", params.id)
          .single()
        if (error) {
          setError("Erreur lors du chargement du locataire : " + error.message)
          setTenant(null)
        } else {
          setTenant(data)
        }
      } catch (err: any) {
        setError("Erreur inattendue : " + err.message)
        setTenant(null)
      } finally {
        setLoading(false)
      }
    }
    fetchTenant()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Chargement du profil locataire...</p>
        </div>
      </div>
    )
  }

  if (error || !tenant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p>{error || "Locataire introuvable"}</p>
            <Link href="/tenants">
              <Button className="mt-4">Retour à la liste</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-500"
    if (score >= 80) return "bg-blue-500"
    if (score >= 70) return "bg-yellow-500"
    return "bg-red-500"
  }

  // Adapter le mapping des champs pour correspondre à la structure réelle
  // Construction du nom complet
  const fullName = `${tenant.first_name} ${tenant.last_name}`
  // Avatar fallback
  const avatarUrl = "/placeholder.svg"
  // Calcul de l'âge si date de naissance présente
  let age: number | undefined = undefined
  if (tenant.date_of_birth) {
    const birthDate = new Date(tenant.date_of_birth)
    const today = new Date()
    age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/tenants">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tenants
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tenant Profile</h1>
              <p className="text-gray-600">Complete interview and background information</p>
            </div>
          </div>

          {/* Profile Overview */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={avatarUrl} alt={fullName} />
                    <AvatarFallback className="text-lg">
                      {tenant.first_name?.[0]}{tenant.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">{fullName}</CardTitle>
                    <CardDescription className="text-lg">
                      {age !== undefined ? `${age} ans` : null} {tenant.profession ? `• ${tenant.profession}` : null}
                    </CardDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{tenant.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{tenant.phone}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`px-4 py-2 rounded-full text-white text-xl font-bold ${getScoreColor(tenant.score ?? 0)} mb-2`}
                  >
                    {tenant.score ?? "-"}%
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor((tenant.score ?? 0) / 20) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Financial Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Financial Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Revenu mensuel</span>
                    <div className="text-lg font-semibold text-green-600">{tenant.monthly_income?.toLocaleString()}€</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Type d'emploi</span>
                    <div className="text-sm">{tenant.employment_type}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Entreprise</span>
                    <div className="text-sm">{tenant.company_name}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Garant</span>
                    <div className="text-sm">{tenant.guarantor_type} {tenant.guarantor_income ? `(${tenant.guarantor_income.toLocaleString()}€/mois)` : null}</div>
                  </div>
                </div>
                <Separator />
                {/* Documents soumis (JSON) */}
                <div>
                  <span className="text-sm font-medium text-gray-600">Documents soumis</span>
                  <div className="text-xs bg-gray-50 p-2 rounded mt-1">
                    {tenant.documents_submitted ? (
                      <pre>{JSON.stringify(tenant.documents_submitted, null, 2)}</pre>
                    ) : (
                      <span>Aucun document</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Statut fumeur</span>
                    <div className="text-sm">{tenant.smoking_status}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Animaux</span>
                    <div className="text-sm">{tenant.pets && tenant.pets.length > 0 ? tenant.pets.join(", ") : "Aucun"}</div>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Langues</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {tenant.languages && tenant.languages.length > 0 ? tenant.languages.map((lang, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {lang}
                      </Badge>
                    )) : <span className="text-xs">Non renseigné</span>}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Style de vie</span>
                  <div className="text-sm mt-1">{tenant.lifestyle_description || "Non renseigné"}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interview Responses */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Réponses à l'entretien
              </CardTitle>
              <CardDescription>Réponses détaillées du locataire</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {tenant.interview_responses ? (
                <pre className="bg-gray-50 p-3 rounded text-xs">{JSON.stringify(tenant.interview_responses, null, 2)}</pre>
              ) : (
                <span className="text-xs">Aucune réponse enregistrée</span>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <Button className="flex-1" size="lg">
              <Calendar className="w-4 h-4 mr-2" />
              Send Scheduling Link
            </Button>
            <Button variant="outline" className="flex-1" size="lg">
              <Mail className="w-4 h-4 mr-2" />
              Contact Tenant
            </Button>
            <Button variant="destructive" size="lg">
              Reject Application
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
