import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Card, { CardHeader, CardBody } from '../ui/Card'
import { useWorkout } from '../../store/WorkoutContext'

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

/** Collect the set of day-numbers that have a workout for a given year/month. */
function getWorkoutDays(history, year, month) {
  const days = new Set()
  history.forEach(session => {
    const d = new Date(session.date)
    if (d.getFullYear() === year && d.getMonth() === month) {
      days.add(d.getDate())
    }
  })
  return days
}

/**
 * Monthly workout calendar.
 * SRP: renders a single month view and exposes prev/next navigation.
 * Reads workout history from context — no props needed.
 */
const WorkoutCalendar = () => {
  const { state } = useWorkout()

  const now = new Date()
  const [view, setView] = useState({ year: now.getFullYear(), month: now.getMonth() })

  const { year, month } = view
  const workoutDays = getWorkoutDays(state.history, year, month)

  // Calendar grid helpers
  const firstDayOfMonth  = new Date(year, month, 1)
  const daysInMonth      = new Date(year, month + 1, 0).getDate()
  const startOffset      = (firstDayOfMonth.getDay() + 6) % 7 // Monday = 0

  const today = { y: now.getFullYear(), m: now.getMonth(), d: now.getDate() }
  const isCurrentMonth = year === today.y && month === today.m
  const isPastMonth    = year < today.y || (year === today.y && month < today.m)

  const navigate = (delta) => {
    setView(v => {
      const d = new Date(v.year, v.month + delta, 1)
      return { year: d.getFullYear(), month: d.getMonth() }
    })
  }

  // Build cell array: null = empty filler, number = day
  const cells = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const getCellMeta = (day) => {
    const isToday   = isCurrentMonth && day === today.d
    const isFuture  = !isPastMonth && !(isCurrentMonth && day <= today.d)
    const hasWorkout = workoutDays.has(day)
    const emoji = hasWorkout ? '🔥' : isFuture ? null : '🧊'
    return { isToday, isFuture, hasWorkout, emoji }
  }

  const workoutCount = workoutDays.size
  const totalPastDays = isPastMonth
    ? daysInMonth
    : isCurrentMonth ? today.d : 0

  return (
    <Card>
      {/* ── Header ── */}
      <CardHeader className="py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="text-center">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {MONTH_NAMES[month]} {year}
            </p>
            {totalPastDays > 0 && (
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                {workoutCount}/{totalPastDays} days trained
              </p>
            )}
          </div>

          <button
            onClick={() => navigate(1)}
            disabled={isCurrentMonth}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
              isCurrentMonth
                ? 'opacity-25 cursor-not-allowed text-gray-400 dark:text-gray-600'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer'
            }`}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </CardHeader>

      {/* ── Grid ── */}
      <CardBody className="pt-2">
        {/* Weekday labels */}
        <div className="grid grid-cols-7 mb-2">
          {DAY_LABELS.map(label => (
            <p
              key={label}
              className="text-center text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider py-1"
            >
              {label}
            </p>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, idx) => {
            if (!day) return <div key={idx} />

            const { isToday, isFuture, hasWorkout, emoji } = getCellMeta(day)

            return (
              <div
                key={idx}
                className={`flex flex-col items-center justify-center rounded-xl py-1 sm:py-1.5 min-h-[46px] sm:min-h-[52px] transition-colors ${
                  isToday
                    ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-950'
                    : isFuture
                    ? 'opacity-30'
                    : hasWorkout
                    ? 'bg-orange-50 dark:bg-orange-950/50'
                    : 'bg-sky-50 dark:bg-sky-950/40'
                }`}
              >
                <span
                  className={`text-xs font-semibold leading-none ${
                    isToday
                      ? 'text-green-700 dark:text-green-400'
                      : isFuture
                      ? 'text-gray-500 dark:text-gray-400'
                      : hasWorkout
                      ? 'text-orange-700 dark:text-orange-400'
                      : 'text-sky-600 dark:text-sky-400'
                  }`}
                >
                  {day}
                </span>

                {emoji && (
                  <span className="text-base leading-none mt-0.5" role="img" aria-label={hasWorkout ? 'workout' : 'rest'}>
                    {emoji}
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-5 mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-1.5">
            <span className="text-base">🔥</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">Workout day</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-base">🧊</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">Rest day</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-3.5 h-3.5 rounded-full ring-2 ring-green-500 bg-green-50 dark:bg-green-950" />
            <span className="text-xs text-gray-400 dark:text-gray-500">Today</span>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default WorkoutCalendar
