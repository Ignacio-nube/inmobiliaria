import { Link } from 'react-router'
import { Heart, Trash2, ArrowLeft } from 'lucide-react'
import PropertyCard from '@/components/property/PropertyCard'
import { usePropertiesByIds } from '@/hooks/useProperties'
import { useFavoritesStore } from '@/store/favoritesStore'
import { useSEO } from '@/hooks/useSEO'
import Button from '@/components/ui/Button'

export default function FavoritesPage() {
  const favoriteIds = useFavoritesStore((s) => s.favoriteIds)
  const clearFavorites = useFavoritesStore((s) => s.clearFavorites)
  const { properties, loading } = usePropertiesByIds(favoriteIds)

  useSEO({
    title: 'Favoritos',
    description: 'Tus propiedades guardadas como favoritas.',
  })

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
            <Heart size={28} className="mr-2 inline text-red-500" fill="currentColor" />
            Mis Favoritos
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {favoriteIds.length === 0
              ? 'No tenés propiedades guardadas'
              : `${favoriteIds.length} propiedad${favoriteIds.length !== 1 ? 'es' : ''} guardada${favoriteIds.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {favoriteIds.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFavorites}
          >
            <Trash2 size={16} />
            Limpiar favoritos
          </Button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: favoriteIds.length }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[16/10] rounded-t-[var(--radius-card)] bg-bg-subtle" />
              <div className="rounded-b-[var(--radius-card)] border border-t-0 border-border p-4 space-y-3">
                <div className="h-6 w-2/3 rounded bg-bg-subtle" />
                <div className="h-4 w-1/2 rounded bg-bg-subtle" />
                <div className="h-4 w-full rounded bg-bg-subtle" />
              </div>
            </div>
          ))}
        </div>
      ) : favoriteIds.length === 0 ? (
        <div className="py-16 text-center">
          <Heart size={64} className="mx-auto text-text-tertiary/30" />
          <h2 className="mt-4 text-xl font-semibold text-text-primary">
            No tenés favoritos guardados
          </h2>
          <p className="mt-2 text-text-secondary">
            Hacé click en el corazón de cualquier propiedad para guardarla.
          </p>
          <Link to="/propiedades" className="mt-6 inline-block">
            <Button variant="primary">Ver propiedades</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  )
}
