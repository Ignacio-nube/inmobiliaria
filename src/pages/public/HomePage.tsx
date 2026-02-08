import { Link } from 'react-router'
import { Building2, Phone, MessageCircle } from 'lucide-react'
import HeroSection from '@/components/property/HeroSection'
import FeaturedProperties from '@/components/property/FeaturedProperties'
import { useFeaturedProperties } from '@/hooks/useProperties'
import { useOrganization } from '@/hooks/useOrganization'
import { getWhatsAppUrl, getPhoneUrl } from '@/lib/formatters'
import { useSEO } from '@/hooks/useSEO'
import { useInView } from '@/hooks/useInView'
import Button from '@/components/ui/Button'

export default function HomePage() {
  const { organization } = useOrganization()
  const { properties, loading } = useFeaturedProperties(organization?.id)

  const statsSection = useInView()
  const ctaSection = useInView()
  const contactSection = useInView()

  useSEO({
    description: 'Encontrá tu próximo hogar. Casas, departamentos, terrenos y más en venta y alquiler.',
  })

  return (
    <>
      {/* Hero */}
      <HeroSection organization={organization} />

      {/* Featured Properties */}
      <FeaturedProperties properties={properties} loading={loading} />

      {/* Stats / Value prop */}
      <section ref={statsSection.ref} className="bg-primary-900 py-16 text-white">
        <div className="container-app">
          <div className="grid gap-8 text-center sm:grid-cols-3">
            {[
              { value: '+200', label: 'Propiedades publicadas' },
              { value: '+15', label: 'Anos de experiencia' },
              { value: '+500', label: 'Familias felices' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`appear-ready ${statsSection.inView ? 'appeared' : ''}`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <p className="text-4xl font-extrabold">{stat.value}</p>
                <p className="mt-1 text-primary-200">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaSection.ref} className="py-16">
        <div className="container-app">
          <div className={`rounded-2xl bg-bg-subtle p-8 text-center md:p-12 appear-ready ${ctaSection.inView ? 'appeared' : ''}`}>
            <Building2 size={48} className="mx-auto text-primary" />
            <h2 className="mt-4 text-2xl font-bold text-text-primary md:text-3xl">
              Busca la propiedad ideal para vos
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-text-secondary">
              Explora nuestro catalogo completo con filtros avanzados para encontrar
              exactamente lo que necesitas.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/propiedades">
                <Button size="lg">Ver propiedades</Button>
              </Link>
              <Link to="/contacto">
                <Button variant="outline" size="lg">Contactanos</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact quick section */}
      {organization && (
        <section ref={contactSection.ref} className="border-t border-border bg-bg-card py-16">
          <div className={`container-app text-center appear-ready ${contactSection.inView ? 'appeared' : ''}`}>
            <h2 className="text-2xl font-bold text-text-primary">
              Comunicate con nosotros
            </h2>
            <p className="mt-2 text-text-secondary">
              Estamos para ayudarte a encontrar tu proximo hogar
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {organization.whatsapp && (
                <a
                  href={getWhatsAppUrl(organization.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="whatsapp" size="lg">
                    <MessageCircle size={18} />
                    WhatsApp
                  </Button>
                </a>
              )}
              {organization.telefono && (
                <a href={getPhoneUrl(organization.telefono)}>
                  <Button variant="outline" size="lg">
                    <Phone size={18} />
                    Llamar
                  </Button>
                </a>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
