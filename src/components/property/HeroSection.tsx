import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { Search } from 'lucide-react'
import { TIPO_OPERACION_LABELS, TIPO_PROPIEDAD_LABELS } from '@/lib/constants'
import { useFilterStore } from '@/store/filterStore'
import type { Organizacion } from '@/types/property'

interface HeroSectionProps {
  organization: Organizacion | null
}

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=80',
]

export default function HeroSection({ organization }: HeroSectionProps) {
  const navigate = useNavigate()
  const { resetFilters, setFilters } = useFilterStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Small delay to ensure CSS transition is visible after first paint
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])
  const [currentSlide, setCurrentSlide] = useState(0)

  const images = organization?.hero_imagenes?.length
    ? organization.hero_imagenes
    : FALLBACK_IMAGES

  const titulo = organization?.hero_titulo ?? 'Encontra tu lugar ideal'
  const subtitulo = organization?.hero_subtitulo ?? 'Las mejores propiedades en venta y alquiler'

  // Form state
  const [operacion, setOperacion] = useState('')
  const [tipo, setTipo] = useState('')
  const [ciudad, setCiudad] = useState('')

  // Auto-advance slides
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % images.length)
  }, [images.length])

  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [nextSlide, images.length])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    resetFilters()

    const newFilters: Record<string, unknown> = {}
    if (operacion) newFilters.tipo_operacion = operacion
    if (tipo) newFilters.tipo_propiedad = tipo
    if (ciudad) newFilters.ciudad = ciudad

    if (Object.keys(newFilters).length > 0) {
      setFilters(newFilters)
    }

    navigate('/propiedades')
  }

  return (
    <section className="relative h-[70vh] min-h-[480px] overflow-hidden md:h-[85vh] md:min-h-[600px]">
      {/* Background slides */}
      {images.map((img, i) => (
        <div
          key={img}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={img}
            alt=""
            className="h-full w-full object-cover"
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        </div>
      ))}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      {/* Content */}
      <div className="relative flex h-full flex-col items-center justify-center px-4 text-center text-white">
        <h1 className={`appear-ready max-w-3xl text-3xl font-extrabold leading-tight text-white drop-shadow-lg md:text-5xl lg:text-6xl ${mounted ? 'appeared' : ''}`}>
          {titulo}
        </h1>
        <p className={`appear-ready mt-4 max-w-xl text-base text-white/90 drop-shadow md:text-lg ${mounted ? 'appeared' : ''}`} style={{ transitionDelay: '200ms' }}>
          {subtitulo}
        </p>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className={`appear-ready mt-8 flex w-full max-w-3xl flex-col gap-3 rounded-2xl bg-white/95 p-4 shadow-2xl backdrop-blur-sm sm:flex-row sm:items-end sm:gap-2 sm:rounded-full sm:p-2 ${mounted ? 'appeared' : ''}`}
          style={{ transitionDelay: '400ms' }}
        >
          <div className="flex-1">
            <label className="mb-1 block text-left text-xs font-medium text-text-secondary sm:hidden">
              Operacion
            </label>
            <select
              value={operacion}
              onChange={(e) => setOperacion(e.target.value)}
              className="w-full rounded-lg border-0 bg-bg-subtle px-4 py-3 text-sm text-text-primary outline-none sm:rounded-full"
            >
              <option value="">Operacion</option>
              {Object.entries(TIPO_OPERACION_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="mb-1 block text-left text-xs font-medium text-text-secondary sm:hidden">
              Tipo
            </label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full rounded-lg border-0 bg-bg-subtle px-4 py-3 text-sm text-text-primary outline-none sm:rounded-full"
            >
              <option value="">Tipo</option>
              {Object.entries(TIPO_PROPIEDAD_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="mb-1 block text-left text-xs font-medium text-text-secondary sm:hidden">
              Ciudad
            </label>
            <input
              type="text"
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              placeholder="Ciudad o barrio"
              className="w-full rounded-lg border-0 bg-bg-subtle px-4 py-3 text-sm text-text-primary outline-none placeholder:text-text-tertiary sm:rounded-full"
            />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-500 sm:rounded-full"
          >
            <Search size={18} />
            <span className="sm:hidden">Buscar</span>
          </button>
        </form>

        {/* Slide dots */}
        {images.length > 1 && (
          <div className="mt-6 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all ${
                  i === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Ir a imagen ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
