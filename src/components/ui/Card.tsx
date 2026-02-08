import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hoverable?: boolean
  onClick?: () => void
}

export default function Card({
  children,
  className = '',
  hoverable = false,
  onClick,
}: CardProps) {
  return (
    <div
      className={`
        rounded-[var(--radius-card)] border border-border bg-bg-card shadow-card
        ${
          hoverable
            ? 'cursor-pointer transition-all duration-[var(--transition-base)] hover:-translate-y-1 hover:shadow-card-hover'
            : ''
        }
        ${className}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
    >
      {children}
    </div>
  )
}
