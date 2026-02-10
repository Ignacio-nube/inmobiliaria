/**
 * Formatea un precio con separador de miles argentino
 * 120000 -> "120.000"
 */
export function formatPrice(precio: number, moneda: 'ARS' | 'USD' = 'USD'): string {
  const prefix = moneda === 'USD' ? 'USD ' : '$ '
  return prefix + new Intl.NumberFormat('es-AR', {
    maximumFractionDigits: 0,
  }).format(precio)
}

/**
 * Formatea superficie en m2
 * 180 -> "180 m²"
 */
export function formatSuperficie(m2: number | null | undefined): string {
  if (m2 == null) return '-'
  return `${new Intl.NumberFormat('es-AR').format(m2)} m²`
}

/**
 * Genera un slug URL-friendly a partir de un texto
 * "Casa 3 dormitorios en Fisherton" -> "casa-3-dormitorios-en-fisherton"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // eliminar acentos
    .replace(/[^a-z0-9\s-]/g, '')    // solo alfanuméricos
    .replace(/\s+/g, '-')            // espacios -> guiones
    .replace(/-+/g, '-')             // guiones duplicados
    .replace(/^-|-$/g, '')           // trim guiones
}

/**
 * Genera la URL de WhatsApp con mensaje pre-armado
 */
export function getWhatsAppUrl(
  whatsapp: string,
  propertyTitle?: string
): string {
  const cleanNumber = whatsapp.replace(/\D/g, '')
  const message = propertyTitle
    ? `Hola, me interesa la propiedad "${propertyTitle}" publicada en su web.`
    : 'Hola, me contacto desde su sitio web.'
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`
}

/**
 * Genera la URL de llamada telefónica
 */
export function getPhoneUrl(phone: string): string {
  const cleanNumber = phone.replace(/\D/g, '')
  return `tel:+${cleanNumber}`
}

/**
 * Formatea una fecha ISO a formato legible
 * "2025-01-15T10:30:00" -> "15/01/2025"
 */
export function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(isoDate))
}

/**
 * Trunca un texto y agrega "..." si supera el largo máximo
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '...'
}

/**
 * Capitaliza la primera letra
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * Helper para mapear tipo_operacion a variante de badge
 */
export function getOperacionBadgeVariant(
  tipo: 'venta' | 'alquiler' | 'alquiler_temporario'
): 'venta' | 'alquiler' | 'temporario' | 'neutral' {
  switch (tipo) {
    case 'venta':
      return 'venta'
    case 'alquiler':
      return 'alquiler'
    case 'alquiler_temporario':
      return 'temporario'
    default:
      return 'neutral'
  }
}
