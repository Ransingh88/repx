import { twMerge } from 'tailwind-merge'

const Card = ({ className = '', children, ...props }) => (
  <div
    className={twMerge(
      'bg-white rounded-xl border border-gray-100 shadow-sm',
      'dark:bg-gray-900 dark:border-gray-800',
      className
    )}
    {...props}
  >
    {children}
  </div>
)

export const CardHeader = ({ className = '', children }) => (
  <div className={twMerge('px-5 py-4 border-b border-gray-100 dark:border-gray-800', className)}>
    {children}
  </div>
)

export const CardBody = ({ className = '', children }) => (
  <div className={twMerge('px-5 py-4', className)}>
    {children}
  </div>
)

export default Card
