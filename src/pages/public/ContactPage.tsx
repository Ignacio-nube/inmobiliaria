import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import ContactForm from '@/components/contact/ContactForm'
import { useOrganization } from '@/hooks/useOrganization'
import { useSEO } from '@/hooks/useSEO'

export default function ContactPage() {
  const { organization } = useOrganization()

  useSEO({
    title: 'Contacto',
    description: 'Contactanos para consultas sobre propiedades en venta y alquiler.',
  })

  return (
    <div className="container-app py-8 lg:py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold text-text-primary md:text-3xl">Contacto</h1>
        <p className="mt-2 text-text-secondary">
          Dejanos tu consulta y te responderemos a la brevedad.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Form */}
          <div className="rounded-[var(--radius-card)] border border-border bg-bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold text-text-primary">
              Enviar consulta
            </h2>
            <ContactForm organizacionId={organization?.id} />
          </div>

          {/* Info sidebar */}
          <div className="space-y-6">
            {organization?.direccion && (
              <InfoItem
                icon={MapPin}
                title="Direccion"
                text={[organization.direccion, organization.ciudad, organization.provincia]
                  .filter(Boolean)
                  .join(', ')}
              />
            )}
            {organization?.telefono && (
              <InfoItem
                icon={Phone}
                title="Telefono"
                text={organization.telefono}
                href={`tel:${organization.telefono}`}
              />
            )}
            {organization?.email && (
              <InfoItem
                icon={Mail}
                title="Email"
                text={organization.email}
                href={`mailto:${organization.email}`}
              />
            )}
            <InfoItem
              icon={Clock}
              title="Horarios"
              text="Lunes a Viernes 9:00 a 18:00"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoItem({
  icon: Icon,
  title,
  text,
  href,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  title: string
  text: string
  href?: string
}) {
  const content = href ? (
    <a href={href} className="text-sm text-primary hover:text-primary-500">{text}</a>
  ) : (
    <span className="text-sm text-text-secondary">{text}</span>
  )

  return (
    <div className="flex gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-sm font-medium text-text-primary">{title}</p>
        {content}
      </div>
    </div>
  )
}
