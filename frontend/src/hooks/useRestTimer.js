import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Standalone countdown timer — ephemeral, not stored in global state.
 * SRP: only manages a single countdown; nothing else.
 */
export function useRestTimer() {
  const [timeLeft, setTimeLeft] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef(null)
  const onDoneRef = useRef(null)

  const clear = () => clearInterval(intervalRef.current)

  const start = useCallback((seconds, onDone) => {
    clear()
    onDoneRef.current = onDone ?? null
    setTimeLeft(seconds)
    setIsRunning(true)
  }, [])

  const stop = useCallback(() => {
    clear()
    setIsRunning(false)
    setTimeLeft(null)
  }, [])

  useEffect(() => {
    if (!isRunning) return
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          setIsRunning(false)
          onDoneRef.current?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return clear
  }, [isRunning])

  return { timeLeft, isRunning, start, stop }
}
