import { createContext, useContext, useReducer, useEffect } from 'react'
import { reducer, initialState } from './reducer'

const WorkoutContext = createContext(null)

const STORAGE_KEY = 'repx_v1'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState
    // Merge with initialState so new fields added in future versions get defaults
    return { ...initialState, ...JSON.parse(raw) }
  } catch {
    return initialState
  }
}

function save(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Silently fail if localStorage is unavailable (private browsing quota)
  }
}

export function WorkoutProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)

  useEffect(() => {
    save(state)
  }, [state])

  return (
    <WorkoutContext.Provider value={{ state, dispatch }}>
      {children}
    </WorkoutContext.Provider>
  )
}

/** Throws if used outside <WorkoutProvider> (DIP: consumers depend on the hook, not the context object) */
export function useWorkout() {
  const ctx = useContext(WorkoutContext)
  if (!ctx) throw new Error('useWorkout must be used within <WorkoutProvider>')
  return ctx
}
