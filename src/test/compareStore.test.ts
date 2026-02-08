import { describe, it, expect, beforeEach } from 'vitest'
import { useCompareStore } from '@/store/compareStore'

describe('compareStore', () => {
  beforeEach(() => {
    useCompareStore.setState({ compareIds: [] })
  })

  it('empieza vacío', () => {
    expect(useCompareStore.getState().compareIds).toEqual([])
  })

  it('agrega una propiedad a comparar', () => {
    useCompareStore.getState().toggleCompare('prop-1')
    expect(useCompareStore.getState().compareIds).toEqual(['prop-1'])
  })

  it('quita una propiedad al togglear de nuevo', () => {
    useCompareStore.getState().toggleCompare('prop-1')
    useCompareStore.getState().toggleCompare('prop-1')
    expect(useCompareStore.getState().compareIds).toEqual([])
  })

  it('permite máximo 3 propiedades', () => {
    const store = useCompareStore.getState()
    store.toggleCompare('prop-1')
    store.toggleCompare('prop-2')
    store.toggleCompare('prop-3')
    store.toggleCompare('prop-4') // no debería agregarse
    expect(useCompareStore.getState().compareIds).toEqual(['prop-1', 'prop-2', 'prop-3'])
  })

  it('permite quitar cuando está lleno y agregar otra', () => {
    const store = useCompareStore.getState()
    store.toggleCompare('prop-1')
    store.toggleCompare('prop-2')
    store.toggleCompare('prop-3')
    store.toggleCompare('prop-2') // quitar
    store.toggleCompare('prop-4') // ahora sí
    expect(useCompareStore.getState().compareIds).toEqual(['prop-1', 'prop-3', 'prop-4'])
  })

  it('isComparing funciona correctamente', () => {
    useCompareStore.getState().toggleCompare('prop-1')
    expect(useCompareStore.getState().isComparing('prop-1')).toBe(true)
    expect(useCompareStore.getState().isComparing('prop-2')).toBe(false)
  })

  it('canAddMore retorna false cuando hay 3', () => {
    const store = useCompareStore.getState()
    store.toggleCompare('prop-1')
    store.toggleCompare('prop-2')
    store.toggleCompare('prop-3')
    expect(useCompareStore.getState().canAddMore()).toBe(false)
  })

  it('canAddMore retorna true cuando hay menos de 3', () => {
    useCompareStore.getState().toggleCompare('prop-1')
    expect(useCompareStore.getState().canAddMore()).toBe(true)
  })

  it('clearCompare limpia todos', () => {
    const store = useCompareStore.getState()
    store.toggleCompare('prop-1')
    store.toggleCompare('prop-2')
    store.clearCompare()
    expect(useCompareStore.getState().compareIds).toEqual([])
  })
})
