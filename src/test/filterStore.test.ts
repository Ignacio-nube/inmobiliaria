import { describe, it, expect, beforeEach } from 'vitest'
import { useFilterStore } from '@/store/filterStore'

describe('filterStore', () => {
  beforeEach(() => {
    useFilterStore.setState({
      filters: {},
      sortBy: 'recientes',
      page: 1,
    })
  })

  it('empieza con filtros vacíos', () => {
    const state = useFilterStore.getState()
    expect(state.filters).toEqual({})
    expect(state.sortBy).toBe('recientes')
    expect(state.page).toBe(1)
  })

  it('setFilter actualiza un filtro y resetea page', () => {
    useFilterStore.getState().setPage(3)
    useFilterStore.getState().setFilter('tipo_operacion', 'venta')
    const state = useFilterStore.getState()
    expect(state.filters.tipo_operacion).toBe('venta')
    expect(state.page).toBe(1)
  })

  it('setFilters actualiza múltiples filtros', () => {
    useFilterStore.getState().setFilters({
      tipo_operacion: 'alquiler',
      ciudad: 'Rosario',
    })
    const state = useFilterStore.getState()
    expect(state.filters.tipo_operacion).toBe('alquiler')
    expect(state.filters.ciudad).toBe('Rosario')
  })

  it('setSortBy actualiza y resetea page', () => {
    useFilterStore.getState().setPage(5)
    useFilterStore.getState().setSortBy('precio_asc')
    const state = useFilterStore.getState()
    expect(state.sortBy).toBe('precio_asc')
    expect(state.page).toBe(1)
  })

  it('resetFilters limpia todo', () => {
    useFilterStore.getState().setFilters({
      tipo_operacion: 'venta',
      ciudad: 'Rosario',
    })
    useFilterStore.getState().setPage(3)
    useFilterStore.getState().resetFilters()
    const state = useFilterStore.getState()
    expect(state.filters).toEqual({})
    expect(state.page).toBe(1)
  })
})
