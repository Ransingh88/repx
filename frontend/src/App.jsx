import { WorkoutProvider } from './store/WorkoutContext'
import AppRoute from './router/AppRoute'
import './App.css'

function App() {
  return (
    <WorkoutProvider>
      <AppRoute />
    </WorkoutProvider>
  )
}

export default App
