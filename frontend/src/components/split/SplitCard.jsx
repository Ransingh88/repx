import { Check } from 'lucide-react'

const COLORS = {
  green:  { border: 'border-green-400 dark:border-green-600',   bg: 'bg-green-50 dark:bg-green-950',   dot: 'bg-green-500',   tag: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-400' },
  blue:   { border: 'border-blue-400 dark:border-blue-600',     bg: 'bg-blue-50 dark:bg-blue-950',     dot: 'bg-blue-500',    tag: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-400' },
  purple: { border: 'border-purple-400 dark:border-purple-600', bg: 'bg-purple-50 dark:bg-purple-950', dot: 'bg-purple-500',  tag: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-400' },
  orange: { border: 'border-orange-400 dark:border-orange-600', bg: 'bg-orange-50 dark:bg-orange-950', dot: 'bg-orange-500',  tag: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-400' },
  red:    { border: 'border-red-400 dark:border-red-600',       bg: 'bg-red-50 dark:bg-red-950',       dot: 'bg-red-500',     tag: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-400' },
}

const SplitCard = ({ split, selected, onSelect }) => {
  const c = COLORS[split.color] ?? COLORS.green
  const previewDays = split.schedule.slice(0, 3)
  const overflow = split.schedule.length - 3

  return (
    <button
      onClick={() => onSelect(split.id)}
      className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
        selected
          ? `${c.border} ${c.bg} shadow-md`
          : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-sm'
      }`}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${c.dot}`} />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{split.name}</h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 leading-snug">{split.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {previewDays.map((day, i) => (
              <span key={i} className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.tag}`}>
                {day.name}
              </span>
            ))}
            {overflow > 0 && (
              <span className="text-xs text-gray-400 dark:text-gray-500 self-center">+{overflow} more</span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className="text-xs font-medium text-gray-400 dark:text-gray-500 whitespace-nowrap">
            {split.daysPerWeek} days / week
          </span>
          {selected && (
            <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
              <Check size={12} className="text-white" strokeWidth={3} />
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

export default SplitCard
