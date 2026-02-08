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
import Badge, { getOperacionBadgeVariant } from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import {
  formatPrice,
  formatSuperficie,
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
    <div className="grid border-b border-border" style={{ gridTemplateColumns: `160px repeat(${values.length}, 1fr)` }}>
      <div className="bg-bg-subtle px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">
        {label}
      </div>
      {values.map((val, i) => (
        <div
          key={i}
          className={`px-4 py-3 text-sm text-text-primary ${highlight ? 'font-semibold' : ''}`}
        >
          {val ?? '-'}
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
      <div className="container-app py-16 text-center">
        <Ruler size={64} className="mx-auto text-text-tertiary/30" />
        <h2 className="mt-4 text-xl font-semibold text-text-primary">
          No hay propiedades para comparar
        </h2>
        <p className="mt-2 text-text-secondary">
          Seleccioná hasta 3 propiedades usando el botón de comparar en cada card.
        </p>
        <Link to="/propiedades" className="mt-6 inline-block">
          <Button variant="primary">Ver propiedades</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container-app py-6 lg:py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/propiedades"
            className="mb-2 inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary"
          >
            <ArrowLeft size={16} />
            Volver a propiedades
          </Link>
          <h1 className="text-2xl font-bold text-text-primary md:text-3xl">
            Comparar propiedades
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {properties.length} propiedad{properties.length !== 1 ? 'es' : ''} seleccionada{properties.length !== 1 ? 's' : ''}
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={clearCompare}>
          <Trash2 size={16} />
          Limpiar comparación
        </Button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-48 rounded-[var(--radius-card)] bg-bg-subtle" />
          <div className="h-64 rounded-[var(--radius-card)] bg-bg-subtle" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius-card)] border border-border bg-bg-card">
          {/* Property images & titles */}
          <div
            className="grid border-b border-border"
            style={{ gridTemplateColumns: `160px repeat(${properties.length}, 1fr)` }}
          >
            <div className="bg-bg-subtle" />
            {properties.map((p) => (
              <div key={p.id} className="relative p-4">
                <button
                  onClick={() => toggleCompare(p.id)}
                  className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-bg-subtle text-text-secondary hover:bg-red-100 hover:text-red-500 transition-colors"
                  title="Quitar de comparación"
                >
                  <X size={14} />
                </button>
                <Link to={`/propiedades/${p.slug}`}>
                  {getImage(p) ? (
                    <img
                      src={getImage(p)!}
                      alt={p.titulo}
                      className="aspect-[16/10] w-full rounded-lg object-cover"
                    />
                  ) : (
                    <div className="aspect-[16/10] w-full rounded-lg bg-bg-subtle flex items-center justify-center text-text-tertiary text-sm">
                      Sin imagen
                    </div>
                  )}
                  <h3 className="mt-3 text-sm font-semibold text-text-primary line-clamp-2 hover:text-primary transition-colors">
                    {p.titulo}
                  </h3>
                </Link>
                <div className="mt-2 flex gap-2">
                  <Badge variant={getOperacionBadgeVariant(p.tipo_operacion)}>
                    {TIPO_OPERACION_LABELS[p.tipo_operacion]}
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
