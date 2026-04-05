import { useState } from 'react'
import { BookOpen } from 'lucide-react'
import PageLayout from '../components/layout/PageLayout'
import ExerciseCard from '../components/exercise/ExerciseCard'
import ExerciseFilter from '../components/exercise/ExerciseFilter'
import ExerciseSearch from '../components/exercise/ExerciseSearch'
import AddCustomExerciseForm from '../components/exercise/AddCustomExerciseForm'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import { useWorkout } from '../store/WorkoutContext'
import { A } from '../store/reducer'
import { EXERCISES } from '../constants/exercises'

const ExerciseLibrary = () => {
  const { state, dispatch } = useWorkout()
  const [search, setSearch] = useState('')
  const [muscle, setMuscle] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const allExercises = [...EXERCISES, ...state.customExercises]
  const filtered = allExercises.filter(ex => {
    const matchSearch = ex.name.toLowerCase().includes(search.toLowerCase())
    const matchMuscle = !muscle || ex.muscles.includes(muscle)
    return matchSearch && matchMuscle
  })

  const handleSaveCustom = (exercise) => {
    dispatch({ type: A.ADD_CUSTOM_EXERCISE, payload: exercise })
    setShowAddModal(false)
  }

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BookOpen size={20} className="text-gray-400 dark:text-gray-500" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Exercise Library</h1>
          <span className="text-sm text-gray-400 dark:text-gray-500">({filtered.length})</span>
        </div>
        <Button size="sm" onClick={() => setShowAddModal(true)}>+ Add Custom</Button>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <ExerciseSearch value={search} onChange={setSearch} />
        <ExerciseFilter selected={muscle} onChange={setMuscle} />
      </div>

      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400 dark:text-gray-600">
            <BookOpen size={36} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No exercises found.</p>
          </div>
        ) : (
          filtered.map(ex => <ExerciseCard key={ex.id} exercise={ex} />)
        )}
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Custom Exercise">
        <AddCustomExerciseForm onSave={handleSaveCustom} onCancel={() => setShowAddModal(false)} />
      </Modal>
    </PageLayout>
  )
}

export default ExerciseLibrary
