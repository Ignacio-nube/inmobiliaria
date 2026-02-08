import { type ButtonHTMLAttributes, forwardRef } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'whatsapp'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-500 active:bg-primary-800 focus-visible:ring-primary-500',
  secondary:
    'bg-secondary text-white hover:bg-secondary-400 active:bg-secondary-700 focus-visible:ring-secondary-500',
  outline:
    'border border-border bg-transparent text-text-primary hover:bg-bg-subtle active:bg-bg-subtle focus-visible:ring-primary-500',
  ghost:
    'bg-transparent text-text-secondary hover:bg-bg-subtle hover:text-text-primary active:bg-bg-subtle',
  danger:
    'bg-error text-white hover:bg-red-600 active:bg-red-700 focus-visible:ring-error',
  whatsapp:
    'bg-accent-whatsapp text-white hover:bg-green-500 active:bg-green-600 focus-visible:ring-accent-whatsapp',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      className = '',
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          inline-flex items-center justify-center font-semibold
          rounded-[var(--radius-button)] transition-all duration-[var(--transition-fast)]
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      >
        {loading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
