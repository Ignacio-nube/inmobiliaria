import { useState } from 'react'
import { SlidersHorizontal, Grid3X3 } from 'lucide-react'
import PropertyCard from '@/components/property/PropertyCard'
import FilterPanel, { FilterChips } from '@/components/search/FilterPanel'
import { useProperties } from '@/hooks/useProperties'
import { useOrganization } from '@/hooks/useOrganization'
import { useFilters } from '@/hooks/useFilters'
import { useSEO } from '@/hooks/useSEO'
import type { SortOption } from '@/types/filters'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'recientes', label: 'Mas recientes' },
  { value: 'precio_asc', label: 'Menor precio' },
  { value: 'precio_desc', label: 'Mayor precio' },
  { value: 'superficie_desc', label: 'Mayor superficie' },
  { value: 'superficie_asc', label: 'Menor superficie' },
]

export default function SearchResultsPage() {
  const { organization } = useOrganization()
  const { data: properties, count, totalPages, loading } = useProperties(organization?.id)
  const { sortBy, setSortBy, page, setPage, activeFilterCount } = useFilters()
  const [filtersOpen, setFiltersOpen] = useState(false)

  useSEO({
    title: 'Propiedades',
    description: 'Explorá propiedades en venta y alquiler. Filtrá por tipo, precio, ubicación y más.',
  })

  return (
    <div className="container-app py-6 lg:py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary md:text-3xl">Propiedades</h1>
        <p className="mt-1 text-sm text-text-secondary">
          {loading
            ? 'Buscando propiedades...'
            : `${count} propiedad${count !== 1 ? 'es' : ''} encontrada${count !== 1 ? 's' : ''}`}
        </p>
      </div>

      <div className="flex gap-8">
        {/* Desktop filter sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-20 rounded-[var(--radius-card)] border border-border bg-bg-card p-5">
            <FilterPanel />
          </div>
        </aside>

        {/* Results area */}
        <div className="min-w-0 flex-1">
          {/* Toolbar */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <FilterChips />

            <div className="ml-auto flex items-center gap-3">
              {/* Mobile filter toggle */}
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="flex items-center gap-2 rounded-[var(--radius-button)] border border-border px-3 py-2 text-sm font-medium text-text-primary hover:bg-bg-subtle lg:hidden"
              >
                <SlidersHorizontal size={16} />
                Filtros
                {activeFilterCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded-[var(--radius-input)] border border-border bg-bg-card px-3 py-2 text-sm outline-none focus:border-primary"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Property grid */}
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-[var(--radius-card)] border border-border bg-bg-card">
                  {/* Image skeleton with badges */}
                  <div className="relative aspect-[16/10] skeleton-shimmer">
                    <div className="absolute left-3 top-3 h-5 w-16 rounded-[var(--radius-badge)] bg-border/50" />
                    <div className="absolute right-3 top-3 h-5 w-14 rounded-[var(--radius-badge)] bg-border/50" />
                  </div>
                  {/* Content skeleton */}
                  <div className="space-y-3 p-4">
                    <div className="h-6 w-1/3 rounded bg-bg-subtle" />
                    <div className="h-4 w-2/3 rounded bg-bg-subtle" />
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-bg-subtle" />
                      <div className="h-3 w-24 rounded bg-bg-subtle" />
                    </div>
                    <div className="flex items-center gap-4 border-t border-border pt-3">
                      <div className="h-3 w-12 rounded bg-bg-subtle" />
                      <div className="h-3 w-12 rounded bg-bg-subtle" />
                      <div className="h-3 w-14 rounded bg-bg-subtle" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="animate-fade-in py-20 text-center">
              <Grid3X3 size={48} className="mx-auto text-text-tertiary" />
              <h3 className="mt-4 text-lg font-semibold text-text-primary">
                No encontramos propiedades
              </h3>
              <p className="mt-1 text-sm text-text-secondary">
                Proba ajustando los filtros para ver mas resultados.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {properties.map((prop, i) => (
                <PropertyCard key={prop.id} property={prop} index={i} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                className="rounded-[var(--radius-button)] border border-border px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-bg-subtle disabled:cursor-not-allowed disabled:opacity-50"
              >
                Anterior
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce<(number | 'dots')[]>((acc, p, i, arr) => {
                  if (i > 0 && arr[i - 1] !== p - 1) acc.push('dots')
                  acc.push(p)
                  return acc
                }, [])
                .map((item, i) =>
                  item === 'dots' ? (
                    <span key={`dots-${i}`} className="px-1 text-text-tertiary">...</span>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setPage(item)}
                      className={`h-9 w-9 rounded-[var(--radius-button)] text-sm font-medium transition-colors ${
                        item === page
                          ? 'bg-primary text-white'
                          : 'border border-border text-text-primary hover:bg-bg-subtle'
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}

              <button
                type="button"
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
                className="rounded-[var(--radius-button)] border border-border px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-bg-subtle disabled:cursor-not-allowed disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-fade lg:hidden"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-80 max-w-full animate-slide-in-right overflow-y-auto bg-bg-card p-5 shadow-xl lg:hidden">
            <FilterPanel onClose={() => setFiltersOpen(false)} />
          </div>
        </>
      )}
    </div>
  )
}
