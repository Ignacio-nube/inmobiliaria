import { Link } from 'react-router'
import { Building2, Phone, MessageCircle, Scale } from 'lucide-react'
import HeroSection from '@/components/property/HeroSection'
import FeaturedProperties from '@/components/property/FeaturedProperties'
import { useFeaturedProperties } from '@/hooks/useProperties'
import { useOrganization } from '@/contexts/OrganizationContext'
import { getWhatsAppUrl, getPhoneUrl } from '@/lib/formatters'
import { useSEO } from '@/hooks/useSEO'
import { useInView } from '@/hooks/useInView'
import Button from '@/components/ui/Button'

export default function HomePage() {
  const { organization } = useOrganization()
  const { properties, loading } = useFeaturedProperties(organization?.id)

  const statsSection = useInView()
  const ctaSection = useInView()
  const compareSection = useInView()
  const contactSection = useInView()

  useSEO({
    description: 'Encontrá tu próximo hogar. Casas, departamentos, terrenos y más en venta y alquiler.',
  })

  return (
    <>
      {/* Hero */}
      <HeroSection organization={organization} />

      {/* Featured Properties */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        {/* Decorative background element */}
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -left-10 bottom-1/4 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />
        
        <div className="relative">
          <FeaturedProperties properties={properties} loading={loading} />
        </div>
      </section>

      {/* Compare Properties Highlight */}
      <section ref={compareSection.ref} className="relative overflow-hidden bg-bg-subtle py-16 lg:py-24">
        <div className="container-app">
          <div className="flex flex-col items-center gap-12 md:flex-row md:justify-between">
            <div className={`max-w-xl text-center md:text-left transition-all duration-700 ${compareSection.inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20">
                <Scale size={28} />
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-text-primary md:text-4xl">
                Compará propiedades fácilmente
              </h2>
              <div className="mt-4 h-1.5 w-12 rounded-full bg-primary mx-auto md:mx-0" />
              <p className="mt-6 text-lg leading-relaxed text-text-secondary">
                ¿No te decidís entre dos opciones? Agregalas a la lista de comparación y revisá sus características lado a lado para tomar la mejor decisión.
              </p>
              <div className="mt-10">
                <Link to="/propiedades">
                  <Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20">
                    Empezar a buscar
                  </Button>
                </Link>
              </div>
            </div>
            <div className={`flex flex-1 justify-center md:justify-end transition-all duration-1000 delay-300 ${compareSection.inView ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`}>
              <div className="relative h-72 w-full max-w-sm rounded-[var(--radius-card)] bg-bg-card p-8 shadow-2xl border border-border ring-1 ring-primary/5">
                {/* Mockup comparing cards */}
                <div className="space-y-5">
                  <div className="flex items-center gap-4 border-b border-border pb-5">
                    <div className="h-14 w-20 rounded-lg bg-bg-subtle skeleton-shimmer" />
                    <div className="flex-1 space-y-2.5">
                      <div className="h-3 w-3/4 rounded bg-bg-subtle" />
                      <div className="h-3 w-1/2 rounded bg-bg-subtle" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-20 rounded-lg bg-bg-subtle skeleton-shimmer" />
                    <div className="flex-1 space-y-2.5">
                      <div className="h-3 w-3/4 rounded bg-bg-subtle" />
                      <div className="h-3 w-1/2 rounded bg-bg-subtle" />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-center">
                    <div className="h-12 w-full rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm tracking-wide shadow-sm">
                      Comparar seleccionadas
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats / Value prop */}
      <section ref={statsSection.ref} className="relative overflow-hidden bg-primary-950 py-20 text-white lg:py-28">
        {/* Background texture/overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-400 via-transparent to-transparent" />
        
        <div className="container-app relative">
          <div className="grid gap-12 text-center sm:grid-cols-3">
            {[
              { value: '+200', label: 'Propiedades publicadas' },
              { value: '+15', label: 'Años de experiencia' },
              { value: '+500', label: 'Familias felices' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`transition-all duration-700 ${statsSection.inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                style={{ transitionDelay: `${i * 200}ms` }}
              >
                <p className="text-5xl font-black tracking-tight text-white md:text-6xl drop-shadow-md">{stat.value}</p>
                <p className="mt-3 text-sm font-bold uppercase tracking-widest text-primary-200 drop-shadow-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaSection.ref} className="py-20 lg:py-32">
        <div className="container-app">
          <div className={`relative overflow-hidden rounded-[var(--radius-card)] bg-bg-subtle p-10 text-center md:p-20 border border-border shadow-sm transition-all duration-1000 ${ctaSection.inView ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            {/* Background elements */}
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
            
            <div className="relative">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-bg-card shadow-sm border border-border text-primary">
                <Building2 size={32} />
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-text-primary md:text-4xl lg:text-5xl">
                Buscá la propiedad ideal para vos
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary">
                Explorá nuestro catálogo completo con filtros avanzados para encontrar
                exactamente lo que necesitás.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link to="/propiedades">
                  <Button size="lg" className="rounded-full px-8 h-14 text-base shadow-xl shadow-primary/20">Ver propiedades</Button>
                </Link>
                <Link to="/contacto">
                  <Button variant="outline" size="lg" className="rounded-full px-8 h-14 text-base bg-bg-card">Contactanos</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact quick section */}
      {organization && (
        <section ref={contactSection.ref} className="border-t border-border bg-bg-card py-20">
          <div className={`container-app text-center transition-all duration-700 ${contactSection.inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <h2 className="text-3xl font-extrabold tracking-tight text-text-primary md:text-4xl">
              Comunicate con nosotros
            </h2>
            <div className="mx-auto mt-4 h-1 w-12 rounded-full bg-primary" />
            <p className="mt-6 text-lg text-text-secondary">
              Estamos para ayudarte a encontrar tu próximo hogar
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {organization.whatsapp && (
                <a
                  href={getWhatsAppUrl(organization.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button variant="whatsapp" size="lg" className="w-full rounded-full px-8 h-14 shadow-lg shadow-green-500/20">
                    <MessageCircle size={20} />
                    WhatsApp
                  </Button>
                </a>
              )}
              {organization.telefono && (
                <a href={getPhoneUrl(organization.telefono)} className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full rounded-full px-8 h-14 bg-bg-card shadow-sm">
                    <Phone size={20} />
                    Llamar ahora
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

