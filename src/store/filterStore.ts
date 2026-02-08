import { create } from 'zustand'
import type { PropertyFilters, SortOption } from '@/types/filters'

interface FilterState {
  filters: PropertyFilters
  sortBy: SortOption
  page: number
  setFilter: <K extends keyof PropertyFilters>(key: K, value: PropertyFilters[K]) => void
  setFilters: (filters: Partial<PropertyFilters>) => void
  setSortBy: (sort: SortOption) => void
  setPage: (page: number) => void
  resetFilters: () => void
}

const initialFilters: PropertyFilters = {}

export const useFilterStore = create<FilterState>((set) => ({
  filters: initialFilters,
  sortBy: 'recientes',
  page: 1,

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
      page: 1, // reset page on filter change
    })),

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      page: 1,
    })),

  setSortBy: (sortBy) => set({ sortBy, page: 1 }),

  setPage: (page) => set({ page }),

  resetFilters: () => set({ filters: initialFilters, page: 1 }),
}))
