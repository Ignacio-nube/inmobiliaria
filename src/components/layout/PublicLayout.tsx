import { Link, NavLink, Outlet } from 'react-router'
import { Menu, X, Phone, Heart } from 'lucide-react'
import { useState } from 'react'
import WhatsAppFab from '@/components/contact/WhatsAppFab'
import CompareBar from '@/components/property/CompareBar'
import { useOrganization } from '@/hooks/useOrganization'
import { useFavoritesStore } from '@/store/favoritesStore'
import type { RedesSociales } from '@/types/property'
import { getPhoneUrl } from '@/lib/formatters'

export default function PublicLayout() {
  const { organization, loading } = useOrganization()

  return (
    <div className="flex min-h-screen flex-col">
      <Header organization={organization} loading={loading} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer organization={organization} />
      <CompareBar />
      <WhatsAppFab />
    </div>
  )
}

interface OrgProps {
  organization: ReturnType<typeof useOrganization>['organization']
  loading?: boolean
}

function Header({ organization, loading }: OrgProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const favCount = useFavoritesStore((s) => s.favoriteIds.length)

  const navLinks = [
    { to: '/', label: 'Inicio' },
    { to: '/propiedades', label: 'Propiedades' },
    { to: '/contacto', label: 'Contacto' },
  ]

  const orgName = organization?.nombre ?? 'Inmobiliaria'
  const orgPhone = organization?.telefono
  const orgLogo = organization?.logo_url

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg-card shadow-navbar">
      <div className="container-app flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
          {orgLogo ? (
            <img src={orgLogo} alt={orgName} className="h-10 w-auto object-contain" />
          ) : (
            <span>{loading ? '' : orgName}</span>
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-text-secondary hover:bg-bg-subtle hover:text-text-primary'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/favoritos"
            className="relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-subtle hover:text-red-500"
          >
            <Heart size={18} />
            {favCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {favCount}
              </span>
            )}
          </Link>
          {orgPhone && (
            <a
              href={getPhoneUrl(orgPhone)}
              className="flex items-center gap-2 rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
            >
              <Phone size={16} />
              Llamar
            </a>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="rounded-lg p-2 text-text-secondary hover:bg-bg-subtle md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <nav className="border-t border-border bg-bg-card px-4 pb-4 md:hidden">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-text-secondary hover:bg-bg-subtle hover:text-text-primary'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {orgPhone && (
            <a
              href={getPhoneUrl(orgPhone)}
              className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white"
            >
              <Phone size={16} />
              Llamar ahora
            </a>
          )}
        </nav>
      )}
    </header>
  )
}

function Footer({ organization }: OrgProps) {
  const orgName = organization?.nombre ?? 'Inmobiliaria'
  const orgEmail = organization?.email
  const orgPhone = organization?.telefono
  const redes = organization?.redes_sociales as RedesSociales | null

  return (
    <footer className="border-t border-border bg-primary-900 text-white">
      <div className="container-app py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold">{orgName}</h3>
            <p className="mt-2 text-sm text-primary-200">
              Tu inmobiliaria de confianza en Argentina.
            </p>
            {/* Social links */}
            {redes && (
              <div className="mt-4 flex gap-3">
                {redes.instagram && (
                  <a
                    href={redes.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-300 transition-colors hover:text-white"
                    aria-label="Instagram"
                  >
                    Instagram
                  </a>
                )}
                {redes.facebook && (
                  <a
                    href={redes.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-300 transition-colors hover:text-white"
                    aria-label="Facebook"
                  >
                    Facebook
                  </a>
                )}
                {redes.youtube && (
                  <a
                    href={redes.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-300 transition-colors hover:text-white"
                    aria-label="YouTube"
                  >
                    YouTube
                  </a>
                )}
                {redes.twitter && (
                  <a
                    href={redes.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-300 transition-colors hover:text-white"
                    aria-label="X / Twitter"
                  >
                    X
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold">Navegación</h4>
            <ul className="mt-2 space-y-1">
              <li>
                <Link to="/" className="text-sm text-primary-200 hover:text-white">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/propiedades" className="text-sm text-primary-200 hover:text-white">
                  Propiedades
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-sm text-primary-200 hover:text-white">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold">Contacto</h4>
            <ul className="mt-2 space-y-1 text-sm text-primary-200">
              {orgEmail && (
                <li>
                  <a href={`mailto:${orgEmail}`} className="hover:text-white">
                    {orgEmail}
                  </a>
                </li>
              )}
              {orgPhone && (
                <li>
                  <a href={getPhoneUrl(orgPhone)} className="hover:text-white">
                    {orgPhone}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-primary-700 pt-6 text-center text-xs text-primary-300">
          &copy; {new Date().getFullYear()} {orgName}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
