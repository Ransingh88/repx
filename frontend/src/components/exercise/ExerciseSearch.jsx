import { Search, X } from 'lucide-react'

const ExerciseSearch = ({ value, onChange }) => (
  <div className="relative">
    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Search exercises..."
      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 pl-9 pr-9 py-2 rounded-lg text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
    />
    {value && (
      <button
        onClick={() => onChange('')}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
      >
        <X size={14} />
      </button>
    )}
  </div>
)

export default ExerciseSearch
