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
import { toast } from "sonner"

export default function TenantsPage() {
  const { tenants, loading, error, updateTenantStatus, sendSchedulingLink, isSupabaseConfigured, refetch } = useTenantProfiles()
  const [selectedTenants, setSelectedTenants] = useState<string[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [sentPayload, setSentPayload] = useState<any | null>(null)
  const [sentUrl, setSentUrl] = useState<string | null>(null)
  const [scoring, setScoring] = useState<string | null>(null)
  const [tenantsState, setTenantsState] = useState(tenants || [])

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

  const handleScore = async (tenantId: string) => {
    setScoring(tenantId)
    try {
      const res = await fetch(`/api/scorer/${tenantId}`, { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erreur lors du scoring")
      await refetch()
      toast.success(`Score mis à jour : ${data.score}`)
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setScoring(null)
    }
  }

  const handleRemoveProsConsScore = async (tenantId: string) => {
    try {
      const res = await fetch(`/api/tenants/${tenantId}/remove-pros-cons-score`, { method: 'POST' })
      if (!res.ok) throw new Error('Failed to remove pros/cons & score')
      toast.success('Pros, cons & score removed!')
      refetch()
    } catch (e: any) {
      toast.error(e.message)
    }
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

  // Utiliser tenantsState si modifié, sinon tenants
  const displayedTenants = tenantsState.length ? tenantsState : tenants

  // Trier les locataires par score décroissant à partir de displayedTenants
  const sortedTenants = [...displayedTenants].sort((a, b) => (b.score || 0) - (a.score || 0))
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
              <div className="font-semibold mb-1 text-green-800">Success</div>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          {errorMessage && (
            <Alert variant="destructive" className="mb-6">
              <div className="font-semibold mb-1">Error sending link</div>
              <AlertDescription>{errorMessage}</AlertDescription>
              {sentPayload && (
                <pre className="bg-gray-100 rounded p-2 mt-2 text-xs overflow-x-auto">{JSON.stringify(sentPayload, null, 2)}</pre>
              )}
            </Alert>
          )}

          {/* Tenant Cards Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedTenants?.map((tenant) => {
              const localTenant = displayedTenants.find((t) => t.id === tenant.id) || tenant
              return (
                <Card
                  key={tenant.id ? tenant.id : ''}
                  className={`relative transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-white/90 border-0 shadow-md rounded-2xl p-1 ${
                    selectedTenants.includes(tenant.id ? tenant.id : '') ? "ring-2 ring-blue-400 bg-blue-50/80" : ""
                  } ${topTenantIds.includes(tenant.id) ? "ring-2 ring-green-400 bg-green-50/80" : ""}`}
                  style={{ minHeight: 370 }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <CardTitle className="text-xl font-bold flex items-center gap-2 text-gray-900">{`${tenant.first_name} ${tenant.last_name}`}
                            {topTenantIds.includes(tenant.id) && (
                              <span className="inline-block px-2 py-0.5 rounded-full bg-green-200 text-green-900 text-xs font-semibold ml-2 shadow">🥇 Top 3</span>
                            )}
                          </CardTitle>
                          <CardDescription className="text-gray-600 flex items-center gap-2">
                            <span className="inline-flex items-center gap-1"><svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 7a4 4 0 01-8 0"/><circle cx="12" cy="7" r="4"/><path d="M6 21v-2a4 4 0 014-4h0a4 4 0 014 4v2"/></svg>{tenant.profession}</span>
                          </CardDescription>
                          {(tenant.email || tenant.phone) && (
                            <div className="flex gap-2 mt-1 text-xs text-gray-500">
                              {tenant.email && <span className="inline-flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16v16H4z"/><path d="M22 6l-10 7L2 6"/></svg>{tenant.email}</span>}
                              {tenant.phone && <span className="inline-flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92V19a2 2 0 01-2 2A18 18 0 013 5a2 2 0 012-2h2.09a2 2 0 012 1.72c.13.81.36 1.6.7 2.34a2 2 0 01-.45 2.11l-.27.27a16 16 0 006.29 6.29l.27-.27a2 2 0 012.11-.45c.74.34 1.53.57 2.34.7A2 2 0 0122 16.92z"/></svg>{tenant.phone}</span>}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div
                          className={`px-3 py-1 rounded-full text-white text-base font-bold shadow ${getScoreColor(tenant.score || 0)}`}
                        >
                          {tenant.score ?? "-"}%
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor((tenant.score || 0) / 20) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    {/* Key Info */}
                    <div className="grid grid-cols-2 gap-2 text-sm mb-1 break-words">
                      <div>
                        <span className="font-medium text-gray-700">Income:</span>
                        <div className="text-green-700 font-semibold">
                          {typeof tenant.income_interview === 'number' && tenant.income_interview > 0
                            ? tenant.income_interview.toLocaleString() + ' €/mois'
                            : (typeof tenant.income_interview === 'string' && tenant.income_interview.trim() !== ''
                              ? tenant.income_interview
                              : (typeof tenant.income_documents === 'number' && tenant.income_documents > 0
                                ? tenant.income_documents.toLocaleString() + ' €/mois'
                                : (typeof tenant.income_documents === 'string' && tenant.income_documents.trim() !== ''
                                  ? tenant.income_documents
                                  : (typeof tenant.monthly_income === 'number' && tenant.monthly_income > 0
                                    ? tenant.monthly_income.toLocaleString() + ' €/mois'
                                    : (typeof tenant.guarantor_income === 'number' && tenant.guarantor_income > 0
                                      ? tenant.guarantor_income.toLocaleString() + ' €/mois (garant)'
                                      : '-')))))}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Guarantor:</span>
                        <div>{tenant.guarantor_type || "-"}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Employment type:</span>
                        <div>{tenant.employment_type || "-"}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Company:</span>
                        <div>{tenant.company_name || "-"}</div>
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium text-gray-700">Lifestyle:</span>
                        <div>{tenant.lifestyle_description || "-"}</div>
                      </div>
                    </div>
                    {/* Pros and Cons */}
                    {tenant.pros && (
                      <div className="mt-1">
                        <div className="font-semibold text-green-700 mb-1 flex items-center gap-1">✅ Pros
                        </div>
                        <ul className="list-none text-green-900 text-sm bg-green-50/80 rounded-lg p-2 shadow-inner space-y-1">
                          {tenant.pros.split(/\n|\r|\r\n|\- /).filter(Boolean).map((pro, idx) => (
                            <li key={idx} className="flex items-start gap-2"><span className="mt-0.5">•</span> <span>{pro.replace(/^[-•\s]*/, "")}</span></li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {tenant.cons && (
                      <div className="mt-1">
                        <div className="font-semibold text-red-700 mb-1 flex items-center gap-1">❌ Cons
                        </div>
                        <ul className="list-none text-red-900 text-sm bg-red-50/80 rounded-lg p-2 shadow-inner space-y-1">
                          {tenant.cons.split(/\n|\r|\r\n|\- /).filter(Boolean).map((con, idx) => (
                            <li key={idx} className="flex items-start gap-2"><span className="mt-0.5">•</span> <span>{con.replace(/^[-•\s]*/, "")}</span></li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <div className="flex-1 min-w-[120px]">
                        {tenant.id ? (
                          <Link href={`/tenants/${tenant.id}`}>
                            <Button variant="secondary" size="sm" className="w-full shadow hover:scale-[1.03] transition-transform">
                              <Eye className="w-4 h-4 mr-1" />
                              View profile
                            </Button>
                          </Link>
                        ) : (
                          <Button variant="secondary" size="sm" className="w-full" disabled>
                            <Eye className="w-4 h-4 mr-1" />
                            No profile
                          </Button>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 min-w-[120px] shadow hover:scale-[1.03] transition-transform"
                        onClick={() => handleScore(tenant.id ? tenant.id : '')}
                        disabled={scoring === tenant.id}
                      >
                        {scoring === tenant.id ? "Scoring..." : "Score"}
                      </Button>
                      {selectedTenants.includes(tenant.id ? tenant.id : '') ? (
                        <Button size="sm" className="flex-1 min-w-[120px] shadow hover:scale-[1.03] transition-transform" onClick={() => handleSendSchedulingEmail(tenant.id ? tenant.id : '')}>
                          <Calendar className="w-4 h-4 mr-1" />
                          Send appointment link
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 min-w-[120px] shadow hover:scale-[1.03] transition-transform"
                          onClick={() => handleSelectTenant(tenant.id ? tenant.id : '')}
                        >
                          Select
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex-1 min-w-[120px] shadow hover:scale-[1.03] transition-transform"
                        onClick={() => handleRemoveProsConsScore(tenant.id ? tenant.id : '')}
                        disabled={!tenant.id}
                      >
                        Remove pros/cons & score
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
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