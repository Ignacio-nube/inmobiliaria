// Labels legibles para los enums de la base de datos

export const TIPO_OPERACION_LABELS: Record<string, string> = {
  venta: 'Venta',
  alquiler: 'Alquiler',
  alquiler_temporario: 'Alquiler Temporario',
}

export const TIPO_PROPIEDAD_LABELS: Record<string, string> = {
  casa: 'Casa',
  departamento: 'Departamento',
  ph: 'PH',
  terreno: 'Terreno',
  local: 'Local',
  oficina: 'Oficina',
  galpon: 'Galpón',
  campo: 'Campo',
}

export const ESTADO_PROPIEDAD_LABELS: Record<string, string> = {
  activa: 'Activa',
  pausada: 'Pausada',
  vendida: 'Vendida',
  alquilada: 'Alquilada',
}

export const ANTIGUEDAD_LABELS: Record<string, string> = {
  a_estrenar: 'A estrenar',
  '1_5': '1 a 5 años',
  '5_10': '5 a 10 años',
  '10_mas': 'Más de 10 años',
}

export const MONEDA_LABELS: Record<string, string> = {
  ARS: 'ARS',
  USD: 'USD',
}

export const AMENITIES_OPTIONS = [
  'Pileta',
  'Parrilla',
  'Seguridad 24hs',
  'Gimnasio',
  'SUM',
  'Laundry',
  'Balcón',
  'Terraza',
  'Jardín',
  'Quincho',
  'Aire acondicionado',
  'Calefacción',
] as const

// Provincias de Argentina
export const PROVINCIAS_AR = [
  'Buenos Aires',
  'CABA',
  'Catamarca',
  'Chaco',
  'Chubut',
  'Córdoba',
  'Corrientes',
  'Entre Ríos',
  'Formosa',
  'Jujuy',
  'La Pampa',
  'La Rioja',
  'Mendoza',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'Salta',
  'San Juan',
  'San Luis',
  'Santa Cruz',
  'Santa Fe',
  'Santiago del Estero',
  'Tierra del Fuego',
  'Tucumán',
] as const

// Paginacion por defecto
export const DEFAULT_PAGE_SIZE = 12

// Breakpoints (consistentes con Tailwind)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const
