import { CheckCircle, X } from 'lucide-react'
import Button from '../ui/Button'
import { formatDuration } from '../../store/reducer'
import { useStopwatch } from '../../hooks/useStopwatch'

const SessionHeader = ({ session, onFinish, onDiscard, completedSets, totalSets }) => {
  const elapsed = useStopwatch(session.startedAt)

  return (
    <div className="mb-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
            {new Date(session.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{session.splitDay?.name ?? 'Workout'}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {formatDuration(elapsed)}
            <span className="mx-1.5 text-gray-300 dark:text-gray-600">·</span>
            <span className={completedSets === totalSets && totalSets > 0 ? 'text-green-600 dark:text-green-400 font-medium' : ''}>
              {completedSets}/{totalSets} sets
            </span>
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onDiscard}
            className="text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
          >
            <X size={14} className="mr-1" /> Discard
          </Button>
          <Button size="sm" onClick={onFinish}>
            <CheckCircle size={14} className="mr-1" /> Finish
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 rounded-full transition-all duration-500"
          style={{ width: totalSets > 0 ? `${(completedSets / totalSets) * 100}%` : '0%' }}
        />
      </div>
    </div>
  )
}

export default SessionHeader
