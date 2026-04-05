import { Routes, Route, Navigate } from 'react-router'
import { useWorkout } from '../store/WorkoutContext'
import Navbar from '../components/layout/Navbar'
import WorkoutSetup from '../pages/WorkoutSetup'
import Dashboard from '../pages/Dashboard'
import WorkoutSession from '../pages/WorkoutSession'
import ExerciseLibrary from '../pages/ExerciseLibrary'
import HistoryPage from '../pages/History'

const AppRoute = () => {
  const { state } = useWorkout()

  if (!state.setupComplete) {
    return (
      <Routes>
        <Route path="*" element={<WorkoutSetup />} />
      </Routes>
    )
  }

  return (
    <>
      <Navbar />
      <div className="mt-14 min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="session"   element={<WorkoutSession />} />
          <Route path="exercises" element={<ExerciseLibrary />} />
          <Route path="history"   element={<HistoryPage />} />
          <Route path="*"         element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  )
}

export default AppRoute
