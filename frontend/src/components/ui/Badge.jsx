import { twMerge } from 'tailwind-merge'
import { MUSCLE_COLORS } from '../../constants/muscles'

/**
 * Pill badge — if `muscle` prop is provided, colour is derived from MUSCLE_COLORS map.
 * ISP: muscle is optional; plain badges use className for colour.
 */
const Badge = ({ label, muscle, className = '' }) => {
  const colorClass = muscle
    ? (MUSCLE_COLORS[muscle] ?? 'bg-gray-100 text-gray-600')
    : 'bg-gray-100 text-gray-600'

  return (
    <span
      className={twMerge(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize',
        colorClass,
        className
      )}
    >
      {label}
    </span>
  )
}

export default Badge
