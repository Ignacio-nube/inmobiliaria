import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useFilterStore } from '@/store/filterStore'
import { DEFAULT_PAGE_SIZE } from '@/lib/constants'
import type { PropiedadConImagenes } from '@/types/property'
import type { PaginatedResult } from '@/types/filters'

export function useProperties(organizacionId?: string) {
  const { filters, sortBy, page } = useFilterStore()
  const [result, setResult] = useState<PaginatedResult<PropiedadConImagenes>>({
    data: [],
    count: 0,
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProperties = useCallback(async () => {
    setLoading(true)
    setError(null)

    let query = supabase
      .from('inmob_propiedades')
      .select('*, inmob_imagenes(*)', { count: 'exact' })
      .eq('estado', 'activa')

    // Apply organization filter
    if (organizacionId) {
      query = query.eq('organizacion_id', organizacionId)
    }

    // Apply filters
    if (filters.tipo_operacion) {
      query = query.eq('tipo_operacion', filters.tipo_operacion)
    }
    if (filters.tipo_propiedad) {
      query = query.eq('tipo_propiedad', filters.tipo_propiedad)
    }
    if (filters.ciudad) {
      query = query.eq('ciudad', filters.ciudad)
    }
    if (filters.barrio) {
      query = query.eq('barrio', filters.barrio)
    }
    if (filters.moneda) {
      query = query.eq('moneda', filters.moneda)
    }
    if (filters.precio_min != null) {
      query = query.gte('precio', filters.precio_min)
    }
    if (filters.precio_max != null) {
      query = query.lte('precio', filters.precio_max)
    }
    if (filters.dormitorios_min != null) {
      query = query.gte('dormitorios', filters.dormitorios_min)
    }
    if (filters.banos_min != null) {
      query = query.gte('banos', filters.banos_min)
    }
    if (filters.superficie_min != null) {
      query = query.gte('superficie_total', filters.superficie_min)
    }
    if (filters.superficie_max != null) {
      query = query.lte('superficie_total', filters.superficie_max)
    }
    if (filters.cochera) {
      query = query.eq('cochera', true)
    }
    if (filters.antiguedad) {
      query = query.eq('antiguedad', filters.antiguedad)
    }

    // Apply sorting
    switch (sortBy) {
      case 'precio_asc':
        query = query.order('precio', { ascending: true })
        break
      case 'precio_desc':
        query = query.order('precio', { ascending: false })
        break
      case 'superficie_asc':
        query = query.order('superficie_total', { ascending: true, nullsFirst: false })
        break
      case 'superficie_desc':
        query = query.order('superficie_total', { ascending: false, nullsFirst: false })
        break
      case 'recientes':
      default:
        query = query.order('created_at', { ascending: false })
        break
    }

    // Apply pagination
    const from = (page - 1) * DEFAULT_PAGE_SIZE
    const to = from + DEFAULT_PAGE_SIZE - 1
    query = query.range(from, to)

    const { data, error: fetchError, count } = await query

    if (fetchError) {
      setError(fetchError.message)
      setResult((prev) => ({ ...prev, data: [], count: 0 }))
    } else {
      setResult({
        data: (data as PropiedadConImagenes[]) ?? [],
        count: count ?? 0,
        page,
        pageSize: DEFAULT_PAGE_SIZE,
        totalPages: Math.ceil((count ?? 0) / DEFAULT_PAGE_SIZE),
      })
    }

    setLoading(false)
  }, [organizacionId, filters, sortBy, page])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  return { ...result, loading, error, refetch: fetchProperties }
}

/**
 * Hook para obtener propiedades destacadas
 */
export function useFeaturedProperties(organizacionId?: string) {
  const [properties, setProperties] = useState<PropiedadConImagenes[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      setLoading(true)

      let query = supabase
        .from('inmob_propiedades')
        .select('*, inmob_imagenes(*)')
        .eq('estado', 'activa')
        .eq('destacada', true)
        .order('orden', { ascending: true })
        .limit(10)

      if (organizacionId) {
        query = query.eq('organizacion_id', organizacionId)
      }

      const { data } = await query

      setProperties((data as PropiedadConImagenes[]) ?? [])
      setLoading(false)
    }

    fetch()
  }, [organizacionId])

  return { properties, loading }
}

/**
 * Hook para obtener una propiedad por slug
 */
export function usePropertyBySlug(slug: string) {
  const [property, setProperty] = useState<PropiedadConImagenes | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetch() {
      setLoading(true)

      const { data, error: fetchError } = await supabase
        .from('inmob_propiedades')
        .select('*, inmob_imagenes(*)')
        .eq('slug', slug)
        .single()

      if (fetchError) {
        setError(fetchError.message)
      } else {
        setProperty(data as PropiedadConImagenes)
      }

      setLoading(false)
    }

    if (slug) fetch()
  }, [slug])

  return { property, loading, error }
}

/**
 * Hook para obtener propiedades por IDs (favoritos / comparar)
 */
export function usePropertiesByIds(ids: string[]) {
  const [properties, setProperties] = useState<PropiedadConImagenes[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (ids.length === 0) {
      setProperties([])
      return
    }

    async function fetch() {
      setLoading(true)

      const { data } = await supabase
        .from('inmob_propiedades')
        .select('*, inmob_imagenes(*)')
        .in('id', ids)

      // Preserve the order of ids
      const mapped = ids
        .map((id) => (data as PropiedadConImagenes[] | null)?.find((p) => p.id === id))
        .filter(Boolean) as PropiedadConImagenes[]

      setProperties(mapped)
      setLoading(false)
    }

    fetch()
  }, [ids.join(',')])

  return { properties, loading }
}
