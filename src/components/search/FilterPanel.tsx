import { X, SlidersHorizontal } from 'lucide-react'
import { useFilters } from '@/hooks/useFilters'
import {
  TIPO_OPERACION_LABELS,
  TIPO_PROPIEDAD_LABELS,
  ANTIGUEDAD_LABELS,
  MONEDA_LABELS,
} from '@/lib/constants'
import type { PropertyFilters } from '@/types/filters'

interface FilterPanelProps {
  className?: string
  onClose?: () => void
}

export default function FilterPanel({ className = '', onClose }: FilterPanelProps) {
  const { filters, setFilter, resetFilters, activeFilterCount } = useFilters()

  return (
    <div className={`space-y-5 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
          <SlidersHorizontal size={16} />
          Filtros
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white">
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs text-text-secondary hover:text-primary"
            >
              Limpiar
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-text-secondary hover:bg-bg-subtle lg:hidden"
              aria-label="Cerrar filtros"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Operacion */}
      <FilterSelect
        label="Operacion"
        value={filters.tipo_operacion ?? ''}
        onChange={(v) => setFilter('tipo_operacion', (v || undefined) as PropertyFilters['tipo_operacion'])}
        options={TIPO_OPERACION_LABELS}
        placeholder="Todas"
      />

      {/* Tipo propiedad */}
      <FilterSelect
        label="Tipo de propiedad"
        value={filters.tipo_propiedad ?? ''}
        onChange={(v) => setFilter('tipo_propiedad', (v || undefined) as PropertyFilters['tipo_propiedad'])}
        options={TIPO_PROPIEDAD_LABELS}
        placeholder="Todos"
      />

      {/* Moneda */}
      <FilterSelect
        label="Moneda"
        value={filters.moneda ?? ''}
        onChange={(v) => setFilter('moneda', (v || undefined) as PropertyFilters['moneda'])}
        options={MONEDA_LABELS}
        placeholder="Todas"
      />

      {/* Precio */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-text-secondary">Precio</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.precio_min ?? ''}
            onChange={(e) =>
              setFilter('precio_min', e.target.value ? Number(e.target.value) : undefined)
            }
            className="w-full rounded-[var(--radius-input)] border border-border bg-bg-card px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.precio_max ?? ''}
            onChange={(e) =>
              setFilter('precio_max', e.target.value ? Number(e.target.value) : undefined)
            }
            className="w-full rounded-[var(--radius-input)] border border-border bg-bg-card px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Dormitorios */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-text-secondary">
          Dormitorios (min)
        </label>
        <div className="flex gap-1.5">
          {[null, 1, 2, 3, 4].map((n) => (
            <button
              key={n ?? 'all'}
              type="button"
              onClick={() =>
                setFilter('dormitorios_min', n ?? undefined)
              }
              className={`flex-1 rounded-[var(--radius-button)] border px-2 py-2 text-xs font-medium transition-colors ${
                (filters.dormitorios_min ?? null) === n
                  ? 'border-primary bg-primary-50 text-primary'
                  : 'border-border text-text-secondary hover:border-primary-200'
              }`}
            >
              {n === null ? 'Todos' : `${n}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Banos */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-text-secondary">
          Banos (min)
        </label>
        <div className="flex gap-1.5">
          {[null, 1, 2, 3].map((n) => (
            <button
              key={n ?? 'all'}
              type="button"
              onClick={() =>
                setFilter('banos_min', n ?? undefined)
              }
              className={`flex-1 rounded-[var(--radius-button)] border px-2 py-2 text-xs font-medium transition-colors ${
                (filters.banos_min ?? null) === n
                  ? 'border-primary bg-primary-50 text-primary'
                  : 'border-border text-text-secondary hover:border-primary-200'
              }`}
            >
              {n === null ? 'Todos' : `${n}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Superficie */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-text-secondary">
          Superficie total (m2)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.superficie_min ?? ''}
            onChange={(e) =>
              setFilter('superficie_min', e.target.value ? Number(e.target.value) : undefined)
            }
            className="w-full rounded-[var(--radius-input)] border border-border bg-bg-card px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.superficie_max ?? ''}
            onChange={(e) =>
              setFilter('superficie_max', e.target.value ? Number(e.target.value) : undefined)
            }
            className="w-full rounded-[var(--radius-input)] border border-border bg-bg-card px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Cochera */}
      <label className="flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          checked={filters.cochera ?? false}
          onChange={(e) =>
            setFilter('cochera', e.target.checked || undefined)
          }
          className="h-4 w-4 rounded border-border accent-primary"
        />
        <span className="text-sm text-text-primary">Con cochera</span>
      </label>

      {/* Antiguedad */}
      <FilterSelect
        label="Antiguedad"
        value={filters.antiguedad ?? ''}
        onChange={(v) => setFilter('antiguedad', (v || undefined) as PropertyFilters['antiguedad'])}
        options={ANTIGUEDAD_LABELS}
        placeholder="Todas"
      />

      {/* Ciudad */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-text-secondary">Ciudad</label>
        <input
          type="text"
          placeholder="Ej: Rosario"
          value={filters.ciudad ?? ''}
          onChange={(e) => setFilter('ciudad', e.target.value || undefined)}
          className="w-full rounded-[var(--radius-input)] border border-border bg-bg-card px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </div>

      {/* Barrio */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-text-secondary">Barrio</label>
        <input
          type="text"
          placeholder="Ej: Fisherton"
          value={filters.barrio ?? ''}
          onChange={(e) => setFilter('barrio', e.target.value || undefined)}
          className="w-full rounded-[var(--radius-input)] border border-border bg-bg-card px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </div>

      {/* Mobile apply button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-[var(--radius-button)] bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-500 lg:hidden"
        >
          Aplicar filtros
        </button>
      )}
    </div>
  )
}

// Reusable filter select
function FilterSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: Record<string, string>
  placeholder: string
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-text-secondary">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-[var(--radius-input)] border border-border bg-bg-card px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
      >
        <option value="">{placeholder}</option>
        {Object.entries(options).map(([val, lbl]) => (
          <option key={val} value={val}>
            {lbl}
          </option>
        ))}
      </select>
    </div>
  )
}

// Filter chips that appear above results
export function FilterChips() {
  const { filters, removeFilter, getFilterLabel, activeFilterCount, resetFilters } = useFilters()

  if (activeFilterCount === 0) return null

  const entries = Object.entries(filters).filter(
    ([, v]) => v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0)
  ) as [keyof PropertyFilters, unknown][]

  function formatValue(key: keyof PropertyFilters, value: unknown): string {
    if (key === 'tipo_operacion') return TIPO_OPERACION_LABELS[value as string] ?? String(value)
    if (key === 'tipo_propiedad') return TIPO_PROPIEDAD_LABELS[value as string] ?? String(value)
    if (key === 'moneda') return MONEDA_LABELS[value as string] ?? String(value)
    if (key === 'antiguedad') return ANTIGUEDAD_LABELS[value as string] ?? String(value)
    if (key === 'cochera') return 'Si'
    return String(value)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {entries.map(([key, value]) => (
        <span
          key={key}
          className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary"
        >
          {getFilterLabel(key)}: {formatValue(key, value)}
          <button
            type="button"
            onClick={() => removeFilter(key)}
            className="ml-0.5 rounded-full p-0.5 hover:bg-primary-100"
            aria-label={`Quitar filtro ${getFilterLabel(key)}`}
          >
            <X size={12} />
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={resetFilters}
        className="text-xs text-text-secondary hover:text-primary"
      >
        Limpiar todo
      </button>
    </div>
  )
}
