import { useNavigate } from 'react-router'
import { Calendar, Flame, Dumbbell, Trophy, ChevronRight, Zap } from 'lucide-react'
import PageLayout from '../components/layout/PageLayout'
import Card, { CardBody, CardHeader } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { useWorkout } from '../store/WorkoutContext'
import { A, getCurrentDay, makeSessionExercise, formatDuration } from '../store/reducer'
import { SPLITS } from '../constants/splits'
import { EXERCISES } from '../constants/exercises'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

const Dashboard = () => {
  const { state, dispatch } = useWorkout()
  const navigate = useNavigate()

  const split = SPLITS.find(s => s.id === state.split)
  const currentDay = getCurrentDay(split, state.currentDayIndex)

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  const handleStartWorkout = () => {
    if (state.session) { navigate('/session'); return }
    const exercises = (currentDay?.exercises ?? [])
      .map(id => EXERCISES.find(e => e.id === id))
      .filter(Boolean)
      .map(makeSessionExercise)
    dispatch({ type: A.START_SESSION, payload: { splitDay: currentDay, exercises } })
    navigate('/session')
  }

  return (
    <PageLayout>
      {/* Greeting */}
      <div className="mb-8">
        <p className="text-sm text-gray-400 dark:text-gray-500 flex items-center gap-1.5 mb-1">
          <Calendar size={13} />
          {formattedDate}
        </p>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
          {greeting()}, Athlete!
        </h1>
      </div>

      {/* Stats — responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
        <Card>
          <CardBody className="flex items-center gap-3 py-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950 flex items-center justify-center shrink-0">
              <Flame size={18} className="text-orange-500" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{state.history.length}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Total workouts</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center gap-3 py-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center shrink-0">
              <Dumbbell size={18} className="text-blue-500" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{split?.daysPerWeek ?? '—'}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Days / week</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center gap-3 py-3">
            <div className="w-9 h-9 rounded-xl bg-green-50 dark:bg-green-950 flex items-center justify-center shrink-0">
              <Trophy size={18} className="text-green-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-tight">{split?.name ?? '—'}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Split</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Today's workout card */}
      {currentDay && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
                  Day {(state.currentDayIndex % (split?.schedule.length ?? 1)) + 1} of {split?.schedule.length}
                </p>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{currentDay.name}</h2>
              </div>
              {state.session && (
                <span className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 px-2.5 py-1 rounded-full">
                  <Zap size={11} /> In progress
                </span>
              )}
            </div>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {currentDay.muscles.map(m => <Badge key={m} label={m} muscle={m} />)}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {currentDay.exercises.length} exercises planned
            </p>
            <Button onClick={handleStartWorkout} className="w-full py-2.5">
              {state.session ? 'Continue Workout' : 'Start Workout'}
            </Button>
          </CardBody>
        </Card>
      )}

      {/* Recent history */}
      {state.history.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">Recent Workouts</h2>
            <button
              onClick={() => navigate('/history')}
              className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 flex items-center gap-0.5 cursor-pointer"
            >
              See all <ChevronRight size={14} />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {state.history.slice(0, 3).map(session => {
              const duration = session.endedAt
                ? Math.floor((new Date(session.endedAt) - new Date(session.startedAt)) / 1000)
                : 0
              return (
                <Card key={session.id}>
                  <CardBody className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{session.splitDay?.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        <span className="mx-1">·</span>
                        {session.exercises.length} exercises
                        {duration > 0 && <span> · {formatDuration(duration)}</span>}
                      </p>
                    </div>
                    <span className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 px-2 py-0.5 rounded-full font-medium">
                      Done
                    </span>
                  </CardBody>
                </Card>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400 dark:text-gray-600">
          <Dumbbell size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No workouts yet — start your first session!</p>
        </div>
      )}
    </PageLayout>
  )
}

export default Dashboard
