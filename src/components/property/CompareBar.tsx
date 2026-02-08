import { Link } from 'react-router'
import { GitCompareArrows, X } from 'lucide-react'
import { useCompareStore } from '@/store/compareStore'
import Button from '@/components/ui/Button'

export default function CompareBar() {
  const compareIds = useCompareStore((s) => s.compareIds)
  const clearCompare = useCompareStore((s) => s.clearCompare)

  if (compareIds.length === 0) return null

  return (
    <div className="fixed bottom-20 left-1/2 z-40 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-3 rounded-full border border-border bg-bg-card px-5 py-3 shadow-lg">
        <GitCompareArrows size={18} className="text-primary" />
        <span className="text-sm font-medium text-text-primary">
          {compareIds.length} propiedad{compareIds.length !== 1 ? 'es' : ''}
        </span>

        <Link to="/comparar">
          <Button variant="primary" size="sm">
            Comparar
          </Button>
        </Link>

        <button
          onClick={clearCompare}
          className="flex h-7 w-7 items-center justify-center rounded-full text-text-secondary hover:bg-bg-subtle hover:text-text-primary transition-colors"
          title="Limpiar"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
