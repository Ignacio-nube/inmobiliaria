export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      inmob_consultas: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          leida: boolean | null
          mensaje: string
          nombre: string
          organizacion_id: string
          propiedad_id: string | null
          telefono: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          leida?: boolean | null
          mensaje: string
          nombre: string
          organizacion_id: string
          propiedad_id?: string | null
          telefono?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          leida?: boolean | null
          mensaje?: string
          nombre?: string
          organizacion_id?: string
          propiedad_id?: string | null
          telefono?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inmob_consultas_organizacion_id_fkey"
            columns: ["organizacion_id"]
            isOneToOne: false
            referencedRelation: "inmob_organizaciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inmob_consultas_propiedad_id_fkey"
            columns: ["propiedad_id"]
            isOneToOne: false
            referencedRelation: "inmob_propiedades"
            referencedColumns: ["id"]
          },
        ]
      }
      inmob_imagenes: {
        Row: {
          alt_text: string | null
          created_at: string | null
          es_principal: boolean | null
          id: string
          orden: number | null
          propiedad_id: string
          url: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          es_principal?: boolean | null
          id?: string
          orden?: number | null
          propiedad_id: string
          url: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          es_principal?: boolean | null
          id?: string
          orden?: number | null
          propiedad_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "inmob_imagenes_propiedad_id_fkey"
            columns: ["propiedad_id"]
            isOneToOne: false
            referencedRelation: "inmob_propiedades"
            referencedColumns: ["id"]
          },
        ]
      }
      inmob_organizaciones: {
        Row: {
          activa: boolean | null
          ciudad: string | null
          colores: Json | null
          created_at: string | null
          direccion: string | null
          email: string | null
          hero_imagenes: string[] | null
          hero_subtitulo: string | null
          hero_titulo: string | null
          id: string
          logo_url: string | null
          nombre: string
          provincia: string | null
          redes_sociales: Json | null
          slug: string
          telefono: string | null
          updated_at: string | null
          whatsapp: string | null
        }
        Insert: {
          activa?: boolean | null
          ciudad?: string | null
          colores?: Json | null
          created_at?: string | null
          direccion?: string | null
          email?: string | null
          hero_imagenes?: string[] | null
          hero_subtitulo?: string | null
          hero_titulo?: string | null
          id?: string
          logo_url?: string | null
          nombre: string
          provincia?: string | null
          redes_sociales?: Json | null
          slug: string
          telefono?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Update: {
          activa?: boolean | null
          ciudad?: string | null
          colores?: Json | null
          created_at?: string | null
          direccion?: string | null
          email?: string | null
          hero_imagenes?: string[] | null
          hero_subtitulo?: string | null
          hero_titulo?: string | null
          id?: string
          logo_url?: string | null
          nombre?: string
          provincia?: string | null
          redes_sociales?: Json | null
          slug?: string
          telefono?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      inmob_propiedades: {
        Row: {
          amenities: string[] | null
          antiguedad: Database["public"]["Enums"]["inmob_antiguedad"] | null
          banos: number | null
          barrio: string | null
          ciudad: string
          cochera: boolean | null
          created_at: string | null
          descripcion: string | null
          destacada: boolean | null
          direccion: string | null
          dormitorios: number | null
          estado: Database["public"]["Enums"]["inmob_estado_propiedad"]
          id: string
          latitud: number | null
          longitud: number | null
          moneda: Database["public"]["Enums"]["inmob_moneda"]
          orden: number | null
          organizacion_id: string
          precio: number
          provincia: string
          slug: string
          superficie_cubierta: number | null
          superficie_total: number | null
          tipo_operacion: Database["public"]["Enums"]["inmob_tipo_operacion"]
          tipo_propiedad: Database["public"]["Enums"]["inmob_tipo_propiedad"]
          titulo: string
          updated_at: string | null
        }
        Insert: {
          amenities?: string[] | null
          antiguedad?: Database["public"]["Enums"]["inmob_antiguedad"] | null
          banos?: number | null
          barrio?: string | null
          ciudad: string
          cochera?: boolean | null
          created_at?: string | null
          descripcion?: string | null
          destacada?: boolean | null
          direccion?: string | null
          dormitorios?: number | null
          estado?: Database["public"]["Enums"]["inmob_estado_propiedad"]
          id?: string
          latitud?: number | null
          longitud?: number | null
          moneda?: Database["public"]["Enums"]["inmob_moneda"]
          orden?: number | null
          organizacion_id: string
          precio: number
          provincia: string
          slug: string
          superficie_cubierta?: number | null
          superficie_total?: number | null
          tipo_operacion: Database["public"]["Enums"]["inmob_tipo_operacion"]
          tipo_propiedad: Database["public"]["Enums"]["inmob_tipo_propiedad"]
          titulo: string
          updated_at?: string | null
        }
        Update: {
          amenities?: string[] | null
          antiguedad?: Database["public"]["Enums"]["inmob_antiguedad"] | null
          banos?: number | null
          barrio?: string | null
          ciudad?: string
          cochera?: boolean | null
          created_at?: string | null
          descripcion?: string | null
          destacada?: boolean | null
          direccion?: string | null
          dormitorios?: number | null
          estado?: Database["public"]["Enums"]["inmob_estado_propiedad"]
          id?: string
          latitud?: number | null
          longitud?: number | null
          moneda?: Database["public"]["Enums"]["inmob_moneda"]
          orden?: number | null
          organizacion_id?: string
          precio?: number
          provincia?: string
          slug?: string
          superficie_cubierta?: number | null
          superficie_total?: number | null
          tipo_operacion?: Database["public"]["Enums"]["inmob_tipo_operacion"]
          tipo_propiedad?: Database["public"]["Enums"]["inmob_tipo_propiedad"]
          titulo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inmob_propiedades_organizacion_id_fkey"
            columns: ["organizacion_id"]
            isOneToOne: false
            referencedRelation: "inmob_organizaciones"
            referencedColumns: ["id"]
          },
        ]
      }
      inmob_usuarios: {
        Row: {
          activo: boolean | null
          created_at: string | null
          email: string
          id: string
          nombre: string | null
          organizacion_id: string
          rol: Database["public"]["Enums"]["inmob_rol_usuario"]
        }
        Insert: {
          activo?: boolean | null
          created_at?: string | null
          email: string
          id: string
          nombre?: string | null
          organizacion_id: string
          rol?: Database["public"]["Enums"]["inmob_rol_usuario"]
        }
        Update: {
          activo?: boolean | null
          created_at?: string | null
          email?: string
          id?: string
          nombre?: string | null
          organizacion_id?: string
          rol?: Database["public"]["Enums"]["inmob_rol_usuario"]
        }
        Relationships: [
          {
            foreignKeyName: "inmob_usuarios_organizacion_id_fkey"
            columns: ["organizacion_id"]
            isOneToOne: false
            referencedRelation: "inmob_organizaciones"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      inmob_antiguedad: "a_estrenar" | "1_5" | "5_10" | "10_mas"
      inmob_estado_propiedad: "activa" | "pausada" | "vendida" | "alquilada"
      inmob_moneda: "ARS" | "USD"
      inmob_rol_usuario: "admin" | "editor"
      inmob_tipo_operacion: "venta" | "alquiler" | "alquiler_temporario"
      inmob_tipo_propiedad:
        | "casa"
        | "departamento"
        | "ph"
        | "terreno"
        | "local"
        | "oficina"
        | "galpon"
        | "campo"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"]
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T]
