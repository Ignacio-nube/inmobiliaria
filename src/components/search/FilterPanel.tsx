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
    <div className={`space-y-6 ${className}`}>
      {/* Internal Header (mostly for Mobile) */}
      <div className="flex items-center justify-between lg:hidden">
        <div className="flex items-center gap-2 text-base font-bold text-text-primary">
          <SlidersHorizontal size={18} className="text-primary" />
          Filtros
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-semibold text-text-secondary transition-colors hover:text-primary"
            >
              Limpiar todo
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-bg-subtle p-2 text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
              aria-label="Cerrar filtros"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Desktop Quick Actions */}
      <div className="hidden items-center justify-between lg:flex">
        <span className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
          Refinar búsqueda
        </span>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs font-semibold text-primary transition-colors hover:text-primary-600 hover:underline"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="grid gap-6">
        {/* Operacion */}
        <FilterSelect
          label="Estado de Operación"
          value={filters.tipo_operacion ?? ''}
          onChange={(v) => setFilter('tipo_operacion', (v || undefined) as PropertyFilters['tipo_operacion'])}
          options={TIPO_OPERACION_LABELS}
          placeholder="Venta o Alquiler"
        />

        {/* Tipo propiedad */}
        <FilterSelect
          label="Tipo de Propiedad"
          value={filters.tipo_propiedad ?? ''}
          onChange={(v) => setFilter('tipo_propiedad', (v || undefined) as PropertyFilters['tipo_propiedad'])}
          options={TIPO_PROPIEDAD_LABELS}
          placeholder="Casa, Departamento, etc."
        />

        <div className="grid grid-cols-2 gap-4">
          {/* Moneda */}
          <FilterSelect
            label="Moneda"
            value={filters.moneda ?? ''}
            onChange={(v) => setFilter('moneda', (v || undefined) as PropertyFilters['moneda'])}
            options={MONEDA_LABELS}
            placeholder="Todas"
          />
          
          {/* Cochera */}
          <div className="flex flex-col">
            <span className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-text-tertiary">Extra</span>
            <label className="flex h-10 cursor-pointer items-center gap-2 rounded-[var(--radius-input)] border border-border bg-bg-card px-3 transition-colors hover:border-primary/30">
              <input
                type="checkbox"
                checked={filters.cochera ?? false}
                onChange={(e) =>
                  setFilter('cochera', e.target.checked || undefined)
                }
                className="h-4 w-4 rounded border-border text-primary accent-primary focus:ring-primary/20"
              />
              <span className="text-xs font-medium text-text-primary">Cochera</span>
            </label>
          </div>
        </div>

        {/* Precio */}
        <div className="space-y-2.5">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-text-tertiary">Rango de Precio</label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-text-tertiary">$</span>
              <input
                type="number"
                placeholder="Min"
                value={filters.precio_min ?? ''}
                onChange={(e) =>
                  setFilter('precio_min', e.target.value ? Number(e.target.value) : undefined)
                }
                className="w-full rounded-[var(--radius-input)] border border-border bg-bg-card py-2 pl-7 pr-3 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
            <div className="h-px w-2 bg-border" />
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-text-tertiary">$</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.precio_max ?? ''}
                onChange={(e) =>
                  setFilter('precio_max', e.target.value ? Number(e.target.value) : undefined)
                }
                className="w-full rounded-[var(--radius-input)] border border-border bg-bg-card py-2 pl-7 pr-3 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>
        </div>

        {/* Ambientes (Dormitorios) */}
        <div className="space-y-2.5">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-text-tertiary">
            Dormitorios
          </label>
          <div className="flex gap-1.5 p-1 rounded-xl bg-bg-subtle border border-border">
            {[null, 1, 2, 3, 4].map((n) => (
              <button
                key={n ?? 'all'}
                type="button"
                onClick={() =>
                  setFilter('dormitorios_min', n ?? undefined)
                }
                className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all ${
                  (filters.dormitorios_min ?? null) === n
                    ? 'bg-bg-card text-primary shadow-sm ring-1 ring-border'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {n === null ? 'X' : `${n}+`}
              </button>
            ))}
          </div>
        </div>

        {/* Ciudad y Barrio */}
        <div className="grid gap-4">
          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-text-tertiary">Ubicación</label>
            <input
              type="text"
              placeholder="Ej: Rosario"
              value={filters.ciudad ?? ''}
              onChange={(e) => setFilter('ciudad', e.target.value || undefined)}
              className="w-full rounded-[var(--radius-input)] border border-border bg-bg-card px-3 py-2.5 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>
          <input
            type="text"
            placeholder="Barrio (ej: Fisherton)"
            value={filters.barrio ?? ''}
            onChange={(e) => setFilter('barrio', e.target.value || undefined)}
            className="w-full rounded-[var(--radius-input)] border border-border bg-bg-card px-3 py-2.5 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>
      </div>

      {/* Mobile apply button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-[var(--radius-button)] bg-primary py-4 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-600 active:scale-95 lg:hidden"
        >
          Ver Resultados
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
    <div className="space-y-2">
      <label className="block text-[11px] font-bold uppercase tracking-wider text-text-tertiary">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-[var(--radius-input)] border border-border bg-bg-card px-3 py-2.5 text-sm font-medium text-text-primary outline-none transition-all hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/10"
        >
          <option value="">{placeholder}</option>
          {Object.entries(options).map(([val, lbl]) => (
            <option key={val} value={val}>
              {lbl}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 4L5 7L8 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
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
      <div className="flex flex-wrap items-center gap-2">
        {entries.map(([key, value]) => (
          <span
            key={key}
            className="group inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-1.5 text-[11px] font-bold text-primary transition-all hover:border-primary/40 hover:bg-primary/10"
          >
            <span className="opacity-60">{getFilterLabel(key)}:</span>
            <span>{formatValue(key, value)}</span>
            <button
              type="button"
              onClick={() => removeFilter(key)}
              className="ml-1 rounded-md p-0.5 transition-colors hover:bg-primary/20"
              aria-label={`Quitar filtro ${getFilterLabel(key)}`}
            >
              <X size={12} strokeWidth={2.5} />
            </button>
          </span>
        ))}
      </div>
      {activeFilterCount > 1 && (
        <button
          type="button"
          onClick={resetFilters}
          className="text-[11px] font-bold uppercase tracking-wider text-text-tertiary transition-colors hover:text-primary"
        >
          Limpiar todos
        </button>
      )}
    </div>
  )
}

