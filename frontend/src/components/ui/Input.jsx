import { twMerge } from 'tailwind-merge'

const Input = ({
  label,
  placeholder = '',
  className = '',
  inputClassName = '',
  onChange,
  name,
  value,
  type = 'text',
  labelVisible = true,
  error,
  disabled = false,
  required = false,
  ...props
}) => (
  <div className={twMerge('flex flex-col gap-1', className)}>
    {label && labelVisible && (
      <label htmlFor={name} className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
    )}
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      disabled={disabled}
      required={required}
      className={twMerge(
        'w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm text-gray-900',
        'placeholder:text-gray-400',
        'focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        'dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500',
        'dark:focus:border-green-500',
        error && 'border-red-400 focus:border-red-400 focus:ring-red-300 dark:border-red-600',
        inputClassName
      )}
      {...props}
    />
    {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}
  </div>
)

export default Input
