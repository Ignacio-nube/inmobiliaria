import { Navigate, Outlet } from 'react-router'
import { useAuth } from '@/hooks/useAuth'

/**
 * Protege rutas admin: redirige a /admin/login si no autenticado
 */
export default function AuthGuard() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-subtle">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
