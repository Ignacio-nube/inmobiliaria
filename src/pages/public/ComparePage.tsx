import { Link } from 'react-router'
import {
  ArrowLeft,
  X,
  Ruler,
  Trash2,
} from 'lucide-react'
import { usePropertiesByIds } from '@/hooks/useProperties'
import { useCompareStore } from '@/store/compareStore'
import { useSEO } from '@/hooks/useSEO'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import {
  formatPrice,
  formatSuperficie,
  getOperacionBadgeVariant,
} from '@/lib/formatters'
import {
  TIPO_OPERACION_LABELS,
  TIPO_PROPIEDAD_LABELS,
  ANTIGUEDAD_LABELS,
} from '@/lib/constants'
import type { PropiedadConImagenes } from '@/types/property'

function CompareValue({
  label,
  values,
  highlight = false,
}: {
  label: string
  values: (string | number | null | undefined)[]
  highlight?: boolean
}) {
  return (
    <div className="grid border-b border-border group" style={{ gridTemplateColumns: `180px repeat(${values.length}, 1fr)` }}>
      <div className="bg-bg-subtle px-6 py-4 text-[10px] font-black text-text-tertiary uppercase tracking-widest flex items-center border-r border-border/50 group-hover:text-primary transition-colors">
        {label}
      </div>
      {values.map((val, i) => (
        <div
          key={i}
          className={`px-6 py-4 text-sm text-text-primary flex items-center ${highlight ? 'font-bold text-lg text-primary' : ''} ${i < values.length - 1 ? 'border-r border-border/30' : ''}`}
        >
          {val ?? <span className="text-text-tertiary/40">-</span>}
        </div>
      ))}
    </div>
  )
}

export default function ComparePage() {
  const compareIds = useCompareStore((s) => s.compareIds)
  const toggleCompare = useCompareStore((s) => s.toggleCompare)
  const clearCompare = useCompareStore((s) => s.clearCompare)
  const { properties, loading } = usePropertiesByIds(compareIds)

  useSEO({
    title: 'Comparar propiedades',
    description: 'Compará propiedades lado a lado.',
  })

  const getImage = (p: PropiedadConImagenes) => {
    const img = p.inmob_imagenes
      ?.sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
      .find((i) => i.es_principal) ?? p.inmob_imagenes?.[0]
    return img?.url
  }

  if (compareIds.length === 0) {
    return (
      <div className="container-app py-24 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-bg-subtle text-text-tertiary/30">
          <Ruler size={40} />
        </div>
        <h2 className="text-2xl font-extrabold text-text-primary">
          No hay propiedades para comparar
        </h2>
        <p className="mt-3 text-text-secondary max-w-sm mx-auto">
          Seleccioná hasta 3 propiedades usando el botón de comparar en cada ficha para ver sus diferencias.
        </p>
        <Link to="/propiedades" className="mt-10 inline-block">
          <Button size="lg" className="rounded-full px-8">Ver propiedades</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container-app py-6 lg:py-8">
      {/* Header */}
      <div className="relative mb-8 overflow-hidden rounded-[var(--radius-card)] border border-border bg-bg-card shadow-sm transition-all hover:shadow-md">
        {/* Decorative background element */}
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-primary/8 blur-2xl" />
        
        <div className="relative flex flex-col gap-4 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-10">
          <div>
            <Link
              to="/propiedades"
              className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-text-tertiary hover:text-primary transition-colors"
            >
              <ArrowLeft size={14} />
              Volver a propiedades
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary md:text-4xl">
              Comparar propiedades
            </h1>
            <p className="mt-2 text-sm font-medium text-text-secondary">
              {properties.length} propiedad{properties.length !== 1 ? 'es' : ''} seleccionada{properties.length !== 1 ? 's' : ''}
            </p>
          </div>

          <Button variant="outline" size="sm" onClick={clearCompare} className="bg-bg-card self-start md:self-center">
            <Trash2 size={16} />
            Limpiar comparación
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-64 rounded-[var(--radius-card)] bg-bg-subtle" />
          <div className="h-96 rounded-[var(--radius-card)] bg-bg-subtle" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius-card)] border border-border bg-bg-card shadow-lg">
          {/* Property images & titles */}
          <div
            className="grid border-b border-border"
            style={{ gridTemplateColumns: `180px repeat(${properties.length}, 1fr)` }}
          >
            <div className="bg-bg-subtle border-r border-border/50" />
            {properties.map((p, idx) => (
              <div key={p.id} className={`relative p-6 ${idx < properties.length - 1 ? 'border-r border-border/30' : ''}`}>
                <button
                  onClick={() => toggleCompare(p.id)}
                  className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-text-secondary shadow-sm hover:bg-red-50 hover:text-red-600 transition-all active:scale-95"
                  title="Quitar de comparación"
                >
                  <X size={16} />
                </button>
                <Link to={`/propiedades/${p.slug}`} className="group block">
                  <div className="overflow-hidden rounded-xl bg-bg-subtle ring-1 ring-border/50 transition-all group-hover:ring-primary/30">
                    {getImage(p) ? (
                      <img
                        src={getImage(p)!}
                        alt={p.titulo}
                        className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="aspect-[4/3] w-full flex items-center justify-center text-text-tertiary text-xs font-medium">
                        Sin imagen
                      </div>
                    )}
                  </div>
                  <h3 className="mt-4 text-base font-bold text-text-primary leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                    {p.titulo}
                  </h3>
                </Link>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant={getOperacionBadgeVariant(p.tipo_operacion)} className="text-[10px]">
                    {TIPO_OPERACION_LABELS[p.tipo_operacion]}
                  </Badge>
                  <Badge variant="neutral" className="text-[10px]">
                    {TIPO_PROPIEDAD_LABELS[p.tipo_propiedad]}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison rows */}
          <CompareValue
            label="Precio"
            values={properties.map((p) => formatPrice(p.precio, p.moneda))}
            highlight
          />
          <CompareValue
            label="Tipo"
            values={properties.map((p) => TIPO_PROPIEDAD_LABELS[p.tipo_propiedad])}
          />
          <CompareValue
            label="Ubicación"
            values={properties.map((p) =>
              [p.barrio, p.ciudad, p.provincia].filter(Boolean).join(', ')
            )}
          />
          <CompareValue
            label="Dormitorios"
            values={properties.map((p) => p.dormitorios)}
          />
          <CompareValue
            label="Baños"
            values={properties.map((p) => p.banos)}
          />
          <CompareValue
            label="Sup. Total"
            values={properties.map((p) =>
              p.superficie_total ? formatSuperficie(p.superficie_total) : null
            )}
          />
          <CompareValue
            label="Sup. Cubierta"
            values={properties.map((p) =>
              p.superficie_cubierta ? formatSuperficie(p.superficie_cubierta) : null
            )}
          />
          <CompareValue
            label="Cochera"
            values={properties.map((p) => (p.cochera ? 'Sí' : 'No'))}
          />
          <CompareValue
            label="Antigüedad"
            values={properties.map((p) =>
              p.antiguedad ? ANTIGUEDAD_LABELS[p.antiguedad] : null
            )}
          />
          <CompareValue
            label="Amenities"
            values={properties.map((p) => {
              const amenities = p.amenities as string[] | null
              return amenities?.length ? amenities.join(', ') : null
            })}
          />
        </div>
      )}
    </div>
  )
}
