import { useEffect, useState, useRef, useCallback } from 'react'
import { Link } from 'react-router'
import { Building2, MessageSquare, Star, Eye, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { formatDate } from '@/lib/formatters'

/**
 * Hook that staggers "appeared" class on children after mount.
 * Returns a callback ref and a function to check if index has appeared.
 */
function useStaggerAppear(count: number, baseDelay = 0, staggerMs = 80) {
  const [appeared, setAppeared] = useState<Set<number>>(new Set())
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const trigger = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    for (let i = 0; i < count; i++) {
      const t = setTimeout(() => {
        setAppeared((prev) => new Set(prev).add(i))
      }, baseDelay + i * staggerMs)
      timersRef.current.push(t)
    }
  }, [count, baseDelay, staggerMs])

  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout)
  }, [])

  return { appeared, trigger }
}

interface Stats {
  totalPropiedades: number
  propiedadesActivas: number
  consultasSinLeer: number
  destacadas: number
}

interface ConsultaWithProp {
  id: string
  nombre: string
  mensaje: string
  leida: boolean | null
  created_at: string | null
  inmob_propiedades: { titulo: string } | null
}

export default function DashboardPage() {
  const { profile } = useAuth()
  const [stats, setStats] = useState<Stats>({
    totalPropiedades: 0,
    propiedadesActivas: 0,
    consultasSinLeer: 0,
    destacadas: 0,
  })
  const [consultas, setConsultas] = useState<ConsultaWithProp[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile?.organizacion_id) return
    const orgId = profile.organizacion_id

    async function fetchData() {
      const [propRes, activasRes, consultasRes, destacadasRes, recentRes] = await Promise.all([
        supabase
          .from('inmob_propiedades')
          .select('id', { count: 'exact', head: true })
          .eq('organizacion_id', orgId),
        supabase
          .from('inmob_propiedades')
          .select('id', { count: 'exact', head: true })
          .eq('organizacion_id', orgId)
          .eq('estado', 'activa'),
        supabase
          .from('inmob_consultas')
          .select('id', { count: 'exact', head: true })
          .eq('organizacion_id', orgId)
          .eq('leida', false),
        supabase
          .from('inmob_propiedades')
          .select('id', { count: 'exact', head: true })
          .eq('organizacion_id', orgId)
          .eq('destacada', true),
        supabase
          .from('inmob_consultas')
          .select('id, nombre, mensaje, leida, created_at, inmob_propiedades(titulo)')
          .eq('organizacion_id', orgId)
          .order('created_at', { ascending: false })
          .limit(5),
      ])

      setStats({
        totalPropiedades: propRes.count ?? 0,
        propiedadesActivas: activasRes.count ?? 0,
        consultasSinLeer: consultasRes.count ?? 0,
        destacadas: destacadasRes.count ?? 0,
      })

      if (recentRes.data) {
        setConsultas(recentRes.data as unknown as ConsultaWithProp[])
      }
      setLoading(false)
    }

    fetchData()
  }, [profile?.organizacion_id])

  const statCards = [
    { label: 'Total propiedades', value: stats.totalPropiedades, icon: Building2, color: 'text-primary' },
    { label: 'Activas', value: stats.propiedadesActivas, icon: Eye, color: 'text-secondary' },
    { label: 'Destacadas', value: stats.destacadas, icon: Star, color: 'text-warning' },
    { label: 'Consultas sin leer', value: stats.consultasSinLeer, icon: MessageSquare, color: 'text-error' },
  ]

  // Stagger animations for stat cards and consultas
  const statsStagger = useStaggerAppear(statCards.length, 50, 100)
  const consultasStagger = useStaggerAppear(consultas.length, 200, 80)

  useEffect(() => {
    if (!loading) {
      statsStagger.trigger()
      consultasStagger.trigger()
    }
  }, [loading]) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-8 w-48 skeleton-shimmer" />
          <div className="mt-2 h-4 w-64 skeleton-shimmer" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl border border-border bg-bg-card p-5">
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 skeleton-shimmer" />
                <div className="h-5 w-5 rounded skeleton-shimmer" />
              </div>
              <div className="mt-3 h-8 w-16 skeleton-shimmer" />
            </div>
          ))}
        </div>
        {/* Consultas skeleton */}
        <div className="rounded-xl border border-border bg-bg-card">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div className="h-5 w-40 skeleton-shimmer" />
            <div className="h-4 w-20 skeleton-shimmer" />
          </div>
          <div className="divide-y divide-border">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4 px-6 py-4">
                <div className="mt-1 h-2.5 w-2.5 rounded-full skeleton-shimmer" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 skeleton-shimmer" />
                  <div className="h-3 w-48 skeleton-shimmer" />
                  <div className="h-3 w-full skeleton-shimmer" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Bienvenido, {profile?.nombre || 'Administrador'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <div
            key={stat.label}
            className={`appear-ready rounded-xl border border-border bg-bg-card p-5 shadow-card ${statsStagger.appeared.has(i) ? 'appeared' : ''}`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-text-secondary">{stat.label}</p>
              <stat.icon size={20} className={stat.color} />
            </div>
            <p className="mt-2 text-3xl font-bold text-text-primary">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Consultas */}
      <div className="rounded-xl border border-border bg-bg-card shadow-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-text-primary">Consultas recientes</h2>
          <Link
            to="/admin/consultas"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-500"
          >
            Ver todas <ArrowRight size={14} />
          </Link>
        </div>

        {consultas.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-text-tertiary">
            No hay consultas todavía
          </div>
        ) : (
          <div className="divide-y divide-border">
            {consultas.map((c, i) => (
              <div
                key={c.id}
                className={`appear-ready flex items-start gap-4 px-6 py-4 ${consultasStagger.appeared.has(i) ? 'appeared' : ''}`}
              >
                <div
                  className={`mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full ${
                    c.leida ? 'bg-border' : 'bg-primary animate-pulse-dot'
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-medium text-text-primary">{c.nombre}</span>
                    {c.created_at && (
                      <span className="text-xs text-text-tertiary">
                        {formatDate(c.created_at)}
                      </span>
                    )}
                  </div>
                  {c.inmob_propiedades && (
                    <p className="text-xs text-primary">{c.inmob_propiedades.titulo}</p>
                  )}
                  <p className="mt-1 line-clamp-2 text-sm text-text-secondary">
                    {c.mensaje}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
