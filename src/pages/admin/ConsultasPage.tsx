import { useEffect, useState, useCallback } from 'react'
import {
  MessageSquare,
  Mail,
  Phone,
  CheckCircle2,
  Circle,
  ExternalLink,
  Trash2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { formatDate } from '@/lib/formatters'
import Button from '@/components/ui/Button'

interface ConsultaRow {
  id: string
  nombre: string
  email: string | null
  telefono: string | null
  mensaje: string
  leida: boolean | null
  created_at: string | null
  propiedad_id: string | null
  inmob_propiedades: { titulo: string; slug: string } | null
}

export default function ConsultasPage() {
  const { profile } = useAuth()
  const [consultas, setConsultas] = useState<ConsultaRow[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'todas' | 'sin_leer' | 'leidas'>('todas')

  const fetchConsultas = useCallback(async () => {
    if (!profile?.organizacion_id) return
    setLoading(true)

    let query = supabase
      .from('inmob_consultas')
      .select('*, inmob_propiedades(titulo, slug)')
      .eq('organizacion_id', profile.organizacion_id)
      .order('created_at', { ascending: false })

    if (filter === 'sin_leer') {
      query = query.eq('leida', false)
    } else if (filter === 'leidas') {
      query = query.eq('leida', true)
    }

    const { data } = await query
    setConsultas((data as unknown as ConsultaRow[]) ?? [])
    setLoading(false)
  }, [profile?.organizacion_id, filter])

  useEffect(() => {
    fetchConsultas()
  }, [fetchConsultas])

  async function toggleLeida(id: string, current: boolean | null) {
    const newVal = !current
    await supabase
      .from('inmob_consultas')
      .update({ leida: newVal })
      .eq('id', id)
    setConsultas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, leida: newVal } : c))
    )
  }

  async function deleteConsulta(id: string) {
    if (!confirm('¿Eliminar esta consulta?')) return
    const { error } = await supabase.from('inmob_consultas').delete().eq('id', id)
    if (error) { toast.error('Error al eliminar'); return }
    setConsultas((prev) => prev.filter((c) => c.id !== id))
    toast.success('Consulta eliminada')
  }

  async function markAllRead() {
    if (!profile?.organizacion_id) return
    await supabase
      .from('inmob_consultas')
      .update({ leida: true })
      .eq('organizacion_id', profile.organizacion_id)
      .eq('leida', false)
    setConsultas((prev) => prev.map((c) => ({ ...c, leida: true })))
    toast.success('Todas marcadas como leidas')
  }

  const sinLeer = consultas.filter((c) => !c.leida).length

  const filterTabs: { value: typeof filter; label: string }[] = [
    { value: 'todas', label: 'Todas' },
    { value: 'sin_leer', label: 'Sin leer' },
    { value: 'leidas', label: 'Leídas' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Consultas</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {sinLeer > 0 ? `${sinLeer} sin leer` : 'Todas leídas'}
          </p>
        </div>
        {sinLeer > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <CheckCircle2 size={16} />
            Marcar todas como leídas
          </Button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 rounded-lg border border-border bg-bg-card p-1 w-fit">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setFilter(tab.value)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === tab.value
                ? 'bg-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-xl border border-border bg-bg-card"
            />
          ))}
        </div>
      ) : consultas.length === 0 ? (
        <div className="rounded-xl border border-border bg-bg-card px-6 py-16 text-center">
          <MessageSquare size={40} className="mx-auto text-text-tertiary" />
          <p className="mt-4 text-text-secondary">No hay consultas</p>
        </div>
      ) : (
        <div className="space-y-3">
          {consultas.map((c) => (
            <div
              key={c.id}
              className={`rounded-xl border bg-bg-card p-5 transition-colors ${
                c.leida
                  ? 'border-border'
                  : 'border-primary/30 bg-primary-50/30'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {!c.leida && (
                      <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                    )}
                    <span className="font-semibold text-text-primary">
                      {c.nombre}
                    </span>
                    {c.created_at && (
                      <span className="text-xs text-text-tertiary">
                        {formatDate(c.created_at)}
                      </span>
                    )}
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-text-secondary">
                    {c.email && (
                      <a
                        href={`mailto:${c.email}`}
                        className="flex items-center gap-1 hover:text-primary"
                      >
                        <Mail size={14} />
                        {c.email}
                      </a>
                    )}
                    {c.telefono && (
                      <a
                        href={`tel:${c.telefono}`}
                        className="flex items-center gap-1 hover:text-primary"
                      >
                        <Phone size={14} />
                        {c.telefono}
                      </a>
                    )}
                  </div>

                  {c.inmob_propiedades && (
                    <a
                      href={`/propiedades/${c.inmob_propiedades.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      {c.inmob_propiedades.titulo}
                      <ExternalLink size={10} />
                    </a>
                  )}

                  <p className="mt-2 text-sm text-text-primary">{c.mensaje}</p>
                </div>

                <div className="flex flex-shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => toggleLeida(c.id, c.leida)}
                    className="rounded-lg p-2 text-text-tertiary hover:bg-bg-subtle hover:text-primary"
                    title={c.leida ? 'Marcar como no leída' : 'Marcar como leída'}
                  >
                    {c.leida ? (
                      <Circle size={18} />
                    ) : (
                      <CheckCircle2 size={18} />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteConsulta(c.id)}
                    className="rounded-lg p-2 text-text-tertiary hover:bg-bg-subtle hover:text-error"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
