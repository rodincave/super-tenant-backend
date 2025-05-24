"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Mail, Calendar, Eye, Filter } from "lucide-react"
import Link from "next/link"

// Mock tenant data
const tenants = [
  {
    id: 1,
    name: "Marie Dubois",
    age: 24,
    profession: "Software Engineer",
    company: "Tech Corp",
    score: 92,
    avatar: "/placeholder.svg?height=40&width=40&query=young+professional+woman",
    income: "4,200€/month",
    guarantor: "Yes (Parents)",
    stayDuration: "2+ years",
    lifestyle: "Quiet, Non-smoker",
    highlights: ["Excellent references", "Stable income", "Long-term commitment"],
    matchReasons: ["Financial stability", "Professional background", "Quiet lifestyle"],
  },
  {
    id: 2,
    name: "Thomas Martin",
    age: 28,
    profession: "Marketing Manager",
    company: "Creative Agency",
    score: 88,
    avatar: "/placeholder.svg?height=40&width=40&query=young+professional+man",
    income: "3,800€/month",
    guarantor: "Yes (Bank guarantee)",
    stayDuration: "1-2 years",
    lifestyle: "Social, Pet owner",
    highlights: ["Great communication", "Stable employment", "Previous landlord reference"],
    matchReasons: ["Professional sector match", "Good income ratio", "Cultural fit"],
  },
  {
    id: 3,
    name: "Sophie Chen",
    age: 22,
    profession: "Master's Student",
    company: "Business School",
    score: 85,
    avatar: "/placeholder.svg?height=40&width=40&query=student+woman+asian",
    income: "2,100€/month",
    guarantor: "Yes (Parents)",
    stayDuration: "2 years",
    lifestyle: "Studious, Clean",
    highlights: ["Parental guarantee", "Excellent grades", "Responsible tenant"],
    matchReasons: ["Student preference", "Long-term stay", "Financial backing"],
  },
  {
    id: 4,
    name: "Lucas Petit",
    age: 26,
    profession: "Graphic Designer",
    company: "Freelance",
    score: 78,
    avatar: "/placeholder.svg?height=40&width=40&query=creative+man+designer",
    income: "2,800€/month",
    guarantor: "Bank guarantee",
    stayDuration: "1 year",
    lifestyle: "Creative, Flexible",
    highlights: ["Creative professional", "Portfolio of work", "Flexible schedule"],
    matchReasons: ["Creative field", "Artistic appreciation", "Flexible arrangement"],
  },
  {
    id: 5,
    name: "Emma Rodriguez",
    age: 30,
    profession: "Civil Servant",
    company: "Ministry of Education",
    score: 94,
    avatar: "/placeholder.svg?height=40&width=40&query=professional+woman+government",
    income: "3,600€/month",
    guarantor: "Employment guarantee",
    stayDuration: "3+ years",
    lifestyle: "Stable, Quiet",
    highlights: ["Government employment", "Excellent stability", "Long-term commitment"],
    matchReasons: ["Job security", "Stable income", "Long-term reliability"],
  },
]

export function TenantProfiles() {
  const [selectedTenants, setSelectedTenants] = useState<number[]>([])
  const [emailSent, setEmailSent] = useState<number[]>([])

  const handleSelectTenant = (tenantId: number) => {
    setSelectedTenants((prev) => (prev.includes(tenantId) ? prev.filter((id) => id !== tenantId) : [...prev, tenantId]))
  }

  const handleSendSchedulingEmail = (tenantId: number) => {
    // Simulate sending email
    setEmailSent((prev) => [...prev, tenantId])
    // Remove from selected after sending
    setSelectedTenants((prev) => prev.filter((id) => id !== tenantId))
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-500"
    if (score >= 80) return "bg-blue-500"
    if (score >= 70) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Matched Tenant Profiles</CardTitle>
              <CardDescription>Review and select potential tenants based on your preferences</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              {selectedTenants.length > 0 && <Badge variant="secondary">{selectedTenants.length} selected</Badge>}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tenant Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tenants.map((tenant) => (
          <Card
            key={tenant.id}
            className={`relative transition-all duration-200 hover:shadow-lg ${
              selectedTenants.includes(tenant.id) ? "ring-2 ring-blue-500 bg-blue-50" : ""
            } ${emailSent.includes(tenant.id) ? "ring-2 ring-green-500 bg-green-50" : ""}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={tenant.avatar || "/placeholder.svg"} alt={tenant.name} />
                    <AvatarFallback>
                      {tenant.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{tenant.name}</CardTitle>
                    <CardDescription>
                      {tenant.age} years • {tenant.profession}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div
                    className={`px-2 py-1 rounded-full text-white text-sm font-medium ${getScoreColor(tenant.score)}`}
                  >
                    {tenant.score}%
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < Math.floor(tenant.score / 20) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
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
                  <div className="text-green-600 font-medium">{tenant.income}</div>
                </div>
                <div>
                  <span className="font-medium">Stay:</span>
                  <div>{tenant.stayDuration}</div>
                </div>
                <div>
                  <span className="font-medium">Guarantor:</span>
                  <div>{tenant.guarantor}</div>
                </div>
                <div>
                  <span className="font-medium">Lifestyle:</span>
                  <div>{tenant.lifestyle}</div>
                </div>
              </div>

              {/* Match Reasons */}
              <div>
                <span className="text-sm font-medium text-gray-700">Why this matches:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {tenant.matchReasons.map((reason, index) => (
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
                  {tenant.highlights.slice(0, 2).map((highlight, index) => (
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

                {emailSent.includes(tenant.id) ? (
                  <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700" disabled>
                    <Mail className="w-4 h-4 mr-1" />
                    Email Sent
                  </Button>
                ) : selectedTenants.includes(tenant.id) ? (
                  <Button size="sm" className="flex-1" onClick={() => handleSendSchedulingEmail(tenant.id)}>
                    <Calendar className="w-4 h-4 mr-1" />
                    Send Schedule
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => handleSelectTenant(tenant.id)}>
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
  )
}
