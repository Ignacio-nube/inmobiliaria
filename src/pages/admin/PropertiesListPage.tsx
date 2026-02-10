import { useEffect, useState, useCallback, useRef } from 'react'
import { Link } from 'react-router'
import {
  Search,
  Plus,
  Star,
  StarOff,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import {
  TIPO_OPERACION_LABELS,
  TIPO_PROPIEDAD_LABELS,
  ESTADO_PROPIEDAD_LABELS,
} from '@/lib/constants'
import Badge from '@/components/ui/Badge'
import { formatPrice, getOperacionBadgeVariant } from '@/lib/formatters'
import Button from '@/components/ui/Button'
import type { PropiedadConImagenes } from '@/types/property'

type EstadoFilter = 'todas' | 'activa' | 'pausada' | 'vendida' | 'alquilada'

export default function PropertiesListPage() {
  const { profile } = useAuth()
  const [propiedades, setPropiedades] = useState<PropiedadConImagenes[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [estadoFilter, setEstadoFilter] = useState<EstadoFilter>('todas')
  const [appearedItems, setAppearedItems] = useState<Set<number>>(new Set())
  const staggerTimers = useRef<ReturnType<typeof setTimeout>[]>([])

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350)
    return () => clearTimeout(t)
  }, [search])  // Trigger stagger when propiedades change
  useEffect(() => {
    staggerTimers.current.forEach(clearTimeout)
    staggerTimers.current = []
    setAppearedItems(new Set())

    if (!loading && propiedades.length > 0) {
      propiedades.forEach((_, i) => {
        const t = setTimeout(() => {
          setAppearedItems((prev) => new Set(prev).add(i))
        }, 50 + i * 60)
        staggerTimers.current.push(t)
      })
    }

    return () => staggerTimers.current.forEach(clearTimeout)
  }, [loading, propiedades])

  const fetchProperties = useCallback(async () => {
    if (!profile?.organizacion_id) return
    setLoading(true)

    let query = supabase
      .from('inmob_propiedades')
      .select('*, inmob_imagenes(*)')
      .eq('organizacion_id', profile.organizacion_id)
      .order('created_at', { ascending: false })

    if (estadoFilter !== 'todas') {
      query = query.eq('estado', estadoFilter)
    }

    if (debouncedSearch.trim()) {
      query = query.ilike('titulo', `%${debouncedSearch.trim()}%`)
    }

    const { data } = await query
    setPropiedades((data as PropiedadConImagenes[] | null) ?? [])
    setLoading(false)
  }, [profile?.organizacion_id, estadoFilter, debouncedSearch])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  async function toggleDestacada(id: string, current: boolean | null) {
    const { error } = await supabase
      .from('inmob_propiedades')
      .update({ destacada: !current })
      .eq('id', id)
    if (error) { toast.error('Error al actualizar'); return }
    setPropiedades((prev) =>
      prev.map((p) => (p.id === id ? { ...p, destacada: !current } : p))
    )
    toast.success(!current ? 'Marcada como destacada' : 'Destacada removida')
  }

  async function toggleEstado(id: string, current: string) {
    const newEstado = current === 'activa' ? 'pausada' : 'activa'
    const { error } = await supabase
      .from('inmob_propiedades')
      .update({ estado: newEstado })
      .eq('id', id)
    if (error) { toast.error('Error al actualizar'); return }
    setPropiedades((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, estado: newEstado as typeof p.estado } : p
      )
    )
    toast.success(newEstado === 'activa' ? 'Propiedad activada' : 'Propiedad pausada')
  }

  async function deleteProp(id: string, titulo: string) {
    if (!confirm(`¿Eliminar "${titulo}"? Esta accion no se puede deshacer.`)) return
    await supabase.from('inmob_imagenes').delete().eq('propiedad_id', id)
    await supabase.from('inmob_consultas').delete().eq('propiedad_id', id)
    const { error } = await supabase.from('inmob_propiedades').delete().eq('id', id)
    if (error) { toast.error('Error al eliminar'); return }
    setPropiedades((prev) => prev.filter((p) => p.id !== id))
    toast.success('Propiedad eliminada')
  }

  function getMainImage(prop: PropiedadConImagenes): string | null {
    const main = prop.inmob_imagenes.find((i) => i.es_principal)
    return main?.url ?? prop.inmob_imagenes[0]?.url ?? null
  }

  const estadoTabs: { value: EstadoFilter; label: string }[] = [
    { value: 'todas', label: 'Todas' },
    { value: 'activa', label: 'Activas' },
    { value: 'pausada', label: 'Pausadas' },
    { value: 'vendida', label: 'Vendidas' },
    { value: 'alquilada', label: 'Alquiladas' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Propiedades</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {propiedades.length} propiedad{propiedades.length !== 1 ? 'es' : ''}
          </p>
        </div>
        <Link to="/admin/propiedades/nueva">
          <Button size="md">
            <Plus size={18} />
            Nueva propiedad
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
          />
          <input
            type="text"
            placeholder="Buscar por título..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-bg-card py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-tertiary focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
        <div className="flex gap-1 overflow-x-auto rounded-lg border border-border bg-bg-card p-1">
          {estadoTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setEstadoFilter(tab.value)}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                estadoFilter === tab.value
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-secondary hover:bg-bg-subtle hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex flex-col gap-4 rounded-xl border border-border bg-bg-card p-4 sm:flex-row sm:items-center"
            >
              {/* Image skeleton */}
              <div className="h-20 w-full flex-shrink-0 rounded-lg skeleton-shimmer sm:w-28" />
              {/* Info skeleton */}
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-40 skeleton-shimmer" />
                  <div className="h-5 w-16 rounded-[var(--radius-badge)] skeleton-shimmer" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-3 w-20 skeleton-shimmer" />
                  <div className="h-3 w-24 skeleton-shimmer" />
                  <div className="h-3 w-28 skeleton-shimmer" />
                </div>
              </div>
              {/* Actions skeleton */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="h-8 w-8 rounded-lg skeleton-shimmer" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : propiedades.length === 0 ? (
        <div className="rounded-xl border border-border bg-bg-card px-6 py-16 text-center">
          <p className="text-text-tertiary">No se encontraron propiedades</p>
          <Link to="/admin/propiedades/nueva" className="mt-4 inline-block">
            <Button variant="outline" size="sm">
              <Plus size={16} /> Crear primera propiedad
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {propiedades.map((prop, i) => {
            const img = getMainImage(prop)
            return (
              <div
                key={prop.id}
                className={`appear-ready flex flex-col gap-4 rounded-xl border border-border bg-bg-card p-4 sm:flex-row sm:items-center ${appearedItems.has(i) ? 'appeared' : ''}`}
              >
                {/* Image */}
                <div className="h-20 w-full flex-shrink-0 overflow-hidden rounded-lg bg-bg-subtle sm:w-28">
                  {img ? (
                    <img
                      src={img}
                      alt={prop.titulo}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-text-tertiary">
                      Sin imagen
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      to={`/admin/propiedades/${prop.id}`}
                      className="font-semibold text-text-primary hover:text-primary"
                    >
                      {prop.titulo}
                    </Link>
                    <Badge variant={getOperacionBadgeVariant(prop.tipo_operacion)}>
                      {TIPO_OPERACION_LABELS[prop.tipo_operacion]}
                    </Badge>
                    {prop.destacada && (
                      <Badge variant="warning">Destacada</Badge>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-text-secondary">
                    <span>{TIPO_PROPIEDAD_LABELS[prop.tipo_propiedad]}</span>
                    <span className="font-semibold">
                      {formatPrice(prop.precio, prop.moneda)}
                    </span>
                    <span>
                      {prop.ciudad}
                      {prop.barrio ? `, ${prop.barrio}` : ''}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-xs font-medium ${
                        prop.estado === 'activa'
                          ? 'bg-success/10 text-success'
                          : prop.estado === 'pausada'
                          ? 'bg-warning/10 text-warning'
                          : 'bg-bg-subtle text-text-tertiary'
                      }`}
                    >
                      {ESTADO_PROPIEDAD_LABELS[prop.estado]}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => toggleDestacada(prop.id, prop.destacada)}
                    className="rounded-lg p-2 text-text-tertiary transition-colors hover:bg-bg-subtle hover:text-warning"
                    title={prop.destacada ? 'Quitar destacada' : 'Marcar destacada'}
                  >
                    {prop.destacada ? <Star size={18} className="fill-warning text-warning" /> : <StarOff size={18} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleEstado(prop.id, prop.estado)}
                    className="rounded-lg p-2 text-text-tertiary transition-colors hover:bg-bg-subtle hover:text-primary"
                    title={prop.estado === 'activa' ? 'Pausar' : 'Activar'}
                  >
                    {prop.estado === 'activa' ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <Link
                    to={`/admin/propiedades/${prop.id}`}
                    className="rounded-lg p-2 text-text-tertiary transition-colors hover:bg-bg-subtle hover:text-primary"
                    title="Editar"
                  >
                    <Pencil size={18} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => deleteProp(prop.id, prop.titulo)}
                    className="rounded-lg p-2 text-text-tertiary transition-colors hover:bg-bg-subtle hover:text-error"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
