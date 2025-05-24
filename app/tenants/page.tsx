"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Calendar, Eye, ArrowLeft, Filter } from "lucide-react"
import Link from "next/link"
import { useTenantProfiles } from "@/hooks/use-tenant-profiles"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function TenantsPage() {
  const { tenants, loading, error, updateTenantStatus, sendSchedulingLink, isSupabaseConfigured } = useTenantProfiles()
  const [selectedTenants, setSelectedTenants] = useState<string[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [sentPayload, setSentPayload] = useState<any | null>(null)
  const [sentUrl, setSentUrl] = useState<string | null>(null)

  const handleSelectTenant = (tenantId: string) => {
    setSelectedTenants((prev) => (prev.includes(tenantId) ? prev.filter((id) => id !== tenantId) : [...prev, tenantId]))
  }

  const handleSendSchedulingEmail = async (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId)
    if (!tenant) return
    const params = new URLSearchParams({
      phone: tenant.phone || '',
      firstName: tenant.first_name,
      lastName: tenant.last_name,
      address: '15 rue de la Paix, Paris',
      sender: 'Agence SuperTenant',
    })
    const url = `https://n8n.srv756687.hstgr.cloud/webhook/b7681649-fec9-4b5f-b827-18c7d4f03542?${params.toString()}`
    setSentUrl(url)
    setErrorMessage(null)
    setSuccessMessage(null)
    setSentPayload(null)
    try {
      const res = await fetch(url, { method: 'GET' })
      if (res.ok) {
        setErrorMessage(null)
        setSuccessMessage('Lien de prise de rendez-vous envoyé avec succès !')
      } else {
        const text = await res.text()
        setErrorMessage('Erreur lors de l\'envoi du lien : ' + text)
      }
    } catch (e: any) {
      setErrorMessage('Erreur réseau lors de l\'envoi du lien : ' + e.message)
    }
    setSelectedTenants((prev) => prev.filter((id) => id !== tenantId))
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-500"
    if (score >= 80) return "bg-blue-500"
    if (score >= 70) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "reviewing":
        return "bg-yellow-100 text-yellow-800"
      case "pending":
        return "bg-blue-100 text-blue-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Trier les locataires par score décroissant
  const sortedTenants = [...tenants].sort((a, b) => (b.score || 0) - (a.score || 0))
  // Récupérer les IDs des 3 meilleurs
  const topTenantIds = sortedTenants.slice(0, 3).map(t => t.id)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading tenant profiles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Preferences
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Tenant Profiles</h1>
                <p className="text-gray-600">Review and select potential tenants based on your preferences</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              {selectedTenants.length > 0 && <Badge variant="secondary">{selectedTenants.length} selected</Badge>}
            </div>
          </div>

          {successMessage && (
            <Alert className="mb-6 border-green-400 bg-green-50">
              <div className="font-semibold mb-1 text-green-800">Succès</div>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          {errorMessage && (
            <Alert variant="destructive" className="mb-6">
              <div className="font-semibold mb-1">Erreur lors de l'envoi du lien</div>
              <AlertDescription>{errorMessage}</AlertDescription>
              {sentPayload && (
                <pre className="bg-gray-100 rounded p-2 mt-2 text-xs overflow-x-auto">{JSON.stringify(sentPayload, null, 2)}</pre>
              )}
            </Alert>
          )}

          {/* Tenant Cards Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedTenants?.map((tenant) => (
              <Card
                key={tenant.id ? tenant.id : ''}
                className={`relative transition-all duration-200 hover:shadow-lg ${
                  selectedTenants.includes(tenant.id ? tenant.id : '') ? "ring-2 ring-blue-500 bg-blue-50" : "" 
                } ${topTenantIds.includes(tenant.id) ? "ring-2 ring-green-500 bg-green-50" : ""}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src="/placeholder.svg"
                          alt={`${tenant.first_name} ${tenant.last_name}`}
                        />
                        <AvatarFallback>
                          {`${tenant.first_name} ${tenant.last_name}`
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">{`${tenant.first_name} ${tenant.last_name}`}
                          {topTenantIds.includes(tenant.id) && (
                            <span className="inline-block px-2 py-0.5 rounded bg-green-100 text-green-800 text-xs font-semibold ml-2">Top 3</span>
                          )}
                        </CardTitle>
                        <CardDescription>
                          {tenant.profession}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div
                        className={`px-2 py-1 rounded-full text-white text-sm font-medium ${getScoreColor(tenant.score || 0)}`}
                      >
                        {tenant.score ?? "-"}%
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < Math.floor((tenant.score || 0) / 20) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Key Info */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Income:</span>
                      <div className="text-green-600 font-medium">{tenant.monthly_income?.toLocaleString()}€/month</div>
                    </div>
                    <div>
                      <span className="font-medium">Guarantor:</span>
                      <div>{tenant.guarantor_type}</div>
                    </div>
                    <div>
                      <span className="font-medium">Lifestyle:</span>
                      <div>{tenant.lifestyle_description}</div>
                    </div>
                  </div>
                  {/* Match Reasons */}
                  <div>
                    <span className="text-sm font-medium text-gray-700">Why this matches:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {tenant.matched_preferences?.map((reason, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {reason}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {/* Highlights */}
                  <div>
                    <span className="text-sm font-medium text-gray-700">Highlights:</span>
                    <ul className="text-sm text-gray-600 mt-1">
                      {tenant.compatibility_reasons?.slice(0, 2).map((highlight, index) => (
                        <li key={index} className="flex items-center gap-1">
                          <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Link href={`/tenants/${tenant.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                    </Link>
                    {selectedTenants.includes(tenant.id ? tenant.id : '') ? (
                      <Button size="sm" className="flex-1" onClick={() => handleSendSchedulingEmail(tenant.id ? tenant.id : '')}>
                        <Calendar className="w-4 h-4 mr-1" />
                        Send Schedule
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleSelectTenant(tenant.id ? tenant.id : '')}
                      >
                        Select
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Selected Actions */}
          {selectedTenants.length > 0 && (
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border p-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">
                  {selectedTenants.length} tenant{selectedTenants.length > 1 ? "s" : ""} selected
                </span>
                <Button
                  size="sm"
                  onClick={() => {
                    selectedTenants.forEach((id) => handleSendSchedulingEmail(id))
                  }}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Send All Scheduling Links
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSelectedTenants([])}>
                  Clear Selection
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}