import { create } from 'zustand'

const MAX_COMPARE = 3

interface CompareState {
  compareIds: string[]
  toggleCompare: (id: string) => void
  isComparing: (id: string) => boolean
  clearCompare: () => void
  canAddMore: () => boolean
}

export const useCompareStore = create<CompareState>()((set, get) => ({
  compareIds: [],

  toggleCompare: (id: string) =>
    set((state) => {
      const exists = state.compareIds.includes(id)
      if (exists) {
        return { compareIds: state.compareIds.filter((cid) => cid !== id) }
      }
      if (state.compareIds.length >= MAX_COMPARE) {
        return state // max reached
      }
      return { compareIds: [...state.compareIds, id] }
    }),

  isComparing: (id: string) => get().compareIds.includes(id),

  clearCompare: () => set({ compareIds: [] }),

  canAddMore: () => get().compareIds.length < MAX_COMPARE,
}))
