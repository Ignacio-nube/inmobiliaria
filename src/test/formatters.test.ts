import { describe, it, expect } from 'vitest'
import {
  formatPrice,
  formatSuperficie,
  slugify,
  getWhatsAppUrl,
  getPhoneUrl,
  truncate,
  capitalize,
} from '@/lib/formatters'

describe('formatPrice', () => {
  it('formatea precio en USD', () => {
    expect(formatPrice(230000, 'USD')).toBe('USD 230.000')
  })

  it('formatea precio en ARS', () => {
    expect(formatPrice(950000, 'ARS')).toBe('$ 950.000')
  })

  it('formatea precio sin decimales', () => {
    expect(formatPrice(1500000, 'ARS')).toBe('$ 1.500.000')
  })

  it('usa USD por defecto', () => {
    expect(formatPrice(100000)).toBe('USD 100.000')
  })
})

describe('formatSuperficie', () => {
  it('formatea metros cuadrados', () => {
    expect(formatSuperficie(180)).toBe('180 m²')
  })

  it('retorna "-" para null', () => {
    expect(formatSuperficie(null)).toBe('-')
  })

  it('retorna "-" para undefined', () => {
    expect(formatSuperficie(undefined)).toBe('-')
  })

  it('formatea numeros grandes con separador', () => {
    expect(formatSuperficie(500000)).toBe('500.000 m²')
  })
})

describe('slugify', () => {
  it('convierte texto a slug', () => {
    expect(slugify('Casa 3 dormitorios en Fisherton')).toBe('casa-3-dormitorios-en-fisherton')
  })

  it('elimina acentos', () => {
    expect(slugify('Galpón en Córdoba')).toBe('galpon-en-cordoba')
  })

  it('elimina caracteres especiales', () => {
    expect(slugify('PH con patio & terraza!')).toBe('ph-con-patio-terraza')
  })

  it('colapsa guiones múltiples', () => {
    expect(slugify('casa - venta')).toBe('casa-venta')
  })

  it('trimea guiones', () => {
    expect(slugify(' casa moderna ')).toBe('casa-moderna')
  })
})

describe('getWhatsAppUrl', () => {
  it('genera URL con mensaje default', () => {
    const url = getWhatsAppUrl('+5493411234567')
    expect(url).toContain('https://wa.me/5493411234567')
    expect(url).toContain('text=')
    expect(url).toContain('sitio%20web')
  })

  it('genera URL con título de propiedad', () => {
    const url = getWhatsAppUrl('+5493411234567', 'Casa en Fisherton')
    expect(url).toContain('Casa%20en%20Fisherton')
  })

  it('limpia caracteres no numéricos del teléfono', () => {
    const url = getWhatsAppUrl('+54 9 341 123-4567')
    expect(url).toContain('wa.me/5493411234567')
  })
})

describe('getPhoneUrl', () => {
  it('genera URL tel: limpia', () => {
    expect(getPhoneUrl('+54 9 341 123-4567')).toBe('tel:+5493411234567')
  })
})

describe('truncate', () => {
  it('no trunca si está dentro del largo', () => {
    expect(truncate('Hola mundo', 20)).toBe('Hola mundo')
  })

  it('trunca y agrega ellipsis', () => {
    expect(truncate('Este es un texto largo', 10)).toBe('Este es un...')
  })

  it('no trunca si es exacto', () => {
    expect(truncate('12345', 5)).toBe('12345')
  })
})

describe('capitalize', () => {
  it('capitaliza primera letra', () => {
    expect(capitalize('casa')).toBe('Casa')
  })

  it('deja el resto intacto', () => {
    expect(capitalize('hOLA')).toBe('HOLA')
  })
})
