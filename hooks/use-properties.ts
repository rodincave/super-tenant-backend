import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase"

export type Property = Record<string, any>;

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProperties = useCallback(async () => {
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { data, error } = await supabase.from("properties").select("*").order("created_at", { ascending: false })
    if (error) {
      setError(error.message)
      setProperties([])
    } else {
      setProperties(data || [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  return { properties, loading, error, reload: fetchProperties }
} 