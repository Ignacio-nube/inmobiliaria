import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { Search } from 'lucide-react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { TIPO_OPERACION_LABELS, TIPO_PROPIEDAD_LABELS } from '@/lib/constants'
import { useFilterStore } from '@/store/filterStore'
import type { Organizacion, ColoresOrganizacion } from '@/types/property'

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
  
  // Get current theme
  const colores = organization?.colores as ColoresOrganizacion | null
  const tema = colores?.tema || 'default'
  const isNeoPop = tema === 'neo-pop'
  const isLuxury = tema === 'luxury'

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

  // Animation Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: isLuxury ? 40 : 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: isLuxury ? 1.2 : 0.5, 
        ease: isLuxury ? [0.22, 1, 0.36, 1] : "easeOut" // Custom easing for luxury (easeOutQuint-ish)
      }
    }
  }

  // Specific Neo Pop bouncy variants
  const neoPopInputVariants: Variants = {
    initial: { scale: 1 },
    focus: { 
      scale: 1.02, 
      boxShadow: "6px 6px 0px 0px #000000",
      transition: { type: "spring", stiffness: 300, damping: 15 }
    },
    hover: {
      scale: 1.01,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  }

  const neoPopButtonVariants: Variants = {
    initial: { scale: 1, rotate: 0 },
    hover: { 
      scale: 1.05, 
      rotate: -2,
      boxShadow: "6px 6px 0px 0px #000000",
      transition: { type: "spring", stiffness: 300 }
    },
    tap: { 
      scale: 0.95, 
      boxShadow: "0px 0px 0px 0px #000000",
      y: 4,
      x: 4
    }
  }

  // Luxury smooth variants
  const luxuryInputVariants: Variants = {
    initial: { borderBottomColor: "#d6d3d1", backgroundColor: "transparent" },
    focus: { 
      borderBottomColor: "#1c1917",
      backgroundColor: "rgba(255,255,255,0.5)",
      transition: { duration: 0.5 } 
    }
  }

  return (
    <section className="relative h-[70vh] min-h-[480px] overflow-hidden md:h-[85vh] md:min-h-[600px]">
      {/* Background slides */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <motion.img
            src={images[currentSlide]}
            alt=""
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6, ease: "linear" }}
            className="h-full w-full object-cover"
            loading="eager"
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      {/* Content */}
      <div className="relative flex h-full flex-col items-center justify-center px-4 text-center text-white">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full flex flex-col items-center"
        >
          <motion.h1 
            variants={itemVariants}
            className="max-w-3xl text-3xl font-extrabold leading-tight text-white drop-shadow-lg md:text-5xl lg:text-6xl"
          >
            {titulo}
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="mt-4 max-w-xl text-base text-white/90 drop-shadow md:text-lg"
          >
            {subtitulo}
          </motion.p>

          {/* Search bar */}
          <motion.form
            onSubmit={handleSearch}
            variants={itemVariants}
            className={`mt-8 flex w-full max-w-3xl flex-col gap-3 p-4 shadow-2xl backdrop-blur-sm sm:flex-row sm:items-end sm:gap-2 sm:p-2 hero-search-form`}
          >
            <div className="flex-1">
              <label className="mb-1 block text-left text-xs font-medium text-text-secondary sm:hidden">
                Operacion
              </label>
              <motion.select
                value={operacion}
                onChange={(e) => setOperacion(e.target.value)}
                className="w-full border-0 px-4 py-3 text-sm outline-none hero-search-input"
                {...(isNeoPop ? {
                  variants: neoPopInputVariants,
                  initial: "initial",
                  whileFocus: "focus",
                  whileHover: "hover"
                } : isLuxury ? {
                  variants: luxuryInputVariants,
                  initial: "initial",
                  whileFocus: "focus"
                } : {})}
              >
                <option value="">Operacion</option>
                {Object.entries(TIPO_OPERACION_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </motion.select>
            </div>

            <div className="flex-1">
              <label className="mb-1 block text-left text-xs font-medium text-text-secondary sm:hidden">
                Tipo
              </label>
              <motion.select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full border-0 px-4 py-3 text-sm outline-none hero-search-input"
                {...(isNeoPop ? {
                  variants: neoPopInputVariants,
                  initial: "initial",
                  whileFocus: "focus",
                  whileHover: "hover"
                } : isLuxury ? {
                  variants: luxuryInputVariants,
                  initial: "initial",
                  whileFocus: "focus"
                } : {})}
              >
                <option value="">Tipo</option>
                {Object.entries(TIPO_PROPIEDAD_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </motion.select>
            </div>

            <div className="flex-1">
              <label className="mb-1 block text-left text-xs font-medium text-text-secondary sm:hidden">
                Ciudad
              </label>
              <motion.input
                type="text"
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                placeholder="Ciudad o barrio"
                className="w-full border-0 px-4 py-3 text-sm outline-none hero-search-input"
                {...(isNeoPop ? {
                  variants: neoPopInputVariants,
                  initial: "initial",
                  whileFocus: "focus",
                  whileHover: "hover"
                } : isLuxury ? {
                  variants: luxuryInputVariants,
                  initial: "initial",
                  whileFocus: "focus"
                } : {})}
              />
            </div>

            <motion.button
              type="submit"
              className="flex items-center justify-center gap-2 bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-500 hero-search-button"
              {...(isNeoPop ? {
                variants: neoPopButtonVariants,
                initial: "initial",
                whileHover: "hover",
                whileTap: "tap"
              } : {
                whileHover: { scale: 1.02 },
                whileTap: { scale: 0.98 }
              })}
            >
              <Search size={18} />
              <span className="sm:hidden">Buscar</span>
            </motion.button>
          </motion.form>
        </motion.div>

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
