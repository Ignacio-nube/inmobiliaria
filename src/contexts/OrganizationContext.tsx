import { createContext, useContext, type ReactNode } from 'react'
import { useOrganization as useOrganizationHook } from '@/hooks/useOrganization'
import type { Organizacion } from '@/types/property'

interface OrganizationContextType {
  organization: Organizacion | null
  loading: boolean
  error: string | null
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined)

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const { organization, loading, error } = useOrganizationHook()

  return (
    <OrganizationContext.Provider value={{ organization, loading, error }}>
      {children}
    </OrganizationContext.Provider>
  )
}

export function useOrganization() {
  const context = useContext(OrganizationContext)
  if (context === undefined) {
    // Fallback to the hook if used outside provider, or throw error?
    // For this app, we'll return the hook results but it might cause multiple fetches
    return useOrganizationHook()
  }
  return context
}
