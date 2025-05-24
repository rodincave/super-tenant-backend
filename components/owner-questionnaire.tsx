"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ChevronRight,
  ChevronLeft,
  Heart,
  Users,
  Shield,
  FileText,
  Home,
  AlertTriangle,
  Loader2,
  Check,
} from "lucide-react"
import { createClient, type OwnerPreferences } from "@/lib/supabase"

interface OwnerQuestionnaireProps {
  onComplete: () => void
}

export function OwnerQuestionnaire({ onComplete }: OwnerQuestionnaireProps) {
  const [currentSection, setCurrentSection] = useState(1)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [supabaseConnected, setSupabaseConnected] = useState<boolean | null>(null)
  const [formData, setFormData] = useState({
    priorities: [],
    tenantCategories: [],
    studentField: "",
    studentFieldPreference: "",
    professionalSector: "",
    professionalSectorPreference: "",
    minFinancialRequirement: "",
    financialRequirements: [],
    leaseType: "",
    minStay: "",
    acceptances: [],
    lifestyleMatters: [],
    dealbreakers: [],
  })

  const supabase = createClient()

  const sections = [
    { id: 1, title: "What Matters Most", icon: Heart, color: "bg-pink-500" },
    { id: 2, title: "Tenant Profile", icon: Users, color: "bg-blue-500" },
    { id: 3, title: "Financial Guarantees", icon: Shield, color: "bg-green-500" },
    { id: 4, title: "Lease & Legal", icon: FileText, color: "bg-purple-500" },
    { id: 5, title: "Lifestyle", icon: Home, color: "bg-orange-500" },
    { id: 6, title: "Red Flags", icon: AlertTriangle, color: "bg-red-500" },
  ]

  // Test Supabase connection and load existing preferences
  useEffect(() => {
    console.log("🚀 Component mounted, starting to load preferences...")
    loadExistingPreferences()
  }, [])

  const testSupabaseConnection = async () => {
    console.log("🔍 Testing Supabase connection...")
    try {
      // Simple connection test
      console.log("📡 Attempting to query owner_preferences table...")
      const { data, error } = await supabase.from("owner_preferences").select("count", { count: "exact", head: true })

      if (error) {
        console.log("❌ Supabase connection test failed:")
        console.log("Error code:", error.code)
        console.log("Error message:", error.message)
        console.log("Error details:", error.details)
        console.log("Error hint:", error.hint)
        return false
      }

      console.log("✅ Supabase connection successful!")
      console.log("Query result:", data)
      return true
    } catch (err) {
      console.log("💥 Supabase connection error (caught exception):")
      console.log("Error type:", typeof err)
      console.log("Error:", err)
      if (err instanceof Error) {
        console.log("Error name:", err.name)
        console.log("Error message:", err.message)
        console.log("Error stack:", err.stack)
      }
      return false
    }
  }

  const loadExistingPreferences = async () => {
    console.log("📥 Starting to load existing preferences...")
    setLoading(true)
    try {
      // Test connection first
      console.log("🧪 Testing connection before loading data...")
      const connected = await testSupabaseConnection()
      console.log("🔗 Connection test result:", connected)
      setSupabaseConnected(connected)

      if (!connected) {
        console.log("📱 Supabase not available, loading from localStorage only")
        const stored = localStorage.getItem("ownerPreferences")
        if (stored) {
          const data = JSON.parse(stored)
          setFormData(data)
          console.log("✅ Loaded preferences from localStorage:", data)
        } else {
          console.log("📭 No data found in localStorage")
        }
        setLoading(false)
        return
      }

      // Try to load from Supabase
      console.log("🗃️ Attempting to load data from Supabase...")
      const { data, error } = await supabase
        .from("owner_preferences")
        .select("*")
        .eq("owner_id", "demo-owner-1")
        .single()

      console.log("📊 Supabase query completed:")
      console.log("Data:", data)
      console.log("Error:", error)

      if (error && error.code !== "PGRST116") {
        console.error("❌ Error loading preferences from Supabase:")
        console.log("Error code:", error.code)
        console.log("Error message:", error.message)
        // Fall back to localStorage
        const stored = localStorage.getItem("ownerPreferences")
        if (stored) {
          const data = JSON.parse(stored)
          setFormData(data)
          console.log("✅ Loaded preferences from localStorage fallback:", data)
        }
        return
      }

      if (data) {
        console.log("🎯 Converting database data to form format...")
        // Convert database format to form format
        const convertedData = {
          priorities: data.priorities || [],
          tenantCategories: data.tenant_category ? data.tenant_category.split(", ").filter(Boolean) : [],
          studentField: data.student_field || "",
          studentFieldPreference: data.student_field_preference || "",
          professionalSector: data.professional_sector || "",
          professionalSectorPreference: data.professional_sector_preference || "",
          minFinancialRequirement: data.min_financial_requirement || "",
          financialRequirements: data.financial_requirements || [],
          leaseType: data.lease_type || "",
          minStay: data.min_stay || "",
          acceptances: data.acceptances || [],
          lifestyleMatters: data.lifestyle_matters || [],
          dealbreakers: data.dealbreakers || [],
        }
        setFormData(convertedData)
        console.log("✅ Loaded existing preferences from Supabase:", convertedData)
      } else {
        console.log("📭 No existing preferences found in Supabase")
        // Check localStorage as fallback
        const stored = localStorage.getItem("ownerPreferences")
        if (stored) {
          const data = JSON.parse(stored)
          setFormData(data)
          console.log("✅ Loaded preferences from localStorage:", data)
        }
      }
    } catch (err) {
      console.error("💥 Error in loadExistingPreferences:")
      console.log("Error:", err)
      setSupabaseConnected(false)
      // Fall back to localStorage
      const stored = localStorage.getItem("ownerPreferences")
      if (stored) {
        const data = JSON.parse(stored)
        setFormData(data)
        console.log("✅ Loaded preferences from localStorage (error fallback):", data)
      }
    } finally {
      setLoading(false)
      console.log("🏁 Finished loading preferences")
    }
  }

  const handleSubmit = async () => {
    console.log("💾 Starting to save preferences...")
    setSaving(true)
    setError(null)

    try {
      // Always save to localStorage first
      console.log("📱 Saving to localStorage...")
      localStorage.setItem("ownerPreferences", JSON.stringify(formData))
      console.log("✅ Saved to localStorage successfully")

      // Try to save to Supabase if connected
      if (supabaseConnected) {
        console.log("🗃️ Supabase is connected, attempting to save to database...")
        try {
          const preferencesData: Omit<OwnerPreferences, "id" | "created_at" | "updated_at"> = {
            owner_id: "demo-owner-1",
            priorities: formData.priorities,
            tenant_category: formData.tenantCategories.join(", "),
            student_field: formData.studentField,
            student_field_preference: formData.studentFieldPreference,
            professional_sector: formData.professionalSector,
            professional_sector_preference: formData.professionalSectorPreference,
            min_financial_requirement: formData.minFinancialRequirement,
            financial_requirements: formData.financialRequirements,
            lease_type: formData.leaseType,
            min_stay: formData.minStay,
            acceptances: formData.acceptances,
            lifestyle_matters: formData.lifestyleMatters,
            relationship_management: "",
            dealbreakers: formData.dealbreakers,
          }

          console.log("📤 Sending data to Supabase:", preferencesData)

          const { data, error } = await supabase
            .from("owner_preferences")
            .upsert([preferencesData], {
              onConflict: "owner_id",
              ignoreDuplicates: false,
            })
            .select()

          console.log("📊 Supabase save result:")
          console.log("Data:", data)
          console.log("Error:", error)

          if (error) {
            console.error("❌ Error saving to Supabase:")
            console.log("Error code:", error.code)
            console.log("Error message:", error.message)
            console.log("Error details:", error.details)
            console.log("📱 Data saved to localStorage only")
          } else {
            console.log("✅ Preferences saved successfully to Supabase!")
          }
        } catch (supabaseError) {
          console.error("💥 Supabase save error (caught exception):")
          console.log("Error:", supabaseError)
          console.log("📱 Data saved to localStorage only")
        }
      } else {
        console.log("🔌 Supabase not connected, data saved to localStorage only")
      }

      setSuccess(true)
      console.log("🎉 Save process completed successfully!")
      setTimeout(() => {
        console.log("🔄 Redirecting to tenant profiles...")
        onComplete()
      }, 1500)
    } catch (err) {
      console.error("💥 Error in handleSubmit:")
      console.log("Error:", err)
      setError("Failed to save preferences. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked
        ? [...(prev[field] as string[]), value]
        : (prev[field] as string[]).filter((item) => item !== value),
    }))
  }

  const handleTenantCategoryChange = (category: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      tenantCategories: checked
        ? [...prev.tenantCategories, category]
        : prev.tenantCategories.filter((item) => item !== category),
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-lg text-gray-600">Loading your preferences...</p>
        </div>
      </div>
    )
  }

  const currentSectionData = sections[currentSection - 1]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className={`w-16 h-16 ${currentSectionData.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
            >
              <currentSectionData.icon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Owner Preferences</h1>
            <p className="text-gray-600">Help us find your ideal tenant by sharing your preferences</p>
          </div>

          {/* Connection Status */}
          {supabaseConnected === false && (
            <Alert className="border-yellow-200 bg-yellow-50 mb-6">
              <AlertDescription className="text-yellow-800">
                ℹ️ <strong>Demo Mode:</strong> Database connection unavailable. Data will be saved to browser storage
                only.
              </AlertDescription>
            </Alert>
          )}

          {supabaseConnected === true && (
            <Alert className="border-green-200 bg-green-50 mb-6">
              <AlertDescription className="text-green-800">
                ✅ <strong>Connected:</strong> Data will be saved to the database.
              </AlertDescription>
            </Alert>
          )}

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              {sections.map((section, index) => {
                const Icon = section.icon
                const isCompleted = currentSection > section.id
                const isCurrent = currentSection === section.id
                return (
                  <div key={section.id} className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCompleted
                          ? `${section.color} text-white shadow-lg`
                          : isCurrent
                            ? `${section.color} text-white shadow-lg scale-110`
                            : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                    </div>
                    <span
                      className={`text-xs mt-2 text-center font-medium ${isCurrent ? "text-gray-900" : "text-gray-500"}`}
                    >
                      {section.title}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${(currentSection / sections.length) * 100}%` }}
              />
            </div>
            <div className="text-center mt-2">
              <span className="text-sm text-gray-600">
                Step {currentSection} of {sections.length}
              </span>
            </div>
          </div>

          {/* Main Card */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Success Alert */}
              {success && (
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">
                    ✅ Preferences saved successfully! Redirecting to tenant profiles...
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-8">
                {/* Section 1: What Matters Most */}
                {currentSection === 1 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-gray-900 mb-3">What matters most to you?</h2>
                      <p className="text-gray-600 mb-8">Select your top priorities (choose up to 3)</p>
                    </div>
                    <div className="grid gap-4">
                      {[
                        { text: "Financial guarantees and rent stability", icon: "💰" },
                        { text: "A quiet, respectful lifestyle", icon: "🤫" },
                        { text: "Long-term stay and reliability", icon: "📅" },
                        { text: "Someone who will care for the space like it's their own", icon: "🏠" },
                        { text: "A human connection or shared values", icon: "❤️" },
                        { text: "Cultural fit or personality", icon: "🤝" },
                        { text: "No strong preference – just rent paid on time", icon: "⏰" },
                      ].map((priority) => (
                        <label
                          key={priority.text}
                          className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            formData.priorities.includes(priority.text)
                              ? "border-blue-500 bg-blue-50 shadow-md"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          } ${
                            formData.priorities.length >= 3 && !formData.priorities.includes(priority.text)
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <span className="text-2xl mr-4">{priority.icon}</span>
                          <div className="flex-1">
                            <span className="text-gray-900 font-medium">{priority.text}</span>
                          </div>
                          <Checkbox
                            checked={formData.priorities.includes(priority.text)}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange("priorities", priority.text, checked as boolean)
                            }
                            disabled={formData.priorities.length >= 3 && !formData.priorities.includes(priority.text)}
                            className="ml-4"
                          />
                        </label>
                      ))}
                    </div>
                    {formData.priorities.length > 0 && (
                      <div className="text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {formData.priorities.length} of 3 selected
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Section 2: Tenant Profile */}
                {currentSection === 2 && (
                  <div className="space-y-8">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-gray-900 mb-3">Preferred Tenant Categories</h2>
                      <p className="text-gray-600 mb-8">Select up to 3 tenant categories you prefer</p>
                    </div>
                    <div className="grid gap-4">
                      {[
                        { text: "Student", icon: "🎓" },
                        { text: "Young professional", icon: "💼" },
                        { text: "Artist / creative field", icon: "🎨" },
                        { text: "Civil servant", icon: "🏛️" },
                        { text: "Corporate employee", icon: "🏢" },
                        { text: "Startup / entrepreneur", icon: "🚀" },
                        { text: "Academic or researcher", icon: "🔬" },
                        { text: "Family", icon: "👨‍👩‍👧‍👦" },
                        { text: "Couple", icon: "💑" },
                        { text: "No preference", icon: "🤷‍♂️" },
                      ].map((category) => (
                        <label
                          key={category.text}
                          className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            formData.tenantCategories.includes(category.text)
                              ? "border-blue-500 bg-blue-50 shadow-md"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          } ${
                            formData.tenantCategories.length >= 3 && !formData.tenantCategories.includes(category.text)
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <span className="text-2xl mr-4">{category.icon}</span>
                          <div className="flex-1">
                            <span className="text-gray-900 font-medium">{category.text}</span>
                          </div>
                          <Checkbox
                            checked={formData.tenantCategories.includes(category.text)}
                            onCheckedChange={(checked) => handleTenantCategoryChange(category.text, checked as boolean)}
                            disabled={
                              formData.tenantCategories.length >= 3 &&
                              !formData.tenantCategories.includes(category.text)
                            }
                            className="ml-4"
                          />
                        </label>
                      ))}
                    </div>
                    {formData.tenantCategories.length > 0 && (
                      <div className="text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {formData.tenantCategories.length} of 3 selected
                        </span>
                      </div>
                    )}

                    {formData.tenantCategories.includes("Student") && (
                      <div className="bg-gray-50 p-6 rounded-xl">
                        <h3 className="text-lg font-semibold mb-4">Student Preferences</h3>
                        <Label className="text-base font-medium mb-3 block">
                          Would you like to know their field of study?
                        </Label>
                        <RadioGroup
                          value={formData.studentField}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, studentField: value }))}
                          className="space-y-3"
                        >
                          <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white transition-colors">
                            <RadioGroupItem value="yes" id="student-yes" />
                            <Label htmlFor="student-yes" className="font-medium">
                              Yes
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white transition-colors">
                            <RadioGroupItem value="no" id="student-no" />
                            <Label htmlFor="student-no" className="font-medium">
                              No
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white transition-colors">
                            <RadioGroupItem value="mobility" id="student-mobility" />
                            <Label htmlFor="student-mobility" className="font-medium">
                              Only if applying for a mobility lease
                            </Label>
                          </div>
                        </RadioGroup>
                        {formData.studentField === "yes" && (
                          <div className="mt-6">
                            <Label htmlFor="student-fields" className="text-base font-medium mb-2 block">
                              Which fields would you feel most comfortable with?
                            </Label>
                            <Input
                              id="student-fields"
                              placeholder="e.g. Law, Business, Medicine, Arts..."
                              value={formData.studentFieldPreference}
                              onChange={(e) =>
                                setFormData((prev) => ({ ...prev, studentFieldPreference: e.target.value }))
                              }
                              className="mt-2 p-3 text-base"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Section 3: Financial Guarantees */}
                {currentSection === 3 && (
                  <div className="space-y-8">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-gray-900 mb-3">Financial Requirements</h2>
                      <p className="text-gray-600 mb-8">Set your financial criteria for tenants</p>
                    </div>

                    <div>
                      <Label className="text-lg font-semibold mb-4 block">Minimum financial requirement</Label>
                      <RadioGroup
                        value={formData.minFinancialRequirement}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, minFinancialRequirement: value }))}
                        className="space-y-3"
                      >
                        {[
                          { value: "3x the rent (standard)", icon: "📊" },
                          { value: "2.5x the rent", icon: "📈" },
                          { value: "Depends on the profile", icon: "🤔" },
                          { value: "Other", icon: "✏️" },
                        ].map((req) => (
                          <label
                            key={req.value}
                            className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                              formData.minFinancialRequirement === req.value
                                ? "border-green-500 bg-green-50 shadow-md"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            <span className="text-2xl mr-4">{req.icon}</span>
                            <div className="flex-1">
                              <span className="text-gray-900 font-medium">{req.value}</span>
                            </div>
                            <RadioGroupItem value={req.value} id={req.value} />
                          </label>
                        ))}
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-lg font-semibold mb-4 block">
                        Required documents (select all that apply)
                      </Label>
                      <div className="grid gap-3">
                        {[
                          { text: "French guarantor", icon: "🇫🇷" },
                          { text: "Visale guarantee", icon: "🛡️" },
                          { text: "Employment contract", icon: "📄" },
                          { text: "Last 3 pay slips", icon: "💰" },
                          { text: "Last tax return", icon: "📋" },
                        ].map((req) => (
                          <label
                            key={req.text}
                            className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                              formData.financialRequirements.includes(req.text)
                                ? "border-green-500 bg-green-50 shadow-md"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            <span className="text-2xl mr-4">{req.icon}</span>
                            <div className="flex-1">
                              <span className="text-gray-900 font-medium">{req.text}</span>
                            </div>
                            <Checkbox
                              checked={formData.financialRequirements.includes(req.text)}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange("financialRequirements", req.text, checked as boolean)
                              }
                              className="ml-4"
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Section 4: Lease & Legal */}
                {currentSection === 4 && (
                  <div className="space-y-8">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-gray-900 mb-3">Lease & Legal Preferences</h2>
                      <p className="text-gray-600 mb-8">Define your lease terms and legal requirements</p>
                    </div>

                    <div>
                      <Label className="text-lg font-semibold mb-4 block">Type of lease offered</Label>
                      <RadioGroup
                        value={formData.leaseType}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, leaseType: value }))}
                        className="space-y-3"
                      >
                        {[
                          { value: "Primary residence (3 years unfurnished)", icon: "🏠" },
                          { value: "Furnished lease (1 year)", icon: "🛋️" },
                          { value: "Mobility lease (1–10 months)", icon: "🎒" },
                          { value: "Colocation accepted", icon: "👥" },
                          { value: "Flexible", icon: "🔄" },
                        ].map((type) => (
                          <label
                            key={type.value}
                            className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                              formData.leaseType === type.value
                                ? "border-purple-500 bg-purple-50 shadow-md"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            <span className="text-2xl mr-4">{type.icon}</span>
                            <div className="flex-1">
                              <span className="text-gray-900 font-medium">{type.value}</span>
                            </div>
                            <RadioGroupItem value={type.value} id={type.value} />
                          </label>
                        ))}
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-lg font-semibold mb-4 block">Minimum expected stay</Label>
                      <RadioGroup
                        value={formData.minStay}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, minStay: value }))}
                        className="space-y-3"
                      >
                        {[
                          { value: "1–6 months", icon: "📅" },
                          { value: "6–12 months", icon: "📆" },
                          { value: "1+ year", icon: "🗓️" },
                          { value: "No preference", icon: "🤷‍♂️" },
                        ].map((stay) => (
                          <label
                            key={stay.value}
                            className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                              formData.minStay === stay.value
                                ? "border-purple-500 bg-purple-50 shadow-md"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            <span className="text-2xl mr-4">{stay.icon}</span>
                            <div className="flex-1">
                              <span className="text-gray-900 font-medium">{stay.value}</span>
                            </div>
                            <RadioGroupItem value={stay.value} id={stay.value} />
                          </label>
                        ))}
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-lg font-semibold mb-4 block">Do you accept:</Label>
                      <div className="grid gap-3">
                        {[
                          { text: "Foreign tenants without French tax history?", icon: "🌍" },
                          { text: "Company leases?", icon: "🏢" },
                          { text: "Government-assisted tenants (CAF)?", icon: "🏛️" },
                        ].map((acceptance) => (
                          <label
                            key={acceptance.text}
                            className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                              formData.acceptances.includes(acceptance.text)
                                ? "border-purple-500 bg-purple-50 shadow-md"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            <span className="text-2xl mr-4">{acceptance.icon}</span>
                            <div className="flex-1">
                              <span className="text-gray-900 font-medium">{acceptance.text}</span>
                            </div>
                            <Checkbox
                              checked={formData.acceptances.includes(acceptance.text)}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange("acceptances", acceptance.text, checked as boolean)
                              }
                              className="ml-4"
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Section 5: Lifestyle */}
                {currentSection === 5 && (
                  <div className="space-y-8">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-gray-900 mb-3">Lifestyle Compatibility</h2>
                      <p className="text-gray-600 mb-8">What lifestyle factors matter to you?</p>
                    </div>

                    <div>
                      <Label className="text-lg font-semibold mb-4 block">
                        Lifestyle preferences (select all that matter to you)
                      </Label>
                      <div className="grid gap-3">
                        {[
                          { text: "Quiet tenant (no music or parties)", icon: "🤫" },
                          { text: "No smoking indoors", icon: "🚭" },
                          { text: "No pets", icon: "🚫🐕" },
                          { text: "No subletting", icon: "🏠" },
                          { text: "Limited guests", icon: "👥" },
                          { text: "Clean and orderly lifestyle", icon: "✨" },
                          { text: "Tenant who enjoys gardening / decor", icon: "🌱" },
                          { text: "Tenant who appreciates old buildings / heritage", icon: "🏛️" },
                        ].map((matter) => (
                          <label
                            key={matter.text}
                            className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                              formData.lifestyleMatters.includes(matter.text)
                                ? "border-orange-500 bg-orange-50 shadow-md"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            <span className="text-2xl mr-4">{matter.icon}</span>
                            <div className="flex-1">
                              <span className="text-gray-900 font-medium">{matter.text}</span>
                            </div>
                            <Checkbox
                              checked={formData.lifestyleMatters.includes(matter.text)}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange("lifestyleMatters", matter.text, checked as boolean)
                              }
                              className="ml-4"
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Section 6: Red Flags */}
                {currentSection === 6 && (
                  <div className="space-y-8">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-gray-900 mb-3">Red Flags & Dealbreakers</h2>
                      <p className="text-gray-600 mb-8">What would be absolute dealbreakers for you?</p>
                    </div>

                    <div>
                      <Label className="text-lg font-semibold mb-4 block">Dealbreakers (check all that apply)</Label>
                      <div className="grid gap-3">
                        {[
                          { text: "No guarantor", icon: "❌" },
                          { text: "No proof of income", icon: "💸" },
                          { text: "Foreign tenant with no French documents", icon: "📄" },
                          { text: "Group of students", icon: "👥" },
                          { text: "Pets", icon: "🐕" },
                          { text: "Too short a stay", icon: "⏰" },
                          { text: "Poor past landlord reference", icon: "👎" },
                          { text: "Unstable employment", icon: "📉" },
                        ].map((dealbreaker) => (
                          <label
                            key={dealbreaker.text}
                            className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                              formData.dealbreakers.includes(dealbreaker.text)
                                ? "border-red-500 bg-red-50 shadow-md"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            <span className="text-2xl mr-4">{dealbreaker.icon}</span>
                            <div className="flex-1">
                              <span className="text-gray-900 font-medium">{dealbreaker.text}</span>
                            </div>
                            <Checkbox
                              checked={formData.dealbreakers.includes(dealbreaker.text)}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange("dealbreakers", dealbreaker.text, checked as boolean)
                              }
                              className="ml-4"
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-8">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentSection((prev) => Math.max(1, prev - 1))}
                    disabled={currentSection === 1 || saving}
                    className="px-6 py-3 text-base"
                  >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Previous
                  </Button>

                  {currentSection < sections.length ? (
                    <Button
                      onClick={() => setCurrentSection((prev) => prev + 1)}
                      className="px-6 py-3 text-base bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                      disabled={saving}
                    >
                      Next <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      className="px-8 py-3 text-base bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          Complete & Save <ChevronRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
