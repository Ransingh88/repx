import { MUSCLE_GROUPS } from '../../constants/muscles'

const ExerciseFilter = ({ selected, onChange }) => (
  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
    <button
      onClick={() => onChange(null)}
      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
        !selected
          ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
      }`}
    >
      All
    </button>

    {MUSCLE_GROUPS.map(({ id, label }) => (
      <button
        key={id}
        onClick={() => onChange(id)}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors capitalize cursor-pointer whitespace-nowrap shrink-0 ${
          selected === id
            ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
        }`}
      >
        {label}
      </button>
    ))}
  </div>
)

export default ExerciseFilter
