"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient, type TenantProfile } from "@/lib/supabase"
import { Loader2, User, Briefcase, DollarSign, Home, FileText } from "lucide-react"

interface TenantFormProps {
  onSuccess?: () => void
}

export function TenantForm({ onSuccess }: TenantFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState<Partial<TenantProfile>>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    profession: "",
    employment_type: "",
    company_name: "",
    monthly_income: 0,
    guarantor_type: "",
    guarantor_income: 0,
    smoking_status: "Non-smoker",
    pets: [],
    lifestyle_description: "",
    guest_frequency: "Occasionally",
    noise_tolerance: "Moderate",
    reason_for_moving: "",
    languages: [],
    communication_preference: "email",
  })

  const supabase = createClient()
  const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (!isSupabaseConfigured) {
        console.log("Supabase not configured, simulating form submission")
        setSuccess(true)
        setTimeout(() => {
          onSuccess?.()
        }, 1500)
        return
      }

      // Calculate a basic score based on income and employment type
      let score = 50
      if (formData.monthly_income && formData.monthly_income > 3000) score += 20
      if (formData.employment_type === "CDI") score += 15
      if (formData.guarantor_type && formData.guarantor_type !== "None") score += 10
      if (formData.smoking_status === "Non-smoker") score += 5

      const tenantData = {
        ...formData,
        score,
        application_status: "pending",
        application_date: new Date().toISOString(),
        previous_rental_document: true,
        previous_rental_paying: true,
      }

      const { data, error } = await supabase.from("tenant_profiles").insert([tenantData]).select()

      if (error) {
        console.error("Error creating tenant profile:", error)
        setError(`Failed to submit application: ${error.message}`)
        return
      }

      console.log("Tenant profile created successfully:", data)
      setSuccess(true)
      setTimeout(() => {
        onSuccess?.()
      }, 1500)
    } catch (err) {
      console.error("Error:", err)
      setError("Failed to submit application. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handlePetChange = (pet: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      pets: checked ? [...(prev.pets || []), pet] : (prev.pets || []).filter((p) => p !== pet),
    }))
  }

  const handleLanguageChange = (language: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      languages: checked ? [...(prev.languages || []), language] : (prev.languages || []).filter((l) => l !== language),
    }))
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Tenant Application Form</CardTitle>
          <p className="text-gray-600">Please fill out all sections to complete your rental application</p>
          {!isSupabaseConfigured && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertDescription className="text-yellow-800">
                ℹ️ <strong>Demo Mode:</strong> This form is in demo mode. Data will not be saved to the database.
              </AlertDescription>
            </Alert>
          )}
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                ✅ Application submitted successfully! We'll review your profile and get back to you soon.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Personal Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, first_name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, last_name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData((prev) => ({ ...prev, date_of_birth: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Professional Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="profession">Profession *</Label>
                  <Input
                    id="profession"
                    value={formData.profession}
                    onChange={(e) => setFormData((prev) => ({ ...prev, profession: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="employment_type">Employment Type *</Label>
                  <Select
                    value={formData.employment_type}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, employment_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CDI">CDI (Permanent Contract)</SelectItem>
                      <SelectItem value="CDD">CDD (Fixed-term Contract)</SelectItem>
                      <SelectItem value="Freelance">Freelance</SelectItem>
                      <SelectItem value="Student">Student</SelectItem>
                      <SelectItem value="Intern">Intern</SelectItem>
                      <SelectItem value="Unemployed">Unemployed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="company_name">Company/School</Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, company_name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="monthly_income">Monthly Income (€) *</Label>
                  <Input
                    id="monthly_income"
                    type="number"
                    value={formData.monthly_income}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, monthly_income: Number.parseFloat(e.target.value) }))
                    }
                    required
                  />
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Financial Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="guarantor_type">Guarantor Type *</Label>
                  <Select
                    value={formData.guarantor_type}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, guarantor_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select guarantor type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Parents">Parents</SelectItem>
                      <SelectItem value="Bank">Bank Guarantee</SelectItem>
                      <SelectItem value="Visale">Visale</SelectItem>
                      <SelectItem value="Employment">Employment Guarantee</SelectItem>
                      <SelectItem value="None">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.guarantor_type === "Parents" && (
                  <div>
                    <Label htmlFor="guarantor_income">Guarantor Monthly Income (€)</Label>
                    <Input
                      id="guarantor_income"
                      type="number"
                      value={formData.guarantor_income}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, guarantor_income: Number.parseFloat(e.target.value) }))
                      }
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Lifestyle Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Home className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Lifestyle Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="smoking_status">Smoking Status</Label>
                  <Select
                    value={formData.smoking_status}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, smoking_status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Non-smoker">Non-smoker</SelectItem>
                      <SelectItem value="Occasional">Occasional</SelectItem>
                      <SelectItem value="Regular">Regular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="guest_frequency">Guest Frequency</Label>
                  <Select
                    value={formData.guest_frequency}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, guest_frequency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Rarely">Rarely</SelectItem>
                      <SelectItem value="Occasionally">Occasionally</SelectItem>
                      <SelectItem value="Frequently">Frequently</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="noise_tolerance">Noise Tolerance</Label>
                  <Select
                    value={formData.noise_tolerance}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, noise_tolerance: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Quiet">Quiet</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Pets (select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {["Cat", "Small dog", "Large dog", "Bird", "Fish", "Other"].map((pet) => (
                    <div key={pet} className="flex items-center space-x-2">
                      <Checkbox
                        id={pet}
                        checked={formData.pets?.includes(pet)}
                        onCheckedChange={(checked) => handlePetChange(pet, checked as boolean)}
                      />
                      <Label htmlFor={pet} className="text-sm">
                        {pet}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Languages (select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {["French", "English", "Spanish", "German", "Italian", "Chinese", "Arabic", "Other"].map(
                    (language) => (
                      <div key={language} className="flex items-center space-x-2">
                        <Checkbox
                          id={language}
                          checked={formData.languages?.includes(language)}
                          onCheckedChange={(checked) => handleLanguageChange(language, checked as boolean)}
                        />
                        <Label htmlFor={language} className="text-sm">
                          {language}
                        </Label>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="lifestyle_description">Lifestyle Description</Label>
                <Textarea
                  id="lifestyle_description"
                  placeholder="Tell us about your lifestyle, hobbies, work schedule, etc."
                  value={formData.lifestyle_description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, lifestyle_description: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Additional Information</h3>
              </div>
              <div>
                <Label htmlFor="reason_for_moving">Reason for Moving</Label>
                <Textarea
                  id="reason_for_moving"
                  placeholder="Why are you looking for a new place?"
                  value={formData.reason_for_moving}
                  onChange={(e) => setFormData((prev) => ({ ...prev, reason_for_moving: e.target.value }))}
                  rows={2}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={loading} className="px-8 py-2">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
