import { Link } from 'react-router'
import { Home, Search, ArrowLeft } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useSEO } from '@/hooks/useSEO'

export default function NotFoundPage() {
  useSEO({ title: 'Página no encontrada' })
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="text-8xl font-bold text-primary/20 mb-4">404</div>
        <h1 className="text-3xl font-bold text-text-primary mb-3">
          Pagina no encontrada
        </h1>
        <p className="text-text-secondary mb-8 text-lg">
          Lo sentimos, la pagina que buscas no existe o fue movida.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button variant="primary" size="lg">
              <Home className="h-5 w-5 mr-2" />
              Ir al inicio
            </Button>
          </Link>
          <Link to="/propiedades">
            <Button variant="outline" size="lg">
              <Search className="h-5 w-5 mr-2" />
              Ver propiedades
            </Button>
          </Link>
        </div>
        <button
          onClick={() => window.history.back()}
          className="mt-6 inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver atras
        </button>
      </div>
    </div>
  )
}
