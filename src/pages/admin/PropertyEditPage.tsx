import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  GripVertical,
  ImageIcon,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { propiedadSchema, type PropiedadFormData } from '@/lib/validators'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { slugify } from '@/lib/formatters'
import {
  TIPO_OPERACION_LABELS,
  TIPO_PROPIEDAD_LABELS,
  ESTADO_PROPIEDAD_LABELS,
  ANTIGUEDAD_LABELS,
  AMENITIES_OPTIONS,
  PROVINCIAS_AR,
} from '@/lib/constants'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import type { Imagen } from '@/types/property'

interface ImageForm {
  id?: string
  url: string
  alt_text: string
  es_principal: boolean
  orden: number
}

export default function PropertyEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { profile } = useAuth()
  const isEditing = !!id

  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [images, setImages] = useState<ImageForm[]>([])
  const [newImageUrl, setNewImageUrl] = useState('')
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(propiedadSchema),
    defaultValues: {
      titulo: '',
      descripcion: '',
      tipo_operacion: 'venta' as const,
      tipo_propiedad: 'casa' as const,
      precio: 0,
      moneda: 'USD' as const,
      dormitorios: null as number | null,
      banos: null as number | null,
      superficie_total: null as number | null,
      superficie_cubierta: null as number | null,
      estado: 'activa' as const,
      destacada: false,
      cochera: false,
      amenities: [] as string[],
      antiguedad: null as 'a_estrenar' | '1_5' | '5_10' | '10_mas' | null,
      direccion: '',
      ciudad: '',
      barrio: '',
      provincia: '',
      latitud: null as number | null,
      longitud: null as number | null,
    },
  })

  const amenitiesValue = watch('amenities') ?? []

  // Load existing property
  useEffect(() => {
    if (!id) return
    async function load() {
      const propId = id as string
      const { data: prop } = await supabase
        .from('inmob_propiedades')
        .select('*')
        .eq('id', propId)
        .single()

      if (!prop) {
        navigate('/admin/propiedades')
        return
      }

      reset({
        titulo: prop.titulo,
        descripcion: prop.descripcion ?? '',
        tipo_operacion: prop.tipo_operacion,
        tipo_propiedad: prop.tipo_propiedad,
        precio: prop.precio,
        moneda: prop.moneda,
        dormitorios: prop.dormitorios,
        banos: prop.banos,
        superficie_total: prop.superficie_total,
        superficie_cubierta: prop.superficie_cubierta,
        cochera: prop.cochera ?? false,
        antiguedad: prop.antiguedad,
        amenities: (prop.amenities as string[]) ?? [],
        direccion: prop.direccion ?? '',
        ciudad: prop.ciudad,
        barrio: prop.barrio ?? '',
        provincia: prop.provincia,
        latitud: prop.latitud,
        longitud: prop.longitud,
        estado: prop.estado,
        destacada: prop.destacada ?? false,
      })

      const { data: imgs } = await supabase
        .from('inmob_imagenes')
        .select('*')
        .eq('propiedad_id', propId)
        .order('orden', { ascending: true })

      if (imgs) {
        setImages(
          imgs.map((img: Imagen) => ({
            id: img.id,
            url: img.url,
            alt_text: img.alt_text ?? '',
            es_principal: img.es_principal ?? false,
            orden: img.orden ?? 0,
          }))
        )
      }
      setLoading(false)
    }
    load()
  }, [id, navigate, reset])

  function addImage() {
    if (!newImageUrl.trim()) return
    setImages((prev) => [
      ...prev,
      {
        url: newImageUrl.trim(),
        alt_text: '',
        es_principal: prev.length === 0,
        orden: prev.length + 1,
      },
    ])
    setNewImageUrl('')
  }

  function removeImage(index: number) {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index)
      // If we removed the principal, set first as principal
      if (updated.length > 0 && !updated.some((img) => img.es_principal)) {
        updated[0].es_principal = true
      }
      return updated.map((img, i) => ({ ...img, orden: i + 1 }))
    })
  }

  function setPrincipal(index: number) {
    setImages((prev) =>
      prev.map((img, i) => ({ ...img, es_principal: i === index }))
    )
  }

  function moveImage(index: number, direction: 'up' | 'down') {
    setImages((prev) => {
      const arr = [...prev]
      const target = direction === 'up' ? index - 1 : index + 1
      if (target < 0 || target >= arr.length) return prev
      ;[arr[index], arr[target]] = [arr[target], arr[index]]
      return arr.map((img, i) => ({ ...img, orden: i + 1 }))
    })
  }

  function toggleAmenity(amenity: string) {
    const current = amenitiesValue
    const updated = current.includes(amenity)
      ? current.filter((a) => a !== amenity)
      : [...current, amenity]
    setValue('amenities', updated, { shouldDirty: true })
  }

  async function onSubmit(data: PropiedadFormData) {
    if (!profile?.organizacion_id) return
    setSaving(true)
    setServerError(null)

    const slug = slugify(data.titulo)
    const propData = {
      ...data,
      slug,
      organizacion_id: profile.organizacion_id,
      descripcion: data.descripcion || null,
      direccion: data.direccion || null,
      barrio: data.barrio || null,
      dormitorios: data.dormitorios ?? null,
      banos: data.banos ?? null,
      superficie_total: data.superficie_total ?? null,
      superficie_cubierta: data.superficie_cubierta ?? null,
      antiguedad: data.antiguedad ?? null,
      latitud: data.latitud ?? null,
      longitud: data.longitud ?? null,
    }

    try {
      let propiedadId = id

      if (isEditing && id) {
        const { error } = await supabase
          .from('inmob_propiedades')
          .update(propData)
          .eq('id', id)
        if (error) throw error

        // Delete old images and re-insert
        await supabase.from('inmob_imagenes').delete().eq('propiedad_id', id)
      } else {
        const { data: newProp, error } = await supabase
          .from('inmob_propiedades')
          .insert(propData)
          .select('id')
          .single()
        if (error) throw error
        propiedadId = newProp.id
      }

      // Insert images
      if (images.length > 0 && propiedadId) {
        const { error: imgError } = await supabase.from('inmob_imagenes').insert(
          images.map((img) => ({
            propiedad_id: propiedadId as string,
            url: img.url,
            alt_text: img.alt_text || null,
            es_principal: img.es_principal,
            orden: img.orden,
          }))
        )
        if (imgError) throw imgError
      }

      toast.success(isEditing ? 'Propiedad actualizada' : 'Propiedad creada')
      if (!isEditing && propiedadId) {
        navigate(`/admin/propiedades/${propiedadId}`)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al guardar'
      setServerError(message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 animate-pulse rounded bg-bg-subtle" />
        <div className="h-96 animate-pulse rounded-xl border border-border bg-bg-card" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate('/admin/propiedades')}
          className="rounded-lg p-2 text-text-secondary hover:bg-bg-subtle"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            {isEditing ? 'Editar propiedad' : 'Nueva propiedad'}
          </h1>
        </div>
      </div>

      {serverError && (
        <div className="rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info */}
        <section className="rounded-xl border border-border bg-bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-text-primary">
            Información básica
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                label="Título"
                placeholder="Casa 3 dormitorios con pileta en Fisherton"
                error={errors.titulo?.message}
                {...register('titulo')}
              />
            </div>

            <Select
              label="Operación"
              options={Object.entries(TIPO_OPERACION_LABELS).map(([v, l]) => ({
                value: v,
                label: l,
              }))}
              error={errors.tipo_operacion?.message}
              {...register('tipo_operacion')}
            />

            <Select
              label="Tipo de propiedad"
              options={Object.entries(TIPO_PROPIEDAD_LABELS).map(([v, l]) => ({
                value: v,
                label: l,
              }))}
              error={errors.tipo_propiedad?.message}
              {...register('tipo_propiedad')}
            />

            <Input
              label="Precio"
              type="number"
              placeholder="150000"
              error={errors.precio?.message}
              {...register('precio', { valueAsNumber: true })}
            />

            <Select
              label="Moneda"
              options={[
                { value: 'USD', label: 'USD (Dólares)' },
                { value: 'ARS', label: 'ARS (Pesos)' },
              ]}
              error={errors.moneda?.message}
              {...register('moneda')}
            />

            <Select
              label="Estado"
              options={Object.entries(ESTADO_PROPIEDAD_LABELS).map(([v, l]) => ({
                value: v,
                label: l,
              }))}
              error={errors.estado?.message}
              {...register('estado')}
            />

            <Select
              label="Antigüedad"
              placeholder="Seleccionar"
              options={Object.entries(ANTIGUEDAD_LABELS).map(([v, l]) => ({
                value: v,
                label: l,
              }))}
              error={errors.antiguedad?.message}
              {...register('antiguedad')}
            />

            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-text-primary">
                Descripción
              </label>
              <textarea
                rows={4}
                placeholder="Descripción detallada de la propiedad..."
                className="mt-1.5 w-full rounded-[var(--radius-input)] border border-border bg-bg-card px-3 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                {...register('descripcion')}
              />
              {errors.descripcion?.message && (
                <p className="mt-1 text-xs text-error">{errors.descripcion.message}</p>
              )}
            </div>
          </div>
        </section>

        {/* Characteristics */}
        <section className="rounded-xl border border-border bg-bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-text-primary">
            Características
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Input
              label="Dormitorios"
              type="number"
              placeholder="3"
              error={errors.dormitorios?.message}
              {...register('dormitorios', { valueAsNumber: true })}
            />
            <Input
              label="Baños"
              type="number"
              placeholder="2"
              error={errors.banos?.message}
              {...register('banos', { valueAsNumber: true })}
            />
            <Input
              label="Sup. total (m²)"
              type="number"
              placeholder="200"
              error={errors.superficie_total?.message}
              {...register('superficie_total', { valueAsNumber: true })}
            />
            <Input
              label="Sup. cubierta (m²)"
              type="number"
              placeholder="150"
              error={errors.superficie_cubierta?.message}
              {...register('superficie_cubierta', { valueAsNumber: true })}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-text-primary">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                {...register('cochera')}
              />
              Cochera
            </label>
            <label className="flex items-center gap-2 text-sm text-text-primary">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                {...register('destacada')}
              />
              Propiedad destacada
            </label>
          </div>
        </section>

        {/* Amenities */}
        <section className="rounded-xl border border-border bg-bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-text-primary">
            Amenities
          </h2>
          <div className="flex flex-wrap gap-2">
            {AMENITIES_OPTIONS.map((amenity) => {
              const selected = amenitiesValue.includes(amenity)
              return (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                    selected
                      ? 'border-primary bg-primary-50 text-primary'
                      : 'border-border text-text-secondary hover:border-primary/50 hover:text-text-primary'
                  }`}
                >
                  {amenity}
                </button>
              )
            })}
          </div>
        </section>

        {/* Location */}
        <section className="rounded-xl border border-border bg-bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-text-primary">
            Ubicación
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
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
              label="Barrio"
              placeholder="Fisherton"
              error={errors.barrio?.message}
              {...register('barrio')}
            />
            <Select
              label="Provincia"
              placeholder="Seleccionar provincia"
              options={PROVINCIAS_AR.map((p) => ({ value: p, label: p }))}
              error={errors.provincia?.message}
              {...register('provincia')}
            />
          </div>
        </section>

        {/* Images */}
        <section className="rounded-xl border border-border bg-bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-text-primary">
            Imágenes
          </h2>

          <div className="mb-4 flex gap-2">
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addImage()
                }
              }}
              className="flex-1 rounded-lg border border-border bg-bg-card px-3 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
            <Button type="button" variant="outline" onClick={addImage}>
              <Plus size={16} /> Agregar
            </Button>
          </div>

          {images.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-border py-12 text-center">
              <ImageIcon size={32} className="mx-auto text-text-tertiary" />
              <p className="mt-2 text-sm text-text-tertiary">
                Agregá URLs de imágenes para esta propiedad
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {images.map((img, index) => (
                <div
                  key={`${img.url}-${index}`}
                  className="flex items-center gap-3 rounded-lg border border-border p-2"
                >
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      onClick={() => moveImage(index, 'up')}
                      disabled={index === 0}
                      className="text-text-tertiary hover:text-text-primary disabled:opacity-30"
                    >
                      <GripVertical size={14} />
                    </button>
                  </div>
                  <div className="h-14 w-20 flex-shrink-0 overflow-hidden rounded bg-bg-subtle">
                    <img
                      src={img.url}
                      alt={img.alt_text || 'Preview'}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src = ''
                        ;(e.target as HTMLImageElement).alt = 'Error'
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-text-secondary">
                      {img.url}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPrincipal(index)}
                        className={`text-xs font-medium ${
                          img.es_principal
                            ? 'text-primary'
                            : 'text-text-tertiary hover:text-primary'
                        }`}
                      >
                        {img.es_principal ? 'Principal' : 'Marcar principal'}
                      </button>
                      <span className="text-xs text-text-tertiary">
                        #{img.orden}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="rounded p-1.5 text-text-tertiary hover:bg-bg-subtle hover:text-error"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/propiedades')}
          >
            Cancelar
          </Button>
          <Button type="submit" loading={saving}>
            <Save size={18} />
            {isEditing ? 'Guardar cambios' : 'Crear propiedad'}
          </Button>
        </div>
      </form>
    </div>
  )
}
