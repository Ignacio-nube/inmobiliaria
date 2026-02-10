import { useFilterStore } from '@/store/filterStore'
import type { PropertyFilters, SortOption } from '@/types/filters'

/**
 * Hook de conveniencia para acceder a filtros y acciones
 */
export function useFilters() {
  const filters = useFilterStore((s) => s.filters)
  const sortBy = useFilterStore((s) => s.sortBy)
  const page = useFilterStore((s) => s.page)
  const setFilter = useFilterStore((s) => s.setFilter)
  const setFilters = useFilterStore((s) => s.setFilters)
  const setSortBy = useFilterStore((s) => s.setSortBy)
  const setPage = useFilterStore((s) => s.setPage)
  const resetFilters = useFilterStore((s) => s.resetFilters)

  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0)
  ).length

  function getFilterLabel(key: keyof PropertyFilters): string {
    const labels: Record<keyof PropertyFilters, string> = {
      tipo_operacion: 'Operación',
      tipo_propiedad: 'Tipo',
      ciudad: 'Ciudad',
      barrio: 'Barrio',
      precio_min: 'Precio mín.',
      precio_max: 'Precio máx.',
      moneda: 'Moneda',
      dormitorios_min: 'Dormitorios',
      banos_min: 'Baños',
      superficie_min: 'Sup. mín.',
      superficie_max: 'Sup. máx.',
      cochera: 'Cochera',
      antiguedad: 'Antigüedad',
      amenities: 'Amenities',
    }
    return labels[key] ?? key
  }

  function removeFilter(key: keyof PropertyFilters) {
    setFilter(key, undefined as PropertyFilters[typeof key])
  }

  return {
    filters,
    sortBy,
    page,
    activeFilterCount,
    setFilter,
    setFilters,
    setSortBy: setSortBy as (sort: SortOption) => void,
    setPage,
    resetFilters,
    removeFilter,
    getFilterLabel,
  }
}
