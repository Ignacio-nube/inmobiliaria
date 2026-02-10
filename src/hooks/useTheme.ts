import { useEffect, useLayoutEffect } from 'react'
import type { Organizacion } from '@/types/property'
import type { ColoresOrganizacion } from '@/types/property'
import type { ThemeDesign } from '@/lib/colors'
import {
  applyColorScale,
  applyThemeDesign,
  resetTheme,
} from '@/lib/colors'

const STORAGE_KEY = 'inmob_theme_cache'

/**
 * Reads the organization's stored `colores` (primario, secundario, acento, tema)
 * and applies them as CSS custom property overrides on <html>.
 *
 * This makes all Tailwind `text-primary-*`, `bg-primary-*`, etc. classes
 * respond to the org's chosen palette dynamically.
 * 
 * Uses localStorage to prevent flash-of-unstyled-content (FOUC).
 */
export function useTheme(organization: Organizacion | null) {
  
  // Try to apply cached theme immediately before paint
  useLayoutEffect(() => {
    if (organization) return // If org is already here, let the main effect handle it

    try {
      const cached = localStorage.getItem(STORAGE_KEY)
      if (cached) {
        const { tema, primario, secundario } = JSON.parse(cached)
        
        // Apply cached values
        if (tema) applyThemeDesign(tema as ThemeDesign, primario)
        if (primario) applyColorScale('primary', primario)
        if (secundario) applyColorScale('secondary', secundario)
      }
    } catch (e) {
      console.error('Failed to load theme from cache', e)
    }
  }, [organization])

  useEffect(() => {
    if (!organization) return

    const colores = organization.colores as ColoresOrganizacion | null
    if (!colores) return

    const tema = (colores as Record<string, string>).tema as ThemeDesign | undefined

    // Apply theme design first (backgrounds, borders, shadows, etc.)
    applyThemeDesign(tema || 'default', colores.primario)

    // Apply primary color scale
    if (colores.primario) {
      applyColorScale('primary', colores.primario)
    }

    // Apply secondary color scale
    if (colores.secundario) {
      applyColorScale('secondary', colores.secundario)
    }

    // Cache settings for next visit
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        tema: tema || 'default',
        primario: colores.primario,
        secundario: colores.secundario
      }))
    } catch (e) {
      // ignore storage errors
    }

    // Clean up on unmount - restore defaults
    return () => {
      // Optional: we might NOT want to reset on unmount if we want to persist between page navigations
      // But keeping existing behavior for now
      resetTheme()
    }
  }, [organization])
}
