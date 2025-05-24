import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function createClient() {
  // Log ALL environment variables for debugging
  console.log("=== ALL ENVIRONMENT VARIABLES ===")
  console.log("Full process.env:", process.env)
  console.log("=====================================")

  // Log specific Supabase variables
  console.log("NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  console.log("SUPABASE_URL:", process.env.SUPABASE_URL)
  console.log("SUPABASE_ANON_KEY:", process.env.SUPABASE_ANON_KEY)
  console.log("SUPABASE_SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY)
  console.log("SUPABASE_JWT_SECRET:", process.env.SUPABASE_JWT_SECRET)

  // Check what's actually available
  console.log("Available env keys:", Object.keys(process.env))

  // Log the values we're using
  console.log("supabaseUrl variable:", supabaseUrl)
  console.log("supabaseAnonKey variable:", supabaseAnonKey)

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("❌ Supabase environment variables missing")
    console.log("supabaseUrl exists:", !!supabaseUrl)
    console.log("supabaseAnonKey exists:", !!supabaseAnonKey)

    // Return a mock client that will fail gracefully
    return {
      from: () => ({
        select: () => Promise.resolve({ data: null, error: { message: "No Supabase config" } }),
        upsert: () => Promise.resolve({ data: null, error: { message: "No Supabase config" } }),
      }),
    } as any
  }

  console.log("✅ Creating Supabase client with URL:", supabaseUrl?.substring(0, 20) + "...")
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

// Database types
export interface OwnerPreferences {
  id?: string
  owner_id?: string
  priorities: string[]
  tenant_category: string
  student_field: string
  student_field_preference: string
  professional_sector: string
  professional_sector_preference: string
  min_financial_requirement: string
  financial_requirements: string[]
  lease_type: string
  min_stay: string
  acceptances: string[]
  lifestyle_matters: string[]
  relationship_management: string
  dealbreakers: string[]
  created_at?: string
  updated_at?: string
}

// Add this new interface for tenant profiles
export interface TenantProfile {
  id?: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  date_of_birth?: string
  profession?: string
  employment_type?: string
  company_name?: string
  monthly_income?: number
  guarantor_type?: string
  guarantor_income?: number
  smoking_status?: string
  pets?: string[]
  lifestyle_description?: string
  guest_frequency?: string
  noise_tolerance?: string
  previous_rental_document?: boolean
  previous_rental_paying?: boolean
  reason_for_moving?: string
  application_status?: string
  application_date?: string
  score?: number
  documents_submitted?: any
  documents_verified?: any
  interview_responses?: any
  interview_date?: string
  interview_notes?: string
  matched_preferences?: string[]
  compatibility_reasons?: string[]
  last_contact_date?: string
  communication_preference?: string
  scheduling_link_sent?: boolean
  scheduling_link_sent_date?: string
  created_at?: string
  updated_at?: string
  created_by?: string
  languages?: string[]
}
