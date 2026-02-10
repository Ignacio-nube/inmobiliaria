import { useParams, Link } from 'react-router'
import { motion } from 'framer-motion'
import {
  Bed,
  Bath,
  Maximize,
  Car,
  MapPin,
  Calendar,
  Share2,
  MessageCircle,
  Phone,
  Ruler,
} from 'lucide-react'
import { usePropertyBySlug } from '@/hooks/useProperties'
import { useOrganization } from '@/hooks/useOrganization'
import ImageGallery from '@/components/property/ImageGallery'
import ContactForm from '@/components/contact/ContactForm'
import { useSEO } from '@/hooks/useSEO'
import {
  formatPrice,
  formatSuperficie,
  getWhatsAppUrl,
  getPhoneUrl,
  getOperacionBadgeVariant,
} from '@/lib/formatters'
import {
  TIPO_OPERACION_LABELS,
  TIPO_PROPIEDAD_LABELS,
  ANTIGUEDAD_LABELS,
} from '@/lib/constants'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
} as const

export default function PropertyDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { property, loading, error } = usePropertyBySlug(slug ?? '')
  const { organization } = useOrganization()

  const mainImage = property?.inmob_imagenes?.find((img) => img.es_principal)?.url
    || property?.inmob_imagenes?.[0]?.url

  useSEO({
    title: property?.titulo,
    description: property?.descripcion?.slice(0, 160) || undefined,
    ogImage: mainImage || undefined,
    ogType: 'article',
  })

  if (loading) {
    return (
      <div className="container-app py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-48 rounded bg-bg-subtle" />
          <div className="aspect-video rounded-[var(--radius-card)] bg-bg-subtle" />
          <div className="space-y-3">
            <div className="h-8 w-2/3 rounded bg-bg-subtle" />
            <div className="h-5 w-1/3 rounded bg-bg-subtle" />
            <div className="h-24 rounded bg-bg-subtle" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="container-app py-16 text-center">
        <h2 className="text-2xl font-bold text-text-primary">Propiedad no encontrada</h2>
        <p className="mt-2 text-text-secondary">
          Es posible que la propiedad haya sido eliminada o el enlace sea incorrecto.
        </p>
        <Link to="/propiedades" className="mt-4 inline-block text-sm font-semibold text-primary hover:text-primary-500">
          &larr; Volver a propiedades
        </Link>
      </div>
    )
  }

  const ubicacion = [property.direccion, property.barrio, property.ciudad, property.provincia]
    .filter(Boolean)
    .join(', ')

  return (
    <div className="container-app py-6 lg:py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs font-medium text-text-tertiary">
        <Link to="/" className="hover:text-primary transition-colors">Inicio</Link>
        <span>/</span>
        <Link to="/propiedades" className="hover:text-primary transition-colors">Propiedades</Link>
        <span>/</span>
        <span className="truncate text-text-secondary">{property.titulo}</span>
      </nav>

      {/* Property Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative mb-8 overflow-hidden rounded-[var(--radius-card)] border border-border bg-bg-card shadow-sm transition-all hover:shadow-md"
      >
        {/* Decorative background element */}
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-primary/8 blur-2xl" />
        
        <div className="relative flex flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-10">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={getOperacionBadgeVariant(property.tipo_operacion)}>
                {TIPO_OPERACION_LABELS[property.tipo_operacion]}
              </Badge>
              <Badge variant="neutral">
                {TIPO_PROPIEDAD_LABELS[property.tipo_propiedad]}
              </Badge>
            </div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-text-primary md:text-4xl">
              {property.titulo}
            </h1>
            {ubicacion && (
              <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-text-secondary">
                <MapPin size={16} className="shrink-0 text-primary" />
                {ubicacion}
              </p>
            )}
          </div>

          <div className="flex flex-col items-start gap-1 md:items-end">
            <span className="text-xs font-bold uppercase tracking-wider text-text-tertiary">Precio de la propiedad</span>
            <p
              className={`text-3xl font-black md:text-4xl ${
                property.moneda === 'USD' ? 'text-accent-usd' : 'text-accent-ars'
              }`}
            >
              {formatPrice(property.precio, property.moneda)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Gallery */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-8"
      >
        <ImageGallery images={property.inmob_imagenes} title={property.titulo} />
      </motion.div>

      {/* Main content */}
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left: property info */}
        <div className="min-w-0">
          {/* Specs grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-4 rounded-[var(--radius-card)] border border-border bg-bg-card p-6 shadow-sm sm:grid-cols-4 lg:p-8"
          >
            {property.dormitorios != null && (
              <SpecItem icon={Bed} label="Dormitorios" value={String(property.dormitorios)} />
            )}
            {property.banos != null && (
              <SpecItem icon={Bath} label="Baños" value={String(property.banos)} />
            )}
            {property.superficie_total != null && (
              <SpecItem icon={Maximize} label="Sup. total" value={formatSuperficie(property.superficie_total)} />
            )}
            {property.superficie_cubierta != null && (
              <SpecItem icon={Ruler} label="Sup. cubierta" value={formatSuperficie(property.superficie_cubierta)} />
            )}
            {property.cochera && (
              <SpecItem icon={Car} label="Cochera" value="Si" />
            )}
            {property.antiguedad && (
              <SpecItem icon={Calendar} label="Antigüedad" value={ANTIGUEDAD_LABELS[property.antiguedad] ?? property.antiguedad} />
            )}
          </motion.div>

          {/* Description */}
          {property.descripcion && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 rounded-[var(--radius-card)] border border-border bg-bg-card p-6 shadow-sm lg:p-8"
            >
              <h2 className="text-xl font-bold text-text-primary">Descripción de la propiedad</h2>
              <div className="mt-4 h-1 w-12 rounded-full bg-primary" />
              <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-text-secondary">
                {property.descripcion}
              </p>
            </motion.div>
          )}

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-6"
            >
              <h2 className="text-lg font-semibold text-text-primary">Amenities</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {property.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="rounded-full bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Share */}
          <div className="mt-6 border-t border-border pt-4">
            <button
              type="button"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: property.titulo,
                    url: window.location.href,
                  })
                } else {
                  navigator.clipboard.writeText(window.location.href)
                }
              }}
              className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors"
            >
              <Share2 size={16} />
              Compartir propiedad
            </button>
          </div>
        </div>

        {/* Right sidebar: contact */}
        <aside className="space-y-6">
          <div className="lg:sticky lg:top-24 space-y-6">
            {/* Quick CTA buttons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="rounded-[var(--radius-card)] border border-border bg-bg-card p-6 shadow-sm ring-1 ring-primary/5"
            >
              <h3 className="text-base font-bold text-text-primary">Consultar ahora</h3>
              <p className="mt-1 text-xs text-text-tertiary">Obtené una respuesta inmediata</p>

              <div className="mt-6 space-y-3">
                {organization?.whatsapp && (
                  <a
                    href={getWhatsAppUrl(organization.whatsapp, property.titulo)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button variant="whatsapp" fullWidth size="lg" className="shadow-lg shadow-green-500/20">
                      <MessageCircle size={18} />
                      WhatsApp
                    </Button>
                  </a>
                )}
                {organization?.telefono && (
                  <a href={getPhoneUrl(organization.telefono)} className="block">
                    <Button variant="outline" fullWidth size="lg">
                      <Phone size={18} />
                      Llamar ahora
                    </Button>
                  </a>
                )}
              </div>
            </motion.div>

            {/* Contact form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="rounded-[var(--radius-card)] border border-border bg-bg-card p-6 shadow-sm"
            >
              <h3 className="mb-1 text-base font-bold text-text-primary">Enviar mensaje</h3>
              <p className="mb-6 text-xs text-text-tertiary">Te contactaremos a la brevedad</p>
              <ContactForm
                organizacionId={organization?.id}
                propiedadId={property.id}
              />
            </motion.div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function SpecItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  value: string
}) {
  return (
    <motion.div
      variants={itemVariants}
      className="flex flex-col items-center gap-1 text-center"
    >
      <Icon size={20} className="text-primary" />
      <span className="text-xs text-text-secondary">{label}</span>
      <span className="text-sm font-semibold text-text-primary">{value}</span>
    </motion.div>
  )
}
