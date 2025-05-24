"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Home, Users, Settings, BarChart3 } from "lucide-react"
import { OwnerQuestionnaire } from "@/components/owner-questionnaire"
import { TenantProfiles } from "@/components/tenant-profiles"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [questionnaireCompleted, setQuestionnaireCompleted] = useState(false)

  // Check if questionnaire is completed (from localStorage or state)
  React.useEffect(() => {
    const preferences = localStorage.getItem("ownerPreferences")
    if (preferences) {
      setQuestionnaireCompleted(true)
    }
  }, [])

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
                    5
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="properties" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Properties
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
                <TenantProfiles />
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
                    <Button variant="outline">Add Property</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
