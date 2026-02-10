/**
 * Color utility: generates full Tailwind-compatible color scales
 * from a single hex color, and applies theme overrides to CSS custom properties.
 */

// --- HSL helpers ---

function hexToHSL(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return [0, 0, 0]

  let r = parseInt(result[1], 16) / 255
  let g = parseInt(result[2], 16) / 255
  let b = parseInt(result[3], 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

function hslToHex(h: number, s: number, l: number): string {
  const sNorm = s / 100
  const lNorm = l / 100

  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = lNorm - c / 2

  let r = 0, g = 0, b = 0
  if (h < 60) { r = c; g = x; b = 0 }
  else if (h < 120) { r = x; g = c; b = 0 }
  else if (h < 180) { r = 0; g = c; b = x }
  else if (h < 240) { r = 0; g = x; b = c }
  else if (h < 300) { r = x; g = 0; b = c }
  else { r = c; g = 0; b = x }

  const toHex = (v: number) => {
    const hex = Math.round((v + m) * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/**
 * Generate a 10-step color scale (50, 100..900) from a base hex color.
 * The base color is placed at the 600 position (common for primary brand colors).
 */
export function generateColorScale(hex: string): Record<string, string> {
  const [h, s, _l] = hexToHSL(hex)

  // Lightness steps from 50 (lightest) to 900 (darkest)
  // Designed so the input color lands roughly at 500-600
  const steps: [string, number, number][] = [
    ['50', Math.min(s, 20), 96],
    ['100', Math.min(s, 35), 90],
    ['200', Math.min(s, 50), 82],
    ['300', Math.round(s * 0.8), 70],
    ['400', Math.round(s * 0.9), 58],
    ['500', s, 48],
    ['600', s, _l],           // original color at 600
    ['700', s, Math.max(_l - 8, 15)],
    ['800', s, Math.max(_l - 15, 12)],
    ['900', s, Math.max(_l - 22, 8)],
  ]

  const scale: Record<string, string> = {}
  for (const [step, sat, lig] of steps) {
    scale[step] = hslToHex(h, sat, lig)
  }

  return scale
}

/**
 * Apply a full color scale to CSS custom properties on :root
 */
export function applyColorScale(
  prefix: string,
  hex: string,
): void {
  const scale = generateColorScale(hex)
  const root = document.documentElement

  for (const [step, color] of Object.entries(scale)) {
    root.style.setProperty(`--color-${prefix}-${step}`, color)
  }
  // Also set the bare --color-{prefix} to the input value
  root.style.setProperty(`--color-${prefix}`, hex)
}

/**
 * Apply accent color (no scale needed, just the bare value)
 */
export function applyAccentColor(name: string, hex: string): void {
  document.documentElement.style.setProperty(`--color-${name}`, hex)
}

/**
 * Apply theme design tokens (backgrounds, borders, text colors, shadows, etc.)
 * for different visual themes like "liquid-glass"
 */
export type ThemeDesign = 'default' | 'liquid-glass' | 'futuristic' | 'minimal-bento' | 'neo-pop' | 'luxury'

export interface ThemeDesignTokens {
  // Backgrounds
  bgPrimary: string
  bgCard: string
  bgSubtle: string
  // Text
  textPrimary: string
  textSecondary: string
  textTertiary: string
  // Borders
  border: string
  borderFocus: string
  // Shadows
  shadowCard: string
  shadowCardHover: string
  shadowNavbar: string
  // Radius
  radiusCard: string
  radiusButton: string
  radiusInput: string
  // Glass-specific
  cardBackdrop?: string
  cardBg?: string
  cardBorder?: string
}

const DEFAULT_TOKENS: ThemeDesignTokens = {
  bgPrimary: '#f8f9fa',
  bgCard: '#ffffff',
  bgSubtle: '#eef1f4',
  textPrimary: '#1a1a2e',
  textSecondary: '#6b7280',
  textTertiary: '#9ca3af',
  border: '#e5e7eb',
  borderFocus: '#1b4965',
  shadowCard: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
  shadowCardHover: '0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.06)',
  shadowNavbar: '0 1px 3px rgba(0, 0, 0, 0.1)',
  radiusCard: '0.75rem',
  radiusButton: '0.5rem',
  radiusInput: '0.5rem',
}

const LUXURY_TOKENS: ThemeDesignTokens = {
  bgPrimary: '#fafaf9', // Stone-50
  bgCard: '#ffffff',
  bgSubtle: '#f5f5f4', // Stone-100
  textPrimary: '#1c1917', // Stone-900
  textSecondary: '#44403c', // Stone-700
  textTertiary: '#78716c', // Stone-500
  border: '#e7e5e4', // Stone-200
  borderFocus: '#d6d3d1', // Stone-300
  shadowCard: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)', // Very subtle
  shadowCardHover: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.01)', // Soft lift
  shadowNavbar: 'none',
  radiusCard: '0.5rem', // Refined
  radiusButton: '0.25rem', // Slight soft
  radiusInput: '0.25rem',
}

const LIQUID_GLASS_TOKENS: ThemeDesignTokens = {
  bgPrimary: '#0f0f1a',
  bgCard: 'rgba(255, 255, 255, 0.06)',
  bgSubtle: 'rgba(255, 255, 255, 0.03)',
  textPrimary: '#f0f0f5',
  textSecondary: '#a0a0b8',
  textTertiary: '#6b6b80',
  border: 'rgba(255, 255, 255, 0.10)',
  borderFocus: 'rgba(255, 255, 255, 0.3)',
  shadowCard: '0 4px 30px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
  shadowCardHover: '0 8px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.12)',
  shadowNavbar: '0 2px 20px rgba(0, 0, 0, 0.3), inset 0 -1px 0 rgba(255,255,255,0.06)',
  radiusCard: '1rem',
  radiusButton: '0.75rem',
  radiusInput: '0.75rem',
  cardBackdrop: 'blur(20px) saturate(180%)',
  cardBg: 'rgba(255, 255, 255, 0.06)',
  cardBorder: 'rgba(255, 255, 255, 0.12)',
}

const FUTURISTIC_TOKENS: ThemeDesignTokens = {
  bgPrimary: '#030712', // Very dark blue/gray (Tailwind gray-950)
  bgCard: 'rgba(17, 24, 39, 0.7)', // gray-900 with opacity
  bgSubtle: 'rgba(31, 41, 55, 0.5)', // gray-800
  textPrimary: '#f9fafb', // gray-50
  textSecondary: '#9ca3af', // gray-400
  textTertiary: '#6b7280', // gray-500
  border: 'rgba(55, 65, 81, 0.5)', // gray-700
  borderFocus: '#6366f1', // Indigo-500
  shadowCard: '0 0 0 1px rgba(255,255,255,0.05), 0 4px 6px -1px rgba(0, 0, 0, 0.5)',
  shadowCardHover: '0 0 0 1px rgba(99, 102, 241, 0.5), 0 0 15px rgba(99, 102, 241, 0.3)', // Neon glow on hover
  shadowNavbar: '0 1px 0 rgba(255,255,255,0.1)',
  radiusCard: '24px', // Super rounded
  radiusButton: '9999px', // Pill buttons
  radiusInput: '12px',
  cardBackdrop: 'blur(12px)',
  cardBg: 'rgba(17, 24, 39, 0.7)',
  cardBorder: 'rgba(255, 255, 255, 0.08)',
}

const MINIMAL_BENTO_TOKENS: ThemeDesignTokens = {
  bgPrimary: '#f9fafb', // gray-50
  bgCard: '#ffffff',
  bgSubtle: '#f3f4f6', // gray-100
  textPrimary: '#111827', // gray-900 (High contrast)
  textSecondary: '#4b5563', // gray-600
  textTertiary: '#9ca3af', // gray-400
  border: '#e5e7eb', // gray-200
  borderFocus: '#000000', // Black focus
  shadowCard: 'none', // Flat design
  shadowCardHover: '4px 4px 0px 0px rgba(0,0,0,1)', // Brutalist shadow
  shadowNavbar: '0 1px 0 rgba(0,0,0,0.05)',
  radiusCard: '0px', // Sharp
  radiusButton: '0px', // Sharp
  radiusInput: '0px', // Sharp
}

const NEO_POP_TOKENS: ThemeDesignTokens = {
  bgPrimary: '#fff1f2', // Light pink background
  bgCard: '#ffffff',
  bgSubtle: '#fffce8', // Light yellow
  textPrimary: '#000000',
  textSecondary: '#1a1a1a',
  textTertiary: '#404040',
  border: '#000000', // Solid black borders
  borderFocus: '#000000',
  shadowCard: '4px 4px 0px 0px #000000', // Hard shadow
  shadowCardHover: '8px 8px 0px 0px #000000', // Bigger hard shadow
  shadowNavbar: '0 2px 0 #000000',
  radiusCard: '12px',
  radiusButton: '8px',
  radiusInput: '8px',
}

export function getThemeTokens(design: ThemeDesign): ThemeDesignTokens {
  if (design === 'futuristic') return FUTURISTIC_TOKENS
  if (design === 'minimal-bento') return MINIMAL_BENTO_TOKENS
  if (design === 'neo-pop') return NEO_POP_TOKENS
  if (design === 'luxury') return LUXURY_TOKENS
  return design === 'liquid-glass' ? LIQUID_GLASS_TOKENS : DEFAULT_TOKENS
}

export function applyThemeDesign(design: ThemeDesign, primaryHex?: string): void {
  const tokens = getThemeTokens(design)
  const root = document.documentElement

  // Core design tokens
  root.style.setProperty('--color-bg-primary', tokens.bgPrimary)
  root.style.setProperty('--color-bg-card', tokens.bgCard)
  root.style.setProperty('--color-bg-subtle', tokens.bgSubtle)
  root.style.setProperty('--color-text-primary', tokens.textPrimary)
  root.style.setProperty('--color-text-secondary', tokens.textSecondary)
  root.style.setProperty('--color-text-tertiary', tokens.textTertiary)
  root.style.setProperty('--color-border', tokens.border)
  root.style.setProperty('--color-border-focus', primaryHex ?? tokens.borderFocus)
  root.style.setProperty('--shadow-card', tokens.shadowCard)
  root.style.setProperty('--shadow-card-hover', tokens.shadowCardHover)
  root.style.setProperty('--shadow-navbar', tokens.shadowNavbar)
  root.style.setProperty('--radius-card', tokens.radiusCard)
  root.style.setProperty('--radius-button', tokens.radiusButton)
  root.style.setProperty('--radius-input', tokens.radiusInput)

  // Theme class for CSS-driven styling
  root.classList.remove('theme-default', 'theme-liquid-glass', 'theme-futuristic', 'theme-minimal-bento', 'theme-neo-pop', 'theme-luxury')
  root.classList.add(`theme-${design}`)
}

/**
 * Reset all custom properties to their original values (remove inline styles)
 */
export function resetTheme(): void {
  const root = document.documentElement
  const props = [
    '--color-primary-50', '--color-primary-100', '--color-primary-200', '--color-primary-300',
    '--color-primary-400', '--color-primary-500', '--color-primary-600', '--color-primary-700',
    '--color-primary-800', '--color-primary-900', '--color-primary',
    '--color-secondary-50', '--color-secondary-100', '--color-secondary-200', '--color-secondary-300',
    '--color-secondary-400', '--color-secondary-500', '--color-secondary-600', '--color-secondary-700',
    '--color-secondary-800', '--color-secondary-900', '--color-secondary',
    '--color-bg-primary', '--color-bg-card', '--color-bg-subtle',
    '--color-text-primary', '--color-text-secondary', '--color-text-tertiary',
    '--color-border', '--color-border-focus',
    '--shadow-card', '--shadow-card-hover', '--shadow-navbar',
    '--radius-card', '--radius-button', '--radius-input',
  ]
  props.forEach((p) => root.style.removeProperty(p))
  root.classList.remove('theme-default', 'theme-liquid-glass', 'theme-futuristic', 'theme-minimal-bento', 'theme-neo-pop', 'theme-luxury')
}
