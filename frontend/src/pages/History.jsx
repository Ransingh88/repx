import { useState } from 'react'
import { History as HistoryIcon, ChevronDown, ChevronUp, Dumbbell } from 'lucide-react'
import PageLayout from '../components/layout/PageLayout'
import Card, { CardBody } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import { useWorkout } from '../store/WorkoutContext'
import { formatDuration } from '../store/reducer'

const HistoryPage = () => {
  const { state } = useWorkout()
  const [expanded, setExpanded] = useState(null)

  const toggle = (id) => setExpanded(prev => prev === id ? null : id)

  return (
    <PageLayout>
      <div className="flex items-center gap-2 mb-6">
        <HistoryIcon size={20} className="text-gray-400 dark:text-gray-500" />
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Workout History</h1>
        <span className="text-sm text-gray-400 dark:text-gray-500">({state.history.length})</span>
      </div>

      {state.history.length === 0 ? (
        <div className="text-center py-24 text-gray-400 dark:text-gray-600">
          <Dumbbell size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No workouts logged yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {state.history.map(session => {
            const duration = session.endedAt
              ? Math.floor((new Date(session.endedAt) - new Date(session.startedAt)) / 1000)
              : 0
            const totalSets = session.exercises.reduce((a, e) => a + e.sets.length, 0)
            const doneSets  = session.exercises.reduce((a, e) => a + e.sets.filter(s => s.completed).length, 0)
            const isOpen    = expanded === session.id
            const totalVolume = session.exercises.reduce((acc, ex) =>
              acc + ex.sets.filter(s => s.completed).reduce((a, s) => a + (s.weight * s.reps), 0), 0
            )

            return (
              <Card key={session.id}>
                <CardBody className="py-3">
                  <button
                    className="w-full flex items-center justify-between cursor-pointer text-left gap-3"
                    onClick={() => toggle(session.id)}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">
                          {session.splitDay?.name ?? 'Workout'}
                        </p>
                        <span className="shrink-0 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 px-1.5 py-0.5 rounded-full font-medium">
                          Done
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">
                        {new Date(session.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        <span className="mx-1">·</span>{session.exercises.length} exercises
                        <span className="mx-1">·</span>{doneSets}/{totalSets} sets
                        {duration > 0 && <><span className="mx-1">·</span>{formatDuration(duration)}</>}
                        {totalVolume > 0 && <><span className="mx-1">·</span>{totalVolume.toLocaleString()} kg vol</>}
                      </p>
                    </div>
                    {isOpen
                      ? <ChevronUp size={15} className="text-gray-400 dark:text-gray-500 shrink-0" />
                      : <ChevronDown size={15} className="text-gray-400 dark:text-gray-500 shrink-0" />
                    }
                  </button>

                  {isOpen && (
                    <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-800 flex flex-col gap-4">
                      {session.exercises.map(exercise => (
                        <div key={exercise.id}>
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{exercise.name}</p>
                            {exercise.muscles.map(m => <Badge key={m} label={m} muscle={m} />)}
                          </div>

                          <div
                            className="grid text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold mb-1"
                            style={{ gridTemplateColumns: '32px 1fr 1fr 1fr' }}
                          >
                            <span>Set</span><span>Weight</span><span>Reps</span><span>Status</span>
                          </div>

                          {exercise.sets.map(set => (
                            <div
                              key={set.id}
                              className="grid text-xs text-gray-600 dark:text-gray-400 py-1 border-b border-gray-50 dark:border-gray-800 last:border-0"
                              style={{ gridTemplateColumns: '32px 1fr 1fr 1fr' }}
                            >
                              <span>{set.setNumber}</span>
                              <span>{set.weight} kg</span>
                              <span>{set.reps}</span>
                              <span className={set.completed ? 'text-green-500 dark:text-green-400 font-medium' : 'text-gray-300 dark:text-gray-600'}>
                                {set.completed ? '✓ Done' : '—'}
                              </span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>
            )
          })}
        </div>
      )}
    </PageLayout>
  )
}

export default HistoryPage
