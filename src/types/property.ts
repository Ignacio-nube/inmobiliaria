import type { Tables, Enums } from './database.types'

// Row types from database
export type Propiedad = Tables<'inmob_propiedades'>
export type Imagen = Tables<'inmob_imagenes'>
export type Organizacion = Tables<'inmob_organizaciones'>
export type Consulta = Tables<'inmob_consultas'>
export type Usuario = Tables<'inmob_usuarios'>

// Enum types
export type TipoOperacion = Enums<'inmob_tipo_operacion'>
export type TipoPropiedad = Enums<'inmob_tipo_propiedad'>
export type Moneda = Enums<'inmob_moneda'>
export type EstadoPropiedad = Enums<'inmob_estado_propiedad'>
export type Antiguedad = Enums<'inmob_antiguedad'>
export type RolUsuario = Enums<'inmob_rol_usuario'>

// Propiedad con imagenes (join)
export interface PropiedadConImagenes extends Propiedad {
  inmob_imagenes: Imagen[]
}

// Propiedad para card (datos minimos)
export interface PropiedadCard {
  id: string
  titulo: string
  slug: string
  tipo_operacion: TipoOperacion
  tipo_propiedad: TipoPropiedad
  precio: number
  moneda: Moneda
  dormitorios: number | null
  banos: number | null
  superficie_total: number | null
  ciudad: string
  barrio: string | null
  provincia: string
  imagen_principal: string | null
  destacada: boolean | null
}

// Redes sociales de la organizacion
export interface RedesSociales {
  instagram?: string
  facebook?: string
  youtube?: string
  twitter?: string
}

// Colores personalizados por organizacion
export interface ColoresOrganizacion {
  primario?: string
  secundario?: string
  acento?: string
  /** Visual theme design: 'default' | 'liquid-glass' */
  tema?: string
}
