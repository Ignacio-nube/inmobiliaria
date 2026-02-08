import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Save,
  Plus,
  Trash2,
  GripVertical,
  ImageIcon,
  Palette,
  Globe,
  Check,
  SlidersHorizontal,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { organizacionSchema, type OrganizacionFormData } from '@/lib/validators'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import type { ColoresOrganizacion, RedesSociales } from '@/types/property'

/** Predefined color palettes for real estate sites */
const COLOR_PALETTES = [
  {
    name: 'Azul Petroleo',
    description: 'Profesional y confiable',
    primario: '#1B4965',
    secundario: '#2D9B6E',
    acento: '#E07A5F',
  },
  {
    name: 'Azul Moderno',
    description: 'Corporativo y elegante',
    primario: '#1E3A5F',
    secundario: '#4A90D9',
    acento: '#F5A623',
  },
  {
    name: 'Verde Natura',
    description: 'Fresco y natural',
    primario: '#2D6A4F',
    secundario: '#52B788',
    acento: '#D4A373',
  },
  {
    name: 'Rojo Elegante',
    description: 'Audaz y premium',
    primario: '#6B1D1D',
    secundario: '#C0392B',
    acento: '#F4D03F',
  },
  {
    name: 'Gris Ejecutivo',
    description: 'Minimalista y sobrio',
    primario: '#2D3436',
    secundario: '#636E72',
    acento: '#00B894',
  },
  {
    name: 'Dorado Lujo',
    description: 'Exclusivo y sofisticado',
    primario: '#1A1A2E',
    secundario: '#C9A84C',
    acento: '#E8D5B7',
  },
  {
    name: 'Terracota',
    description: 'Calido y acogedor',
    primario: '#5C3D2E',
    secundario: '#C97B4B',
    acento: '#8FBC8F',
  },
  {
    name: 'Oceano',
    description: 'Costero y relajado',
    primario: '#0A3D62',
    secundario: '#3DC1D3',
    acento: '#F8C291',
  },
] as const

