"use client"

import { useState, useEffect } from "react"
import { createClient, type TenantProfile } from "@/lib/supabase"

export function useTenantProfiles() {
  const [tenants, setTenants] = useState<TenantProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()
  const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Mock data for when Supabase is not configured
  const mockTenants: TenantProfile[] = [
    {
      id: "1",
      first_name: "Marie",
      last_name: "Dubois",
      email: "marie.dubois@email.com",
      phone: "+33 6 12 34 56 78",
      date_of_birth: "1999-03-15",
      profession: "Software Engineer",
      employment_type: "CDI",
      company_name: "Tech Corp",
      monthly_income: 4200,
      guarantor_type: "Parents",
      guarantor_income: 8500,
      smoking_status: "Non-smoker",
      pets: [],
      lifestyle_description: "Quiet, enjoys reading and cooking. Works regular hours.",
      guest_frequency: "Occasionally",
      noise_tolerance: "Quiet",
      previous_rental_document: true,
      previous_rental_paying: true,
      reason_for_moving: "Job relocation",
      application_status: "reviewing",
      score: 92,
      matched_preferences: ["Financial stability", "Professional background", "Quiet lifestyle"],
      compatibility_reasons: ["Excellent income ratio", "Stable employment", "Lifestyle match"],
      languages: ["French", "English", "Spanish"],
      application_date: "2024-01-15T10:00:00Z",
      scheduling_link_sent: false,
    },
    {
      id: "2",
      first_name: "Thomas",
      last_name: "Martin",
      email: "thomas.martin@email.com",
      phone: "+33 6 23 45 67 89",
      date_of_birth: "1995-07-22",
      profession: "Marketing Manager",
      employment_type: "CDI",
      company_name: "Creative Agency",
      monthly_income: 3800,
      guarantor_type: "Bank",
      guarantor_income: null,
      smoking_status: "Non-smoker",
      pets: ["Cat"],
      lifestyle_description: "Social and active, enjoys photography and travel.",
      guest_frequency: "Frequently",
      noise_tolerance: "Moderate",
      previous_rental_document: true,
      previous_rental_paying: true,
      reason_for_moving: "Apartment too small",
      application_status: "approved",
      score: 88,
      matched_preferences: ["Professional sector match", "Good income ratio", "Cultural fit"],
      compatibility_reasons: ["Marketing background", "Stable income", "Good references"],
      languages: ["French", "English"],
      application_date: "2024-01-18T14:30:00Z",
      scheduling_link_sent: true,
      scheduling_link_sent_date: "2024-01-19T09:00:00Z",
    },
    {
      id: "3",
      first_name: "Sophie",
      last_name: "Chen",
      email: "sophie.chen@email.com",
      phone: "+33 6 34 56 78 90",
      date_of_birth: "2001-11-08",
      profession: "Master's Student",
      employment_type: "Student",
      company_name: "Business School",
      monthly_income: 2100,
      guarantor_type: "Parents",
      guarantor_income: 6500,
      smoking_status: "Non-smoker",
      pets: [],
      lifestyle_description: "Studious and organized, enjoys piano and art.",
      guest_frequency: "Rarely",
      noise_tolerance: "Quiet",
      previous_rental_document: true,
      previous_rental_paying: true,
      reason_for_moving: "Student housing expired",
      application_status: "approved",
      score: 85,
      matched_preferences: ["Student preference", "Long-term stay", "Financial backing"],
      compatibility_reasons: ["Parental guarantee", "Excellent grades", "Responsible tenant"],
      languages: ["Chinese", "French", "English"],
      application_date: "2024-01-20T16:15:00Z",
      scheduling_link_sent: false,
    },
    {
      id: "4",
      first_name: "Lucas",
      last_name: "Petit",
      email: "lucas.petit@email.com",
      phone: "+33 6 45 67 89 01",
      date_of_birth: "1997-05-12",
      profession: "Graphic Designer",
      employment_type: "Freelance",
      company_name: "Freelance",
      monthly_income: 2800,
      guarantor_type: "Bank",
      guarantor_income: null,
      smoking_status: "Occasional",
      pets: [],
      lifestyle_description: "Creative and flexible, works from home often.",
      guest_frequency: "Occasionally",
      noise_tolerance: "Flexible",
      previous_rental_document: true,
      previous_rental_paying: true,
      reason_for_moving: "Seeking better workspace",
      application_status: "pending",
      score: 78,
      matched_preferences: ["Creative field", "Artistic appreciation", "Flexible arrangement"],
      compatibility_reasons: ["Creative professional", "Portfolio of work", "Flexible schedule"],
      languages: ["French", "English", "Italian"],
      application_date: "2024-01-22T11:45:00Z",
      scheduling_link_sent: false,
    },
    {
      id: "5",
      first_name: "Emma",
      last_name: "Rodriguez",
      email: "emma.rodriguez@email.com",
      phone: "+33 6 56 78 90 12",
      date_of_birth: "1993-09-03",
      profession: "Civil Servant",
      employment_type: "CDI",
      company_name: "Ministry of Education",
      monthly_income: 3600,
      guarantor_type: "Employment",
      guarantor_income: null,
      smoking_status: "Non-smoker",
      pets: [],
      lifestyle_description: "Stable and quiet, enjoys gardening and hiking.",
      guest_frequency: "Rarely",
      noise_tolerance: "Quiet",
      previous_rental_document: true,
      previous_rental_paying: true,
      reason_for_moving: "Moving closer to work",
      application_status: "reviewing",
      score: 94,
      matched_preferences: ["Job security", "Stable income", "Long-term reliability"],
      compatibility_reasons: ["Government employment", "Excellent stability", "Long-term commitment"],
      languages: ["Spanish", "French", "English"],
      application_date: "2024-01-25T13:20:00Z",
      scheduling_link_sent: false,
    },
  ]

  const loadTenants = async () => {
    setLoading(true)
    setError(null)

    try {
      if (!isSupabaseConfigured) {
        console.log("Supabase not configured, using mock data")
        setTenants(mockTenants)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("tenant_profiles")
        .select("*")
        .order("application_date", { ascending: false })

      if (error) {
        console.error("Error loading tenants:", error)
        setError("Failed to load tenant profiles")
        // Fallback to mock data
        setTenants(mockTenants)
        return
      }

      setTenants(data || [])
    } catch (err) {
      console.error("Error:", err)
      setError("Failed to load tenant profiles")
      // Fallback to mock data
      setTenants(mockTenants)
    } finally {
      setLoading(false)
    }
  }

  const updateTenantStatus = async (tenantId: string, status: string) => {
    if (!isSupabaseConfigured) {
      // Update mock data
      setTenants((prev) =>
        prev.map((tenant) => (tenant.id === tenantId ? { ...tenant, application_status: status } : tenant)),
      )
      return
    }

    try {
      const { error } = await supabase
        .from("tenant_profiles")
        .update({
          application_status: status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", tenantId)

      if (error) {
        console.error("Error updating tenant status:", error)
        return
      }

      // Update local state
      setTenants((prev) =>
        prev.map((tenant) => (tenant.id === tenantId ? { ...tenant, application_status: status } : tenant)),
      )
    } catch (err) {
      console.error("Error updating tenant status:", err)
    }
  }

  const sendSchedulingLink = async (tenantId: string) => {
    if (!isSupabaseConfigured) {
      // Update mock data
      setTenants((prev) =>
        prev.map((tenant) =>
          tenant.id === tenantId
            ? {
                ...tenant,
                scheduling_link_sent: true,
                scheduling_link_sent_date: new Date().toISOString(),
              }
            : tenant,
        ),
      )
      return
    }

    try {
      const { error } = await supabase
        .from("tenant_profiles")
        .update({
          scheduling_link_sent: true,
          scheduling_link_sent_date: new Date().toISOString(),
          last_contact_date: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", tenantId)

      if (error) {
        console.error("Error sending scheduling link:", error)
        return
      }

      // Update local state
      setTenants((prev) =>
        prev.map((tenant) =>
          tenant.id === tenantId
            ? {
                ...tenant,
                scheduling_link_sent: true,
                scheduling_link_sent_date: new Date().toISOString(),
              }
            : tenant,
        ),
      )
    } catch (err) {
      console.error("Error sending scheduling link:", err)
    }
  }

  useEffect(() => {
    loadTenants()
  }, [])

  return {
    tenants,
    loading,
    error,
    refetch: loadTenants,
    updateTenantStatus,
    sendSchedulingLink,
    isSupabaseConfigured,
  }
}
