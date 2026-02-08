import { useRef, useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import PropertyCard from './PropertyCard'
import type { PropiedadConImagenes } from '@/types/property'

interface FeaturedPropertiesProps {
  properties: PropiedadConImagenes[]
  loading?: boolean
}

export default function FeaturedProperties({ properties, loading }: FeaturedPropertiesProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [autoplay, setAutoplay] = useState(true)

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 8)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateScrollButtons()
    el.addEventListener('scroll', updateScrollButtons, { passive: true })
    return () => el.removeEventListener('scroll', updateScrollButtons)
  }, [updateScrollButtons, properties])

  // Auto-scroll
  useEffect(() => {
    if (!autoplay || properties.length <= 1) return
    const el = scrollRef.current
    if (!el) return

    const timer = setInterval(() => {
      const maxScroll = el.scrollWidth - el.clientWidth
      if (el.scrollLeft >= maxScroll - 8) {
        el.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        el.scrollBy({ left: 340, behavior: 'smooth' })
      }
    }, 4000)

    return () => clearInterval(timer)
  }, [autoplay, properties.length])

  function scroll(direction: 'left' | 'right') {
    const el = scrollRef.current
    if (!el) return
    const amount = 340
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <section className="py-16">
        <div className="container-app">
          <h2 className="text-2xl font-bold text-text-primary md:text-3xl">
            Propiedades destacadas
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-[var(--radius-card)] bg-bg-subtle">
                <div className="aspect-[16/10]" />
                <div className="space-y-3 p-4">
                  <div className="h-5 w-2/3 rounded bg-border" />
                  <div className="h-4 w-full rounded bg-border" />
                  <div className="h-4 w-1/2 rounded bg-border" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (properties.length === 0) return null

  return (
    <section className="py-16">
      <div className="container-app">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary md:text-3xl">
              Propiedades destacadas
            </h2>
            <p className="mt-1 text-text-secondary">
              Las mejores oportunidades seleccionadas para vos
            </p>
          </div>
          <Link
            to="/propiedades"
            className="hidden text-sm font-semibold text-primary hover:text-primary-500 md:block"
          >
            Ver todas &rarr;
          </Link>
        </div>

        {/* Slider */}
        <div
          className="relative mt-8"
          onMouseEnter={() => setAutoplay(false)}
          onMouseLeave={() => setAutoplay(true)}
        >
          {/* Scroll buttons */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scroll('left')}
              className="absolute -left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-bg-card shadow-card transition-shadow hover:shadow-card-hover"
              aria-label="Anterior"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => scroll('right')}
              className="absolute -right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-bg-card shadow-card transition-shadow hover:shadow-card-hover"
              aria-label="Siguiente"
            >
              <ChevronRight size={20} />
            </button>
          )}

          <div
            ref={scrollRef}
            className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2"
            style={{ scrollbarWidth: 'none' }}
          >
            {properties.map((prop) => (
              <div
                key={prop.id}
                className="w-[300px] shrink-0 snap-start sm:w-[320px]"
              >
                <PropertyCard property={prop} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center md:hidden">
          <Link
            to="/propiedades"
            className="text-sm font-semibold text-primary hover:text-primary-500"
          >
            Ver todas las propiedades &rarr;
          </Link>
        </div>
      </div>
    </section>
  )
}
