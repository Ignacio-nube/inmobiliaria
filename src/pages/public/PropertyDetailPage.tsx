import { useParams, Link } from 'react-router'
import {
  Bed,
  Bath,
  Maximize,
  Car,
  MapPin,
  Calendar,
  ArrowLeft,
  Share2,
  MessageCircle,
  Phone,
  Ruler,
} from 'lucide-react'
import { usePropertyBySlug } from '@/hooks/useProperties'
import { useOrganization } from '@/hooks/useOrganization'
import ImageGallery from '@/components/property/ImageGallery'
import ContactForm from '@/components/contact/ContactForm'
import Badge, { getOperacionBadgeVariant } from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { useSEO } from '@/hooks/useSEO'
import {
  formatPrice,
  formatSuperficie,
  getWhatsAppUrl,
  getPhoneUrl,
} from '@/lib/formatters'
import {
  TIPO_OPERACION_LABELS,
  TIPO_PROPIEDAD_LABELS,
  ANTIGUEDAD_LABELS,
} from '@/lib/constants'

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
      <nav className="mb-4 flex items-center gap-2 text-sm text-text-secondary">
        <Link to="/propiedades" className="flex items-center gap-1 hover:text-primary">
          <ArrowLeft size={14} />
          Propiedades
        </Link>
        <span>/</span>
        <span className="truncate text-text-primary">{property.titulo}</span>
      </nav>

      {/* Gallery */}
      <ImageGallery images={property.inmob_imagenes} title={property.titulo} />

      {/* Main content */}
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left: property info */}
        <div className="min-w-0">
          {/* Badges + price */}
          <div className="flex flex-wrap items-start gap-2">
            <Badge variant={getOperacionBadgeVariant(property.tipo_operacion)}>
              {TIPO_OPERACION_LABELS[property.tipo_operacion]}
            </Badge>
            <Badge variant="neutral">
              {TIPO_PROPIEDAD_LABELS[property.tipo_propiedad]}
            </Badge>
          </div>

          <h1 className="mt-3 text-2xl font-bold text-text-primary md:text-3xl">
            {property.titulo}
          </h1>

          <p
            className={`mt-2 text-2xl font-extrabold ${
              property.moneda === 'USD' ? 'text-accent-usd' : 'text-accent-ars'
            }`}
          >
            {formatPrice(property.precio, property.moneda)}
          </p>

          {/* Location */}
          {ubicacion && (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-text-secondary">
              <MapPin size={16} className="shrink-0 text-primary" />
              {ubicacion}
            </p>
          )}

          {/* Specs grid */}
          <div className="mt-6 grid grid-cols-2 gap-4 rounded-[var(--radius-card)] border border-border bg-bg-card p-5 sm:grid-cols-4">
            {property.dormitorios != null && (
              <SpecItem icon={Bed} label="Dormitorios" value={String(property.dormitorios)} />
            )}
            {property.banos != null && (
              <SpecItem icon={Bath} label="Banos" value={String(property.banos)} />
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
              <SpecItem icon={Calendar} label="Antiguedad" value={ANTIGUEDAD_LABELS[property.antiguedad] ?? property.antiguedad} />
            )}
          </div>

          {/* Description */}
          {property.descripcion && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-text-primary">Descripcion</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-text-secondary">
                {property.descripcion}
              </p>
            </div>
          )}

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="mt-6">
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
            </div>
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
              className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary"
            >
              <Share2 size={16} />
              Compartir propiedad
            </button>
          </div>
        </div>

        {/* Right sidebar: contact */}
        <aside className="space-y-4">
          {/* Quick CTA buttons */}
          <div className="rounded-[var(--radius-card)] border border-border bg-bg-card p-5">
            <h3 className="text-base font-semibold text-text-primary">Consultar por esta propiedad</h3>

            <div className="mt-4 space-y-3">
              {organization?.whatsapp && (
                <a
                  href={getWhatsAppUrl(organization.whatsapp, property.titulo)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button variant="whatsapp" fullWidth size="lg">
                    <MessageCircle size={18} />
                    WhatsApp
                  </Button>
                </a>
              )}
              {organization?.telefono && (
                <a href={getPhoneUrl(organization.telefono)} className="block">
                  <Button variant="outline" fullWidth size="lg">
                    <Phone size={18} />
                    Llamar
                  </Button>
                </a>
              )}
            </div>
          </div>

          {/* Contact form */}
          <div className="rounded-[var(--radius-card)] border border-border bg-bg-card p-5">
            <h3 className="mb-4 text-base font-semibold text-text-primary">Enviar consulta</h3>
            <ContactForm
              organizacionId={organization?.id}
              propiedadId={property.id}
            />
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
    <div className="flex flex-col items-center gap-1 text-center">
      <Icon size={20} className="text-primary" />
      <span className="text-xs text-text-secondary">{label}</span>
      <span className="text-sm font-semibold text-text-primary">{value}</span>
    </div>
  )
}
