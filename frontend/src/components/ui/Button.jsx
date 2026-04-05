import { twMerge } from 'tailwind-merge'

const VARIANTS = {
  primary:   'bg-green-500 text-white hover:bg-green-600 active:bg-green-700 focus:ring-green-400',
  secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 focus:ring-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:active:bg-gray-600',
  danger:    'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus:ring-red-400',
  ghost:     'text-gray-600 hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-300 dark:text-gray-400 dark:hover:bg-gray-800 dark:active:bg-gray-700',
  outline:   'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100 focus:ring-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-xl',
}

const Button = ({
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  children,
  ...props
}) => (
  <button
    disabled={disabled}
    className={twMerge(
      'inline-flex items-center justify-center font-medium transition-colors duration-150 cursor-pointer',
      'focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-gray-900',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      VARIANTS[variant] ?? VARIANTS.primary,
      SIZES[size] ?? SIZES.md,
      className
    )}
    {...props}
  >
    {children}
  </button>
)

export default Button
