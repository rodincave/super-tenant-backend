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

// Mock detailed tenant data
const getTenantDetails = (id: string) => {
  const tenants = {
    "1": {
      id: 1,
      name: "Marie Dubois",
      age: 24,
      profession: "Software Engineer",
      company: "Tech Corp",
      score: 92,
      avatar: "/placeholder.svg?height=80&width=80&query=young+professional+woman",
      email: "marie.dubois@email.com",
      phone: "+33 6 12 34 56 78",
      currentAddress: "15 Rue de la Paix, 75001 Paris",

      // Financial Information
      monthlyIncome: 4200,
      employmentType: "CDI (Permanent Contract)",
      employmentDuration: "2 years",
      guarantor: "Parents (Combined income: 8,500€/month)",
      bankAccount: "Crédit Agricole",
      creditScore: "Excellent",

      // Personal Information
      nationality: "French",
      languages: ["French (Native)", "English (Fluent)", "Spanish (Intermediate)"],
      hobbies: ["Reading", "Yoga", "Cooking", "Photography"],
      pets: "None",
      smoking: "Non-smoker",

      // Rental History
      previousRentals: [
        {
          address: "8 Avenue Montaigne, 75008 Paris",
          duration: "2 years (2022-2024)",
          rent: "1,800€/month",
          landlordReference: "Excellent tenant, always paid on time, left apartment in perfect condition",
          reasonForLeaving: "Job relocation",
        },
      ],

      // Interview Responses
      interview: {
        whyThisApartment:
          "I love the neighborhood and the natural light in the apartment. The proximity to my office and public transport is perfect for my daily routine.",
        idealStayDuration:
          "I'm looking for a long-term rental, ideally 2-3 years. I value stability and would like to make this my home.",
        lifestyle:
          "I'm a quiet person who enjoys a peaceful home environment. I work regular hours and spend evenings reading or cooking. I occasionally have friends over for dinner but nothing loud.",
        workSchedule: "Monday to Friday, 9 AM to 6 PM. I work from home 2 days a week. Very stable schedule.",
        cleaningHabits:
          "I'm very organized and clean. I do a deep clean every weekend and maintain tidiness daily. I believe in taking care of the space as if it were my own.",
        neighborRelations:
          "I'm respectful and friendly with neighbors. I believe in maintaining good relationships while respecting everyone's privacy.",
        emergencyContact:
          "My parents live in Lyon and can be reached anytime. I also have a close friend in Paris who has spare keys.",
        futureGoals:
          "I plan to stay in Paris for my career development. I'm saving to eventually buy my own place, but that's still a few years away.",
      },

      // Documents Status
      documents: {
        idCard: "✓ Verified",
        employmentContract: "✓ Verified",
        paySlips: "✓ Last 3 months provided",
        bankStatements: "✓ Last 3 months provided",
        taxReturn: "✓ 2023 provided",
        guarantorDocuments: "✓ Complete parental guarantee",
        insurance: "✓ Current renter's insurance",
        references: "✓ Previous landlord contacted",
      },
    },
  }

  return tenants[id as keyof typeof tenants] || null
}

export default function TenantDetailPage() {
  const params = useParams()
  const tenant = getTenantDetails(params.id as string)

  if (!tenant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p>Tenant not found</p>
            <Link href="/tenants">
              <Button className="mt-4">Back to Tenants</Button>
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
                    <AvatarImage src={tenant.avatar || "/placeholder.svg"} alt={tenant.name} />
                    <AvatarFallback className="text-lg">
                      {tenant.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">{tenant.name}</CardTitle>
                    <CardDescription className="text-lg">
                      {tenant.age} years • {tenant.profession}
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
                    className={`px-4 py-2 rounded-full text-white text-xl font-bold ${getScoreColor(tenant.score)} mb-2`}
                  >
                    {tenant.score}%
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(tenant.score / 20) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
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
                    <span className="text-sm font-medium text-gray-600">Monthly Income</span>
                    <div className="text-lg font-semibold text-green-600">{tenant.monthlyIncome.toLocaleString()}€</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Employment</span>
                    <div className="text-sm">{tenant.employmentType}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Duration</span>
                    <div className="text-sm">{tenant.employmentDuration}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Credit Score</span>
                    <div className="text-sm">{tenant.creditScore}</div>
                  </div>
                </div>
                <Separator />
                <div>
                  <span className="text-sm font-medium text-gray-600">Guarantor</span>
                  <div className="text-sm mt-1">{tenant.guarantor}</div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Bank</span>
                  <div className="text-sm mt-1">{tenant.bankAccount}</div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Nationality</span>
                    <div className="text-sm">{tenant.nationality}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Smoking</span>
                    <div className="text-sm">{tenant.smoking}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Pets</span>
                    <div className="text-sm">{tenant.pets}</div>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Languages</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {tenant.languages.map((lang, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Hobbies</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {tenant.hobbies.map((hobby, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {hobby}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Current Address</span>
                  <div className="text-sm mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {tenant.currentAddress}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rental History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Rental History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tenant.previousRentals.map((rental, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{rental.address}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>Duration: {rental.duration}</div>
                      <div>Rent: {rental.rent}</div>
                      <div>Reason for leaving: {rental.reasonForLeaving}</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <span className="text-sm font-medium text-green-800">Landlord Reference:</span>
                      <p className="text-sm text-green-700 mt-1">"{rental.landlordReference}"</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Documents Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Documents Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(tenant.documents).map(([doc, status]) => (
                    <div key={doc} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{doc.replace(/([A-Z])/g, " $1").trim()}</span>
                      <Badge variant={status.includes("✓") ? "default" : "destructive"} className="text-xs">
                        {status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interview Responses */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Interview Responses
              </CardTitle>
              <CardDescription>Detailed answers from the tenant interview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(tenant.interview).map(([question, answer]) => (
                <div key={question}>
                  <h4 className="font-medium text-gray-900 mb-2 capitalize">
                    {question.replace(/([A-Z])/g, " $1").trim()}:
                  </h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm leading-relaxed">{answer}</p>
                </div>
              ))}
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
