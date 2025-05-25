import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Log unique et concis
console.log(`[SUPABASE] Initialisation: URL=${supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'undefined'}`)

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("❌ Supabase environment variables missing")
    // Return a mock client that will fail gracefully
    return {
      from: () => ({
        select: () => Promise.resolve({ data: null, error: { message: "No Supabase config" } }),
        upsert: () => Promise.resolve({ data: null, error: { message: "No Supabase config" } }),
      }),
    } as any
  }
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
  income_interview?: string | number
  income_documents?: string | number
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
  pros?: string
  cons?: string
  tenant_document_id_valid?: boolean
  tenant_document_income_valid?: boolean
  tenant_document_tax_valid?: boolean
  tenant_document_receipt_valid?: boolean
}
