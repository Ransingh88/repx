import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import PageLayout from '../components/layout/PageLayout'
import SessionHeader from '../components/session/SessionHeader'
import ExerciseBlock from '../components/session/ExerciseBlock'
import RestTimerBanner from '../components/session/RestTimerBanner'
import ExercisePicker from '../components/exercise/ExercisePicker'
import Button from '../components/ui/Button'
import { useWorkout } from '../store/WorkoutContext'
import { A, makeSessionExercise, getPreviousPerformance } from '../store/reducer'
import { useRestTimer } from '../hooks/useRestTimer'

const WorkoutSession = () => {
  const { state, dispatch } = useWorkout()
  const navigate = useNavigate()
  const session = state.session
  const { timeLeft, isRunning: timerRunning, start: startTimer, stop: stopTimer } = useRestTimer()
  const [showPicker, setShowPicker] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    if (!session) navigate('/', { replace: true })
  }, [session, navigate])

  const handleToggleSetComplete = useCallback((exerciseId, setId, restSeconds) => {
    const ex = session?.exercises.find(e => e.id === exerciseId)
    const set = ex?.sets.find(s => s.id === setId)
    if (!set?.completed) startTimer(restSeconds)
    else stopTimer()
    dispatch({ type: A.TOGGLE_SET_COMPLETE, payload: { exerciseId, setId } })
  }, [dispatch, session, startTimer, stopTimer])

  const handleUpdateSet   = useCallback((exerciseId, setId, field, value) => dispatch({ type: A.UPDATE_SET,   payload: { exerciseId, setId, field, value } }), [dispatch])
  const handleRemoveSet   = useCallback((exerciseId, setId) => dispatch({ type: A.REMOVE_SET,   payload: { exerciseId, setId } }), [dispatch])
  const handleAddSet      = useCallback((exerciseId) => dispatch({ type: A.ADD_SET,      payload: { exerciseId } }), [dispatch])
  const handleRemoveExercise = useCallback((exerciseId) => dispatch({ type: A.REMOVE_EXERCISE, payload: exerciseId }), [dispatch])

  const handleAddExercise = useCallback((exercise) => {
    if (exercise.isCustom) dispatch({ type: A.ADD_CUSTOM_EXERCISE, payload: exercise })
    dispatch({ type: A.ADD_EXERCISE, payload: makeSessionExercise(exercise) })
  }, [dispatch])

  const handleDiscard = useCallback(() => { dispatch({ type: A.DISCARD_SESSION }); navigate('/') }, [dispatch, navigate])
  const handleFinish  = useCallback(() => { dispatch({ type: A.COMPLETE_SESSION }); navigate('/') }, [dispatch, navigate])

  if (!session) return null

  const totalSets     = session.exercises.reduce((acc, ex) => acc + ex.sets.length, 0)
  const completedSets = session.exercises.reduce((acc, ex) => acc + ex.sets.filter(s => s.completed).length, 0)

  return (
    <PageLayout className="pb-28">
      <SessionHeader
        session={session}
        onFinish={() => setShowConfirm(true)}
        onDiscard={handleDiscard}
        completedSets={completedSets}
        totalSets={totalSets}
      />

      <div className="flex flex-col gap-4 mb-6">
        {session.exercises.map(exercise => (
          <ExerciseBlock
            key={exercise.id}
            exercise={exercise}
            prevSets={getPreviousPerformance(exercise.exerciseId, state.history)}
            onAddSet={handleAddSet}
            onRemoveExercise={handleRemoveExercise}
            onUpdateSet={handleUpdateSet}
            onRemoveSet={handleRemoveSet}
            onToggleSetComplete={handleToggleSetComplete}
          />
        ))}
      </div>

      <button
        onClick={() => setShowPicker(true)}
        className="w-full py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center gap-2 text-sm text-gray-400 dark:text-gray-500 hover:border-green-400 dark:hover:border-green-600 hover:text-green-500 dark:hover:text-green-400 transition-colors cursor-pointer"
      >
        <Plus size={16} /> Add Exercise
      </button>

      <RestTimerBanner timeLeft={timeLeft} isRunning={timerRunning} onSkip={stopTimer} />

      <ExercisePicker
        isOpen={showPicker}
        onClose={() => setShowPicker(false)}
        onAdd={handleAddExercise}
        extraExercises={state.customExercises}
      />

      {/* Confirm finish */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />
          <div className="relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Finish workout?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              {completedSets < totalSets
                ? `${totalSets - completedSets} set(s) still incomplete. Save anyway?`
                : 'Great work! Save this workout to history?'}
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setShowConfirm(false)} className="flex-1">Keep going</Button>
              <Button onClick={handleFinish} className="flex-1">Save workout</Button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  )
}

export default WorkoutSession
