import type { TipoOperacion, TipoPropiedad, Moneda, Antiguedad } from './property'

export interface PropertyFilters {
  tipo_operacion?: TipoOperacion
  tipo_propiedad?: TipoPropiedad
  ciudad?: string
  barrio?: string
  precio_min?: number
  precio_max?: number
  moneda?: Moneda
  dormitorios_min?: number
  banos_min?: number
  superficie_min?: number
  superficie_max?: number
  cochera?: boolean
  antiguedad?: Antiguedad
  amenities?: string[]
}

export interface SearchParams {
  filters: PropertyFilters
  page: number
  pageSize: number
  sortBy: SortOption
}

export type SortOption =
  | 'precio_asc'
  | 'precio_desc'
  | 'recientes'
  | 'superficie_asc'
  | 'superficie_desc'

export interface PaginatedResult<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  totalPages: number
}
