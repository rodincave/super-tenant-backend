"use client"

import { useState, useEffect } from "react"
import { createClient, type TenantProfile } from "@/lib/supabase"

export function useTenantProfiles() {
  const [tenants, setTenants] = useState<TenantProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()
  const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const loadTenants = async () => {
    setLoading(true)
    setError(null)

    try {
      if (!isSupabaseConfigured) {
        setError("Supabase n'est pas configuré. Veuillez vérifier les variables d'environnement.")
        setTenants([])
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("tenant_profiles")
        .select("*")
        .order("application_date", { ascending: false })

      if (error) {
        setError("Erreur lors du chargement des locataires : " + error.message)
        setTenants([])
        return
      }

      setTenants(data || [])
    } catch (err: any) {
      setError("Erreur inattendue : " + err.message)
      setTenants([])
    } finally {
      setLoading(false)
    }
  }

  const updateTenantStatus = async (tenantId: string, status: string) => {
    if (!isSupabaseConfigured) {
      setError("Supabase n'est pas configuré. Impossible de mettre à jour le statut.")
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
        setError("Erreur lors de la mise à jour du statut : " + error.message)
        return
      }

      // Update local state
      setTenants((prev) =>
        prev.map((tenant) => (tenant.id === tenantId ? { ...tenant, application_status: status } : tenant)),
      )
    } catch (err: any) {
      setError("Erreur inattendue lors de la mise à jour du statut : " + err.message)
    }
  }

  const sendSchedulingLink = async (tenantId: string) => {
    if (!isSupabaseConfigured) {
      setError("Supabase n'est pas configuré. Impossible d'envoyer le lien.")
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
        setError("Erreur lors de l'envoi du lien : " + error.message)
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
    } catch (err: any) {
      setError("Erreur inattendue lors de l'envoi du lien : " + err.message)
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
