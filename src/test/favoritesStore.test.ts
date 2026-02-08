import { describe, it, expect, beforeEach } from 'vitest'
import { useFavoritesStore } from '@/store/favoritesStore'

describe('favoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ favoriteIds: [] })
  })

  it('empieza vacío', () => {
    const { favoriteIds } = useFavoritesStore.getState()
    expect(favoriteIds).toEqual([])
  })

  it('agrega un favorito', () => {
    useFavoritesStore.getState().toggleFavorite('prop-1')
    expect(useFavoritesStore.getState().favoriteIds).toEqual(['prop-1'])
  })

  it('quita un favorito al togglear de nuevo', () => {
    useFavoritesStore.getState().toggleFavorite('prop-1')
    useFavoritesStore.getState().toggleFavorite('prop-1')
    expect(useFavoritesStore.getState().favoriteIds).toEqual([])
  })

  it('agrega múltiples favoritos', () => {
    const store = useFavoritesStore.getState()
    store.toggleFavorite('prop-1')
    store.toggleFavorite('prop-2')
    store.toggleFavorite('prop-3')
    expect(useFavoritesStore.getState().favoriteIds).toEqual(['prop-1', 'prop-2', 'prop-3'])
  })

  it('isFavorite retorna true para favoritos', () => {
    useFavoritesStore.getState().toggleFavorite('prop-1')
    expect(useFavoritesStore.getState().isFavorite('prop-1')).toBe(true)
    expect(useFavoritesStore.getState().isFavorite('prop-2')).toBe(false)
  })

  it('clearFavorites limpia todos', () => {
    const store = useFavoritesStore.getState()
    store.toggleFavorite('prop-1')
    store.toggleFavorite('prop-2')
    store.clearFavorites()
    expect(useFavoritesStore.getState().favoriteIds).toEqual([])
  })
})
