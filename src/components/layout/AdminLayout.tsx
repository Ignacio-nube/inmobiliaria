import { Link, NavLink, Outlet, useNavigate } from 'react-router'
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  Settings,
  LogOut,
  Menu,
  X,
  MessageSquare,
} from 'lucide-react'
import { useState, Suspense } from 'react'
import { useAuth } from '@/hooks/useAuth'

function AdminPageLoader() {
  return (
    <div className="flex min-h-[400px] w-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { signOut, profile } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/admin/login')
  }

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/propiedades', icon: Building2, label: 'Propiedades', end: false },
    { to: '/admin/propiedades/nueva', icon: PlusCircle, label: 'Nueva propiedad', end: false },
    { to: '/admin/consultas', icon: MessageSquare, label: 'Consultas', end: false },
    { to: '/admin/configuracion', icon: Settings, label: 'Configuración', end: false },
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-bg-subtle">
      {/* Sidebar Desktop */}
      <aside className="hidden w-64 flex-col border-r border-border bg-bg-card lg:flex">
        <div className="flex h-16 shrink-0 items-center border-b border-border px-6">
          <Link to="/admin" className="text-lg font-bold text-primary">
            Admin Panel
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto space-y-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-text-secondary hover:bg-bg-subtle hover:text-text-primary'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="shrink-0 border-t border-border p-4">
          <div className="mb-3 truncate text-xs text-text-tertiary">
            {profile?.email}
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-subtle hover:text-error"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col transform border-r border-border bg-bg-card transition-transform duration-300 lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-6">
          <Link to="/admin" className="text-lg font-bold text-primary">
            Admin Panel
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1 text-text-secondary hover:bg-bg-subtle"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto space-y-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-text-secondary hover:bg-bg-subtle hover:text-text-primary'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="shrink-0 border-t border-border p-4">
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary hover:bg-bg-subtle hover:text-error"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar mobile */}
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border bg-bg-card px-4 lg:px-8">
          <button
            type="button"
            className="rounded-lg p-2 text-text-secondary hover:bg-bg-subtle lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <Link
            to="/"
            className="text-sm text-text-secondary hover:text-primary transition-colors"
            target="_blank"
          >
            Ver sitio
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Suspense fallback={<AdminPageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
