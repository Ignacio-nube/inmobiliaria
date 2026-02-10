import { z } from 'zod'

/**
 * Schema para el formulario de consulta publica
 */
export const consultaSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre es demasiado largo'),
  telefono: z
    .string()
    .min(8, 'Ingresá un teléfono válido')
    .max(20, 'Teléfono demasiado largo')
    .optional()
    .or(z.literal('')),
  email: z
    .string()
    .email('Ingresá un email válido')
    .optional()
    .or(z.literal('')),
  mensaje: z
    .string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(1000, 'El mensaje es demasiado largo'),
})

export type ConsultaFormData = z.infer<typeof consultaSchema>

/**
 * Schema para crear/editar una propiedad (panel admin)
 */
export const propiedadSchema = z.object({
  titulo: z
    .string()
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(200, 'El título es demasiado largo'),
  descripcion: z
    .string()
    .max(5000, 'La descripción es demasiado larga')
    .optional()
    .or(z.literal('')),
  tipo_operacion: z.enum(['venta', 'alquiler', 'alquiler_temporario'], {
    error: 'Seleccioná el tipo de operación',
  }),
  tipo_propiedad: z.enum(
    ['casa', 'departamento', 'ph', 'terreno', 'local', 'oficina', 'galpon', 'campo'],
    { error: 'Seleccioná el tipo de propiedad' }
  ),
  precio: z
    .number({ error: 'Ingresá el precio' })
    .positive('El precio debe ser mayor a 0'),
  moneda: z.enum(['ARS', 'USD']),
  dormitorios: z.number().int().min(0).optional().nullable(),
  banos: z.number().int().min(0).optional().nullable(),
  superficie_total: z.number().positive().optional().nullable(),
  superficie_cubierta: z.number().positive().optional().nullable(),
  cochera: z.boolean().default(false),
  antiguedad: z
    .enum(['a_estrenar', '1_5', '5_10', '10_mas'])
    .optional()
    .nullable(),
  amenities: z.array(z.string()).default([]),
  direccion: z.string().max(300).optional().or(z.literal('')),
  ciudad: z
    .string()
    .min(2, 'Ingresá la ciudad')
    .max(100),
  barrio: z.string().max(100).optional().or(z.literal('')),
  provincia: z
    .string()
    .min(2, 'Seleccioná la provincia'),
  latitud: z.number().optional().nullable(),
  longitud: z.number().optional().nullable(),
  estado: z.enum(['activa', 'pausada', 'vendida', 'alquilada']).default('activa'),
  destacada: z.boolean().default(false),
})

export type PropiedadFormData = z.infer<typeof propiedadSchema>

/**
 * Schema para login admin
 */
export const loginSchema = z.object({
  email: z
    .string()
    .email('Ingresá un email válido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export type LoginFormData = z.infer<typeof loginSchema>

/**
 * Schema para configuracion de la organizacion
 */
export const organizacionSchema = z.object({
  nombre: z.string().min(2, 'El nombre es obligatorio').max(200),
  telefono: z.string().max(30).optional().or(z.literal('')),
  whatsapp: z.string().max(30).optional().or(z.literal('')),
  email: z.string().email().optional().or(z.literal('')),
  direccion: z.string().max(300).optional().or(z.literal('')),
  ciudad: z.string().max(100).optional().or(z.literal('')),
  provincia: z.string().max(100).optional().or(z.literal('')),
  hero_titulo: z.string().max(200).optional().or(z.literal('')),
  hero_subtitulo: z.string().max(300).optional().or(z.literal('')),
  mostrar_nombre_logo: z.boolean(),
})

export type OrganizacionFormData = z.infer<typeof organizacionSchema>
