import { Plus } from 'lucide-react'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

const CATEGORY_CLASSES = {
  compound:  'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
  isolation: 'bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
}

const ExerciseCard = ({ exercise, onAdd, addLabel = 'Add', compact = false }) => (
  <div
    className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between gap-4 hover:border-gray-200 dark:hover:border-gray-700 transition-colors ${
      compact ? 'px-4 py-3' : 'px-4 py-4'
    }`}
  >
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-wrap mb-1.5">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">{exercise.name}</h4>
        <span className="text-xs text-gray-400 dark:text-gray-500">{exercise.equipment}</span>
        {exercise.isCustom && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400 font-medium">Custom</span>
        )}
      </div>
      <div className="flex gap-1 flex-wrap">
        {exercise.muscles.map(m => <Badge key={m} label={m} muscle={m} />)}
        <span className={`text-[10px] px-1.5 py-0.5 rounded capitalize font-medium ${CATEGORY_CLASSES[exercise.category] ?? ''}`}>
          {exercise.category}
        </span>
      </div>
    </div>

    {onAdd && (
      <Button variant="outline" size="sm" onClick={() => onAdd(exercise)} className="shrink-0">
        <Plus size={13} className="mr-1" />
        {addLabel}
      </Button>
    )}
  </div>
)

export default ExerciseCard
