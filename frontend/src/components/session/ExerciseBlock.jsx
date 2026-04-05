import { useState } from 'react'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import Card, { CardHeader, CardBody } from '../ui/Card'
import Badge from '../ui/Badge'
import SetTable from './SetTable'

const ExerciseBlock = ({
  exercise,
  prevSets,
  onAddSet,
  onRemoveExercise,
  onUpdateSet,
  onRemoveSet,
  onToggleSetComplete,
}) => {
  const [collapsed, setCollapsed] = useState(false)

  const completedCount = exercise.sets.filter(s => s.completed).length
  const totalCount = exercise.sets.length
  const allDone = completedCount === totalCount && totalCount > 0

  return (
    <Card className={allDone ? 'border-green-200 dark:border-green-800' : ''}>
      <CardHeader className="py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCollapsed(v => !v)}
            className="flex-1 flex items-center gap-3 text-left cursor-pointer min-w-0"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">{exercise.name}</h3>
                <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">{exercise.equipment}</span>
              </div>
              <div className="flex gap-1 mt-1 flex-wrap">
                {exercise.muscles.map(m => <Badge key={m} label={m} muscle={m} />)}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-xs font-medium ${allDone ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}>
                {completedCount}/{totalCount}
              </span>
              {collapsed
                ? <ChevronDown size={15} className="text-gray-400 dark:text-gray-500" />
                : <ChevronUp size={15} className="text-gray-400 dark:text-gray-500" />
              }
            </div>
          </button>

          <button
            onClick={() => onRemoveExercise(exercise.id)}
            className="text-gray-300 dark:text-gray-600 hover:text-red-400 dark:hover:text-red-500 transition-colors cursor-pointer p-1 shrink-0"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </CardHeader>

      {!collapsed && (
        <CardBody className="pt-2">
          <SetTable
            sets={exercise.sets}
            exerciseId={exercise.id}
            prevSets={prevSets}
            onUpdate={onUpdateSet}
            onRemove={onRemoveSet}
            onToggleComplete={onToggleSetComplete}
          />

          <button
            onClick={() => onAddSet(exercise.id)}
            className="mt-3 w-full flex items-center justify-center gap-1 py-2 rounded-lg border border-dashed border-gray-200 dark:border-gray-700 text-sm text-gray-400 dark:text-gray-500 hover:border-green-400 dark:hover:border-green-600 hover:text-green-500 dark:hover:text-green-400 transition-colors cursor-pointer"
          >
            <Plus size={14} /> Add Set
          </button>
        </CardBody>
      )}
    </Card>
  )
}

export default ExerciseBlock
