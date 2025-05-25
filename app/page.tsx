"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Home, Users, Settings, BarChart3, Loader2 } from "lucide-react"
import { OwnerQuestionnaire } from "@/components/owner-questionnaire"
import TenantsPage from "./tenants/page"
import { useTenantProfiles } from "@/hooks/use-tenant-profiles"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { useProperties } from "@/hooks/use-properties"
import { useRouter } from "next/navigation"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog"

export default function Dashboard() {
  const { tenants } = useTenantProfiles()
  const [activeTab, setActiveTab] = useState("overview")
  const [questionnaireCompleted, setQuestionnaireCompleted] = useState(false)
  const [propertyUrl, setPropertyUrl] = useState("")
  const [propertyLoading, setPropertyLoading] = useState(false)
  const [propertySuccess, setPropertySuccess] = useState<string | null>(null)
  const [propertyError, setPropertyError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { properties, loading: propertiesLoading, error: propertiesError, reload: reloadProperties } = useProperties()
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteAllLoading, setDeleteAllLoading] = useState(false)
  const router = useRouter()

  // Check if questionnaire is completed (from localStorage or state)
  React.useEffect(() => {
    const preferences = localStorage.getItem("ownerPreferences")
    if (preferences) {
      setQuestionnaireCompleted(true)
    }
  }, [])

  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault()
    setPropertyLoading(true)
    setPropertySuccess(null)
    setPropertyError(null)
    console.log("[AddProperty] Début de la soumission avec URL:", propertyUrl)
    try {
      const res = await fetch("/api/extract-property", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: propertyUrl }),
      })
      console.log("[AddProperty] Réponse brute:", res)
      const data = await res.json().catch(err => {
        console.error("[AddProperty] Erreur parsing JSON:", err)
        return { error: "Erreur parsing JSON" }
      })
      console.log("[AddProperty] Data JSON:", data)
      if (res.ok) {
        setPropertySuccess("Property added successfully!")
        setPropertyUrl("")
        setTimeout(() => {
          setDialogOpen(false)
          console.log("[AddProperty] Dialog fermé après succès")
        }, 1200)
      } else {
        setPropertyError(data.error || "Error while adding the property.")
        console.error("[AddProperty] Erreur API:", data.error)
      }
    } catch (err: any) {
      setPropertyError(err.message || "Erreur réseau.")
      console.error("[AddProperty] Exception JS:", err)
    } finally {
      setPropertyLoading(false)
      console.log("[AddProperty] Fin de handleAddProperty, loading:", false)
    }
  }

  // Fonction pour supprimer une propriété
  async function handleDeleteProperty(id: number) {
    if (!window.confirm("Delete this property?")) return;
    setDeleting(true)
    await fetch(`/api/properties/${id}`, { method: "DELETE" })
    setDeleting(false)
    setDetailOpen(false)
    setSelectedProperty(null)
    reloadProperties()
  }

  // Fonction pour supprimer toutes les propriétés
  async function handleDeleteAll() {
    if (!window.confirm("Delete ALL properties?")) return;
    setDeleteAllLoading(true)
    await fetch(`/api/properties`, { method: "DELETE" })
    setDeleteAllLoading(false)
    reloadProperties()
  }

  const fieldLabels: Record<string, string> = {
    price: "Price (€)",
    surface: "Surface (sqm)",
    city: "City",
    city_label: "City",
    category_name: "Listing type",
    ad_type: "Listing type",
    status: "Status",
    first_publication_date: "Publication date",
    zipcode: "Postal code",
    url: "Listing link",
    lat: "Latitude",
    lng: "Longitude",
    images: "Images",
    attributes: "Attributes",
    owner: "Owner",
    options: "Options",
    attributes_listing: "Listing attributes",
    similar_data: "Similar listings",
    counters: "Counters",
    country_id: "Country",
    region_id: "Region (id)",
    region_name: "Region",
    department_id: "Department (id)",
    brand: "Brand",
    body: "Description",
    provider: "Provider",
    is_boosted: "Boosted",
    has_phone: "Phone displayed",
    nb_images: "Number of images",
    thumb_image: "Thumbnail",
    search_url: "Search URL",
    transport: "Transport",
    point_of_interests: "Points of interest",
    expiration_date: "Expiration",
    index_date: "Indexing",
    list_id: "Listing ID",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Apartment Owner Dashboard</h1>
            <p className="text-gray-600">Manage your tenant selection process and preferences</p>
          </div>

          {/* Dashboard Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-fit">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="questionnaire" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Preferences
                {!questionnaireCompleted && (
                  <Badge variant="destructive" className="ml-1 text-xs">
                    !
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="tenants" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Tenants
                {questionnaireCompleted && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {tenants.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="properties" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Properties
                {!propertiesLoading && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {properties.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">+2 from last week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Matched Profiles</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">5</div>
                    <p className="text-xs text-muted-foreground">Based on your preferences</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Interviews Scheduled</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground">This week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Properties</CardTitle>
                    <Home className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1</div>
                    <p className="text-xs text-muted-foreground">Available for rent</p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Get started with your tenant selection process</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!questionnaireCompleted ? (
                    <div className="flex items-center justify-between p-4 border border-orange-200 bg-orange-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-orange-900">Complete Your Preferences</h3>
                        <p className="text-sm text-orange-700">
                          Set up your tenant preferences to get matched with ideal candidates
                        </p>
                      </div>
                      <Button
                        onClick={() => setActiveTab("questionnaire")}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        Start Questionnaire
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 border border-green-200 bg-green-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-green-900">Preferences Completed ✓</h3>
                        <p className="text-sm text-green-700">Review your matched tenant profiles</p>
                      </div>
                      <Button onClick={() => setActiveTab("tenants")} className="bg-green-600 hover:bg-green-700">
                        View Tenants
                      </Button>
                    </div>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">Recent Activity</h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• New application from Marie Dubois</li>
                        <li>• Interview scheduled with Thomas Martin</li>
                        <li>• Document verification completed</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">Next Steps</h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Review 2 pending applications</li>
                        <li>• Schedule interview with Sophie Chen</li>
                        <li>• Update property listing</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Questionnaire Tab */}
            <TabsContent value="questionnaire">
              <OwnerQuestionnaire onComplete={() => setQuestionnaireCompleted(true)} />
            </TabsContent>

            {/* Tenants Tab */}
            <TabsContent value="tenants">
              {questionnaireCompleted ? (
                <TenantsPage />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Complete Your Preferences First</CardTitle>
                    <CardDescription>
                      To view matched tenant profiles, please complete the owner questionnaire first.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => setActiveTab("questionnaire")}>Go to Questionnaire</Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Properties Tab */}
            <TabsContent value="properties">
              <Card>
                <CardHeader>
                  <CardTitle>Your Properties</CardTitle>
                  <CardDescription>Manage your rental properties</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Property Management</h3>
                    <p className="text-gray-600 mb-4">
                      This section will contain your property listings and management tools.
                    </p>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline">Add Property</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Ajouter une propriété</DialogTitle>
                          <DialogDescription>
                            Merci de renseigner l'URL de l'annonce leboncoin.fr
                          </DialogDescription>
                        </DialogHeader>
                        <form className="space-y-4" onSubmit={async (e) => {
                          await handleAddProperty(e)
                          reloadProperties()
                        }}>
                          <input
                            type="url"
                            placeholder="https://www.leboncoin.fr/annonce/..."
                            className="w-full border rounded px-3 py-2"
                            required
                            value={propertyUrl}
                            onChange={e => setPropertyUrl(e.target.value)}
                            disabled={propertyLoading}
                          />
                          {propertyError && (
                            <div className="text-red-600 text-sm">{propertyError}</div>
                          )}
                          {propertySuccess && (
                            <div className="text-green-600 text-sm">{propertySuccess}</div>
                          )}
                          {propertyLoading && (
                            <div className="flex items-center justify-center py-4">
                              <Loader2 className="animate-spin w-6 h-6 text-primary" />
                              <span className="ml-2">Extraction et ajout en cours...</span>
                            </div>
                          )}
                          <DialogFooter>
                            <Button type="submit" disabled={propertyLoading || !propertyUrl}>
                              {propertyLoading ? "Ajout..." : "Valider"}
                            </Button>
                            <DialogClose asChild>
                              <Button type="button" variant="outline" disabled={propertyLoading}>Annuler</Button>
                            </DialogClose>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                  {/* Liste des propriétés */}
                  <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {propertiesLoading && <div>Chargement des propriétés...</div>}
                    {propertiesError && <div className="text-red-600">Erreur : {propertiesError}</div>}
                    {!propertiesLoading && properties.length === 0 && <div>Aucune propriété enregistrée.</div>}
                    {properties.map((property) => (
                      <Card key={property.id} className="text-left">
                        <CardHeader>
                          <CardTitle>{property.subject || property.title || "Annonce"}</CardTitle>
                          <CardDescription>{property.city_label || property.city || property.location || property.postal_code || property.url}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {property.images && property.images.length > 0 && (
                            <img src={property.images[0]} alt="photo principale" className="mb-2 rounded w-full h-40 object-cover" />
                          )}
                          <div className="mb-2">
                            <span className="font-semibold">Prix :</span> {property.price?.[0] || property.price_cents / 100 || property.price || "-"} €
                          </div>
                          <div className="mb-2">
                            <span className="font-semibold">Surface :</span> {property.attributes?.square || property.surface || "-"} m²
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" variant="secondary" onClick={() => { setSelectedProperty(property); setDetailOpen(true); }}>
                              View Details
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="destructive" disabled={deleting}>
                                  {deleting ? "Suppression..." : "Supprimer"}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Êtes-vous sûr de vouloir supprimer cette propriété ? Cette action est irréversible.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteProperty(property.id)} disabled={deleting}>
                                    Oui, supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {/* Dialog de détail propriété */}
                  <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
                    <DialogContent className="max-w-5xl w-[95vw] max-h-[80vh] overflow-y-auto">
                      <div className="max-w-2xl w-full mx-auto">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold">Détail de la propriété</DialogTitle>
                        </DialogHeader>
                        {selectedProperty && (
                          <div>
                            {selectedProperty.images && selectedProperty.images.length > 0 && (
                              <img src={selectedProperty.images[0]} alt="photo principale" className="rounded-lg w-full h-72 object-contain mb-4 border bg-gray-100" />
                            )}
                            <div className="overflow-x-auto w-full">
                              <table className="min-w-full text-sm border mb-4">
                                <tbody>
                                  {Object.entries(selectedProperty).map(([key, value], idx) => {
                                    if (["id","created_at","updated_at"].includes(key)) return null;
                                    // Emoji et style contextuel
                                    let emoji = "";
                                    let valueClass = "";
                                    switch(key) {
                                      case "price": emoji = "💶"; valueClass = "text-green-700 font-bold"; break;
                                      case "surface": case "attributes": emoji = "📏"; valueClass = "text-blue-700 font-semibold"; break;
                                      case "city": case "city_label": emoji = "🏙️"; valueClass = "text-purple-700 font-semibold"; break;
                                      case "category_name": case "ad_type": emoji = "🏷️"; valueClass = "text-orange-700 font-semibold"; break;
                                      case "status": emoji = "📢"; valueClass = "text-pink-700 font-semibold"; break;
                                      case "first_publication_date": emoji = "📅"; valueClass = "text-gray-700"; break;
                                      case "images": emoji = "🖼️"; break;
                                      case "lat": case "lng": emoji = "📍"; break;
                                      case "zipcode": emoji = "🏤"; break;
                                      case "url": emoji = "🔗"; break;
                                      default: emoji = "";
                                    }
                                    const label = fieldLabels[key] || key.replace(/_/g, " ");
                                    return (
                                      <tr key={key} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                        <td className="font-semibold px-2 py-1 w-1/3 capitalize flex items-center gap-1">{emoji} {label}</td>
                                        <td className={"px-2 py-1 " + valueClass}>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</td>
                                      </tr>
                                    )
                                  })}
                                </tbody>
                              </table>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button type="button" variant="outline">Fermer</Button>
                              </DialogClose>
                            </DialogFooter>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