export default function SettingsPage() {
  const { profile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [orgId, setOrgId] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  // Additional fields not in the schema
  const [logoUrl, setLogoUrl] = useState('')
  const [heroImages, setHeroImages] = useState<string[]>([])
  const [newHeroUrl, setNewHeroUrl] = useState('')
  const [colores, setColores] = useState<ColoresOrganizacion>({})
  const [redes, setRedes] = useState<RedesSociales>({})
  const [showCustomColors, setShowCustomColors] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OrganizacionFormData>({
    resolver: zodResolver(organizacionSchema),
  })

  useEffect(() => {
    if (!profile?.organizacion_id) return
    setOrgId(profile.organizacion_id)

    async function load() {
      const { data: org } = await supabase
        .from('inmob_organizaciones')
        .select('*')
        .eq('id', profile!.organizacion_id)
        .single()

      if (!org) return

      reset({
        nombre: org.nombre,
        telefono: org.telefono ?? '',
        whatsapp: org.whatsapp ?? '',
        email: org.email ?? '',
        direccion: org.direccion ?? '',
        ciudad: org.ciudad ?? '',
        provincia: org.provincia ?? '',
        hero_titulo: org.hero_titulo ?? '',
        hero_subtitulo: org.hero_subtitulo ?? '',
      })

      setLogoUrl(org.logo_url ?? '')
      setHeroImages(org.hero_imagenes ?? [])
      setColores((org.colores as ColoresOrganizacion) ?? {})
      setRedes((org.redes_sociales as RedesSociales) ?? {})
      setLoading(false)
    }
    load()
  }, [profile?.organizacion_id, reset, profile])

  function addHeroImage() {
    if (!newHeroUrl.trim()) return
    setHeroImages((prev) => [...prev, newHeroUrl.trim()])
    setNewHeroUrl('')
  }

  function removeHeroImage(index: number) {
    setHeroImages((prev) => prev.filter((_, i) => i !== index))
  }

  function moveHeroImage(index: number, direction: 'up' | 'down') {
    setHeroImages((prev) => {
      const arr = [...prev]
      const target = direction === 'up' ? index - 1 : index + 1
      if (target < 0 || target >= arr.length) return prev
      ;[arr[index], arr[target]] = [arr[target], arr[index]]
      return arr
    })
  }

  async function onSubmit(data: OrganizacionFormData) {
    if (!orgId) return
    setSaving(true)
    setServerError(null)

    const updateData = {
      ...data,
      telefono: data.telefono || null,
      whatsapp: data.whatsapp || null,
      email: data.email || null,
      direccion: data.direccion || null,
      ciudad: data.ciudad || null,
      provincia: data.provincia || null,
      hero_titulo: data.hero_titulo || null,
      hero_subtitulo: data.hero_subtitulo || null,
      logo_url: logoUrl || null,
      hero_imagenes: heroImages.length > 0 ? heroImages : null,
      colores: Object.keys(colores).length > 0 ? (colores as Record<string, string>) : null,
      redes_sociales: Object.keys(redes).length > 0 ? (redes as Record<string, string>) : null,
    }

    const { error } = await supabase
      .from('inmob_organizaciones')
      .update(updateData)
      .eq('id', orgId)

    if (error) {
      setServerError(error.message)
      toast.error('Error al guardar')
    } else {
      toast.success('Configuracion guardada correctamente')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-bg-subtle" />
        <div className="h-96 animate-pulse rounded-xl border border-border bg-bg-card" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Configuración</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Personalizá los datos y el aspecto de tu sitio web
        </p>
      </div>

      {serverError && (
        <div className="rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Organization Info */}
        <section className="rounded-xl border border-border bg-bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-text-primary">
            Datos de la inmobiliaria
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                label="Nombre"
                placeholder="Mi Inmobiliaria"
                error={errors.nombre?.message}
                {...register('nombre')}
              />
            </div>
            <Input
              label="Teléfono"
              placeholder="+5493411234567"
              error={errors.telefono?.message}
              {...register('telefono')}
            />
            <Input
              label="WhatsApp"
              placeholder="+5493411234567"
              error={errors.whatsapp?.message}
              {...register('whatsapp')}
            />
            <Input
              label="Email"
              type="email"
              placeholder="info@inmobiliaria.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Dirección"
              placeholder="Av. Pellegrini 1234"
              error={errors.direccion?.message}
              {...register('direccion')}
            />
            <Input
              label="Ciudad"
              placeholder="Rosario"
              error={errors.ciudad?.message}
              {...register('ciudad')}
            />
            <Input
              label="Provincia"
              placeholder="Santa Fe"
              error={errors.provincia?.message}
              {...register('provincia')}
            />
          </div>
        </section>

        {/* Logo */}
        <section className="rounded-xl border border-border bg-bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-text-primary">Logo</h2>
          <div className="flex items-start gap-4">
            {logoUrl ? (
              <div className="flex h-16 w-40 items-center justify-center rounded-lg border border-border bg-bg-subtle p-2">
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ) : (
              <div className="flex h-16 w-40 items-center justify-center rounded-lg border-2 border-dashed border-border">
                <ImageIcon size={24} className="text-text-tertiary" />
              </div>
            )}
            <div className="flex-1">
              <Input
                label="URL del logo (PNG o SVG)"
                placeholder="https://..."
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Hero */}
        <section className="rounded-xl border border-border bg-bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-text-primary">
            Sección Hero (portada)
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                label="Título del Hero"
                placeholder="Encontrá tu lugar ideal"
                error={errors.hero_titulo?.message}
                {...register('hero_titulo')}
              />
            </div>
            <div className="sm:col-span-2">
              <Input
                label="Subtítulo del Hero"
                placeholder="Las mejores propiedades en tu ciudad"
                error={errors.hero_subtitulo?.message}
                {...register('hero_subtitulo')}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium text-text-primary">
              Imágenes del Hero (slider de fondo)
            </label>
            <div className="mt-2 flex gap-2">
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={newHeroUrl}
                onChange={(e) => setNewHeroUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addHeroImage()
                  }
                }}
                className="flex-1 rounded-lg border border-border bg-bg-card px-3 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
              <Button type="button" variant="outline" onClick={addHeroImage}>
                <Plus size={16} />
              </Button>
            </div>

            {heroImages.length === 0 ? (
              <p className="mt-3 text-sm text-text-tertiary">
                No hay imágenes configuradas para el hero
              </p>
            ) : (
              <div className="mt-3 space-y-2">
                {heroImages.map((url, index) => (
                  <div
                    key={`${url}-${index}`}
                    className="flex items-center gap-2 rounded-lg border border-border p-2"
                  >
                    <button
                      type="button"
                      onClick={() => moveHeroImage(index, 'up')}
                      disabled={index === 0}
                      className="text-text-tertiary hover:text-text-primary disabled:opacity-30"
                    >
                      <GripVertical size={14} />
                    </button>
                    <div className="h-10 w-16 flex-shrink-0 overflow-hidden rounded bg-bg-subtle">
                      <img
                        src={url}
                        alt={`Hero ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p className="min-w-0 flex-1 truncate text-sm text-text-secondary">
                      {url}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeHeroImage(index)}
                      className="rounded p-1 text-text-tertiary hover:text-error"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Colors */}
        <section className="rounded-xl border border-border bg-bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Palette size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-text-primary">
              Paleta de colores
            </h2>
          </div>
          <p className="mb-4 text-sm text-text-secondary">
            Elegí una paleta predefinida o personalizá los colores de tu sitio web
          </p>

          {/* Predefined palettes grid */}
          <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {COLOR_PALETTES.map((palette) => {
              const isSelected =
                colores.primario === palette.primario &&
                colores.secundario === palette.secundario &&
                colores.acento === palette.acento
              return (
                <button
                  key={palette.name}
                  type="button"
                  onClick={() => {
                    setColores({
                      primario: palette.primario,
                      secundario: palette.secundario,
                      acento: palette.acento,
                    })
                    setShowCustomColors(false)
                  }}
                  className={`group relative rounded-xl border-2 p-3 text-left transition-all duration-200 ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border hover:border-primary/40 hover:shadow-sm'
                  }`}
                >
                  {/* Color swatches */}
                  <div className="flex gap-1.5">
                    <div
                      className="h-8 w-8 rounded-lg shadow-sm"
                      style={{ backgroundColor: palette.primario }}
                    />
                    <div
                      className="h-8 w-8 rounded-lg shadow-sm"
                      style={{ backgroundColor: palette.secundario }}
                    />
                    <div
                      className="h-8 w-8 rounded-lg shadow-sm"
                      style={{ backgroundColor: palette.acento }}
                    />
                  </div>
                  <p className="mt-2 text-sm font-medium text-text-primary">
                    {palette.name}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    {palette.description}
                  </p>
                  {isSelected && (
                    <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                      <Check size={12} />
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Custom toggle */}
          <button
            type="button"
            onClick={() => setShowCustomColors((v) => !v)}
            className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-500 transition-colors"
          >
            <SlidersHorizontal size={16} />
            {showCustomColors ? 'Ocultar personalización' : 'Personalizar colores individuales'}
          </button>

          {/* Custom color pickers */}
          {showCustomColors && (
            <div className="mt-4 grid gap-4 rounded-lg border border-border bg-bg-subtle/50 p-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">
                  Color primario
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={colores.primario || '#1B4965'}
                    onChange={(e) =>
                      setColores((prev) => ({ ...prev, primario: e.target.value }))
                    }
                    className="h-10 w-10 cursor-pointer rounded border border-border"
                  />
                  <input
                    type="text"
                    value={colores.primario || '#1B4965'}
                    onChange={(e) =>
                      setColores((prev) => ({ ...prev, primario: e.target.value }))
                    }
                    className="flex-1 rounded-lg border border-border bg-bg-card px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">
                  Color secundario
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={colores.secundario || '#2D9B6E'}
                    onChange={(e) =>
                      setColores((prev) => ({ ...prev, secundario: e.target.value }))
                    }
                    className="h-10 w-10 cursor-pointer rounded border border-border"
                  />
                  <input
                    type="text"
                    value={colores.secundario || '#2D9B6E'}
                    onChange={(e) =>
                      setColores((prev) => ({ ...prev, secundario: e.target.value }))
                    }
                    className="flex-1 rounded-lg border border-border bg-bg-card px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">
                  Color acento
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={colores.acento || '#E07A5F'}
                    onChange={(e) =>
                      setColores((prev) => ({ ...prev, acento: e.target.value }))
                    }
                    className="h-10 w-10 cursor-pointer rounded border border-border"
                  />
                  <input
                    type="text"
                    value={colores.acento || '#E07A5F'}
                    onChange={(e) =>
                      setColores((prev) => ({ ...prev, acento: e.target.value }))
                    }
                    className="flex-1 rounded-lg border border-border bg-bg-card px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Live preview */}
          {(colores.primario || colores.secundario || colores.acento) && (
            <div className="mt-4 rounded-lg border border-border bg-bg-subtle/50 p-4">
              <p className="mb-2 text-xs font-medium text-text-tertiary uppercase tracking-wide">
                Vista previa
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1 rounded-lg p-3 text-white text-sm font-medium text-center" style={{ backgroundColor: colores.primario || '#1B4965' }}>
                  Primario
                </div>
                <div className="flex-1 rounded-lg p-3 text-white text-sm font-medium text-center" style={{ backgroundColor: colores.secundario || '#2D9B6E' }}>
                  Secundario
                </div>
                <div className="flex-1 rounded-lg p-3 text-white text-sm font-medium text-center" style={{ backgroundColor: colores.acento || '#E07A5F' }}>
                  Acento
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Social Media */}
        <section className="rounded-xl border border-border bg-bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Globe size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-text-primary">
              Redes sociales
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Instagram"
              placeholder="https://instagram.com/tuinmobiliaria"
              value={redes.instagram ?? ''}
              onChange={(e) =>
                setRedes((prev) => ({ ...prev, instagram: e.target.value }))
              }
            />
            <Input
              label="Facebook"
              placeholder="https://facebook.com/tuinmobiliaria"
              value={redes.facebook ?? ''}
              onChange={(e) =>
                setRedes((prev) => ({ ...prev, facebook: e.target.value }))
              }
            />
            <Input
              label="YouTube"
              placeholder="https://youtube.com/@tuinmobiliaria"
              value={redes.youtube ?? ''}
              onChange={(e) =>
                setRedes((prev) => ({ ...prev, youtube: e.target.value }))
              }
            />
            <Input
              label="Twitter / X"
              placeholder="https://x.com/tuinmobiliaria"
              value={redes.twitter ?? ''}
              onChange={(e) =>
                setRedes((prev) => ({ ...prev, twitter: e.target.value }))
              }
            />
          </div>
        </section>

        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit" loading={saving} size="lg">
            <Save size={18} />
            Guardar configuración
          </Button>
        </div>
      </form>
    </div>
  )
}
