import { BrowserRouter, Routes, Route } from 'react-router'
import { lazy, Suspense } from 'react'
import { Toaster } from 'react-hot-toast'

// Layouts
import PublicLayout from '@/components/layout/PublicLayout'
import AdminLayout from '@/components/layout/AdminLayout'
import AuthGuard from '@/components/layout/AuthGuard'

// Public pages (lazy loaded)
const HomePage = lazy(() => import('@/pages/public/HomePage'))
const SearchResultsPage = lazy(() => import('@/pages/public/SearchResultsPage'))
const PropertyDetailPage = lazy(() => import('@/pages/public/PropertyDetailPage'))
const ContactPage = lazy(() => import('@/pages/public/ContactPage'))
const FavoritesPage = lazy(() => import('@/pages/public/FavoritesPage'))
const ComparePage = lazy(() => import('@/pages/public/ComparePage'))
const NotFoundPage = lazy(() => import('@/pages/public/NotFoundPage'))

// Admin pages (lazy loaded)
const LoginPage = lazy(() => import('@/pages/admin/LoginPage'))
const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage'))
const PropertiesListPage = lazy(() => import('@/pages/admin/PropertiesListPage'))
const PropertyEditPage = lazy(() => import('@/pages/admin/PropertyEditPage'))
const SettingsPage = lazy(() => import('@/pages/admin/SettingsPage'))
const ConsultasPage = lazy(() => import('@/pages/admin/ConsultasPage'))

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="propiedades" element={<SearchResultsPage />} />
            <Route path="propiedades/:slug" element={<PropertyDetailPage />} />
            <Route path="favoritos" element={<FavoritesPage />} />
            <Route path="comparar" element={<ComparePage />} />
            <Route path="contacto" element={<ContactPage />} />
          </Route>

          {/* Admin login (sin layout admin) */}
          <Route path="admin/login" element={<LoginPage />} />

          {/* Admin routes (protegidas) */}
          <Route element={<AuthGuard />}>
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="propiedades" element={<PropertiesListPage />} />
              <Route path="propiedades/nueva" element={<PropertyEditPage />} />
              <Route path="propiedades/:id" element={<PropertyEditPage />} />
              <Route path="configuracion" element={<SettingsPage />} />
              <Route path="consultas" element={<ConsultasPage />} />
            </Route>
          </Route>
          {/* 404 catch-all */}
          <Route element={<PublicLayout />}>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '0.75rem',
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
          },
          success: {
            iconTheme: { primary: '#2D9B6E', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#DC2626', secondary: '#fff' },
          },
        }}
      />
    </BrowserRouter>
  )
}
