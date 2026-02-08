import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Bed, Bath, Maximize, MapPin, Heart, GitCompareArrows } from 'lucide-react'
import Badge, { getOperacionBadgeVariant } from '@/components/ui/Badge'
import { formatPrice, formatSuperficie } from '@/lib/formatters'
import { TIPO_OPERACION_LABELS, TIPO_PROPIEDAD_LABELS } from '@/lib/constants'
import { useFavoritesStore } from '@/store/favoritesStore'
import { useCompareStore } from '@/store/compareStore'
import type { PropiedadConImagenes } from '@/types/property'

interface PropertyCardProps {
  property: PropiedadConImagenes
  className?: string
  /** Index for stagger animation delay */
  index?: number
}

export default function PropertyCard({ property, className = '', index }: PropertyCardProps) {
  const imagen = property.inmob_imagenes
    ?.sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
    .find((img) => img.es_principal) ?? property.inmob_imagenes?.[0]

  const ubicacion = [property.barrio, property.ciudad].filter(Boolean).join(', ')

  const isFavorite = useFavoritesStore((s) => s.favoriteIds.includes(property.id))
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite)
  const isComparing = useCompareStore((s) => s.compareIds.includes(property.id))
  const toggleCompare = useCompareStore((s) => s.toggleCompare)
  const canAddMore = useCompareStore((s) => s.compareIds.length < 3)

  // Transition-based stagger: start hidden, appear after delay
  const [appeared, setAppeared] = useState(index === undefined)
  useEffect(() => {
    if (index === undefined) return
    const t = setTimeout(() => setAppeared(true), 50 + index * 80)
    return () => clearTimeout(t)
  }, [index])

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(property.id)
  }

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isComparing && !canAddMore) return
    toggleCompare(property.id)
  }

  return (
    <Link
      to={`/propiedades/${property.slug}`}
      className={`group block overflow-hidden rounded-[var(--radius-card)] border border-border bg-bg-card shadow-card transition-all duration-[var(--transition-base)] hover:-translate-y-1 hover:shadow-card-hover ${index !== undefined ? 'appear-ready' : ''} ${appeared ? 'appeared' : ''} ${className}`}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-bg-subtle">
        {imagen ? (
          <img
            src={imagen.url}
            alt={imagen.alt_text ?? property.titulo}
            className="h-full w-full object-cover transition-transform duration-[var(--transition-slow)] group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-text-tertiary">
            Sin imagen
          </div>
        )}

        {/* Badge operacion */}
        <div className="absolute left-3 top-3">
          <Badge variant={getOperacionBadgeVariant(property.tipo_operacion)}>
            {TIPO_OPERACION_LABELS[property.tipo_operacion]}
          </Badge>
        </div>

        {/* Tipo propiedad */}
        <div className="absolute right-3 top-3">
          <Badge variant="neutral">
            {TIPO_PROPIEDAD_LABELS[property.tipo_propiedad]}
          </Badge>
        </div>

        {/* Action buttons */}
        <div className="absolute bottom-3 right-3 flex gap-2">
          <button
            onClick={handleCompare}
            title={isComparing ? 'Quitar de comparar' : 'Comparar'}
            className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-all ${
              isComparing
                ? 'bg-primary text-white'
                : 'bg-white/80 text-text-secondary hover:bg-white hover:text-primary'
            } ${!isComparing && !canAddMore ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <GitCompareArrows size={16} />
          </button>
          <button
            onClick={handleFavorite}
            title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-all ${
              isFavorite
                ? 'bg-red-500 text-white'
                : 'bg-white/80 text-text-secondary hover:bg-white hover:text-red-500'
            }`}
          >
            <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <p
          className={`text-xl font-bold ${
            property.moneda === 'USD' ? 'text-accent-usd' : 'text-accent-ars'
          }`}
        >
          {formatPrice(property.precio, property.moneda)}
        </p>

        {/* Title */}
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-text-primary">
          {property.titulo}
        </h3>

        {/* Location */}
        {ubicacion && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-text-secondary">
            <MapPin size={12} className="shrink-0" />
            {ubicacion}
          </p>
        )}

        {/* Specs */}
        <div className="mt-3 flex items-center gap-4 border-t border-border pt-3 text-xs text-text-secondary">
          {property.dormitorios != null && property.dormitorios > 0 && (
            <span className="flex items-center gap-1">
              <Bed size={14} />
              {property.dormitorios} {property.dormitorios === 1 ? 'dorm.' : 'dorms.'}
            </span>
          )}
          {property.banos != null && property.banos > 0 && (
            <span className="flex items-center gap-1">
              <Bath size={14} />
              {property.banos} {property.banos === 1 ? 'bano' : 'banos'}
            </span>
          )}
          {property.superficie_total != null && property.superficie_total > 0 && (
            <span className="flex items-center gap-1">
              <Maximize size={14} />
              {formatSuperficie(property.superficie_total)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
