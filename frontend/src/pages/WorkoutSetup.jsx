import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Dumbbell } from 'lucide-react'
import SplitSelector from '../components/split/SplitSelector'
import Button from '../components/ui/Button'
import { useWorkout } from '../store/WorkoutContext'
import { A } from '../store/reducer'

const WorkoutSetup = () => {
  const [selectedSplit, setSelectedSplit] = useState(null)
  const { dispatch } = useWorkout()
  const navigate = useNavigate()

  const handleConfirm = () => {
    if (!selectedSplit) return
    dispatch({ type: A.COMPLETE_SETUP, payload: selectedSplit })
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-12 transition-colors">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 dark:bg-green-950 rounded-2xl mb-5">
            <Dumbbell size={28} className="text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Choose Your Workout Split
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-sm sm:text-base">
            Pick how you want to structure your training week. You can change this later.
          </p>
        </div>

        <SplitSelector selected={selectedSplit} onSelect={setSelectedSplit} />

        <Button
          onClick={handleConfirm}
          disabled={!selectedSplit}
          size="lg"
          className="w-full mt-8"
        >
          Start Training →
        </Button>
      </div>
    </div>
  )
}

export default WorkoutSetup
