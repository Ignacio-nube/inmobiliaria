import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Organizacion } from '@/types/property'

export function useOrganization(slug?: string) {
  const [organization, setOrganization] = useState<Organizacion | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOrganization() {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('inmob_organizaciones')
        .select('*')
        .eq('activa', true)

      if (slug) {
        query = query.eq('slug', slug)
      }

      const { data, error: fetchError } = await query.limit(1).single()

      if (fetchError) {
        setError(fetchError.message)
        setOrganization(null)
      } else {
        setOrganization(data)
      }

      setLoading(false)
    }

    fetchOrganization()
  }, [slug])

  return { organization, loading, error }
}
