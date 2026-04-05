import { useState } from 'react'
import { BookOpen, PenLine } from 'lucide-react'
import Modal from '../ui/Modal'
import ExerciseCard from './ExerciseCard'
import ExerciseFilter from './ExerciseFilter'
import ExerciseSearch from './ExerciseSearch'
import AddCustomExerciseForm from './AddCustomExerciseForm'
import { EXERCISES } from '../../constants/exercises'

const TABS = [
  { id: 'library', label: 'Library',    icon: BookOpen },
  { id: 'custom',  label: 'Add Custom', icon: PenLine },
]

const ExercisePicker = ({ isOpen, onClose, onAdd, extraExercises = [] }) => {
  const [tab, setTab] = useState('library')
  const [search, setSearch] = useState('')
  const [muscle, setMuscle] = useState(null)

  const allExercises = [...EXERCISES, ...extraExercises]
  const filtered = allExercises.filter(ex => {
    const matchSearch = ex.name.toLowerCase().includes(search.toLowerCase())
    const matchMuscle = !muscle || ex.muscles.includes(muscle)
    return matchSearch && matchMuscle
  })

  const handleAdd = (exercise) => { onAdd(exercise); onClose() }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Exercise" size="lg">
      {/* Tab bar */}
      <div className="flex gap-1 px-5 pt-4 border-b border-gray-100 dark:border-gray-800">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              tab === id
                ? 'border-green-500 text-green-700 dark:text-green-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {tab === 'library' && (
        <div className="flex flex-col gap-3 p-5">
          <ExerciseSearch value={search} onChange={setSearch} />
          <ExerciseFilter selected={muscle} onChange={setMuscle} />
          <div className="flex flex-col gap-2 max-h-80 sm:max-h-96 overflow-y-auto pr-1">
            {filtered.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-10">No exercises found.</p>
            ) : (
              filtered.map(ex => (
                <ExerciseCard key={ex.id} exercise={ex} onAdd={handleAdd} addLabel="Add" compact />
              ))
            )}
          </div>
        </div>
      )}

      {tab === 'custom' && (
        <AddCustomExerciseForm onSave={handleAdd} />
      )}
    </Modal>
  )
}

export default ExercisePicker
