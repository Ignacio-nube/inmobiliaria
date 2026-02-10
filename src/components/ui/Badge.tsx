import type { ReactNode } from 'react'

type BadgeVariant = 'venta' | 'alquiler' | 'temporario' | 'success' | 'warning' | 'error' | 'neutral'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  venta: 'bg-primary text-white',
  alquiler: 'bg-secondary text-white',
  temporario: 'bg-warning text-white',
  success: 'bg-success text-white',
  warning: 'bg-warning text-white',
  error: 'bg-error text-white',
  neutral: 'bg-bg-subtle text-text-secondary',
}

export default function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center rounded-[var(--radius-badge)] px-2.5 py-1
        text-xs font-semibold uppercase tracking-wide
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}
