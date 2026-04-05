import { SkipForward } from 'lucide-react'

function fmt(s) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${String(sec).padStart(2, '0')}`
}

/**
 * Floating rest-timer banner shown at the bottom of the screen.
 * SRP: purely presentational — receives timeLeft and fires onSkip.
 */
const RestTimerBanner = ({ timeLeft, isRunning, onSkip }) => {
  if (!isRunning || timeLeft === null) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-sm font-medium text-gray-300">Rest</span>
      </div>

      <span className="text-2xl font-bold font-mono tracking-tight tabular-nums">
        {fmt(timeLeft)}
      </span>

      <button
        onClick={onSkip}
        className="flex items-center gap-1 text-xs text-gray-400 hover:text-white border border-gray-600 hover:border-gray-400 rounded-lg px-2.5 py-1 transition-colors cursor-pointer"
      >
        <SkipForward size={12} />
        Skip
      </button>
    </div>
  )
}

export default RestTimerBanner
