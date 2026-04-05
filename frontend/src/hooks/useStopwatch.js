import { useState, useEffect } from 'react'

/**
 * Returns elapsed seconds since a given ISO start time.
 * Handles null startTime gracefully (returns 0).
 */
export function useStopwatch(startTime) {
  const [elapsed, setElapsed] = useState(() =>
    startTime ? Math.floor((Date.now() - new Date(startTime).getTime()) / 1000) : 0
  )

  useEffect(() => {
    if (!startTime) {
      setElapsed(0)
      return
    }
    const tick = () =>
      setElapsed(Math.floor((Date.now() - new Date(startTime).getTime()) / 1000))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [startTime])

  return elapsed
}
