// ─── Action types ─────────────────────────────────────────────────────────────
export const A = {
  // Setup
  COMPLETE_SETUP: 'COMPLETE_SETUP',
  // Session lifecycle
  START_SESSION: 'START_SESSION',
  DISCARD_SESSION: 'DISCARD_SESSION',
  COMPLETE_SESSION: 'COMPLETE_SESSION',
  // Exercise management within a session
  ADD_EXERCISE: 'ADD_EXERCISE',
  REMOVE_EXERCISE: 'REMOVE_EXERCISE',
  // Set management
  ADD_SET: 'ADD_SET',
  UPDATE_SET: 'UPDATE_SET',
  REMOVE_SET: 'REMOVE_SET',
  TOGGLE_SET_COMPLETE: 'TOGGLE_SET_COMPLETE',
  // Custom exercises (library)
  ADD_CUSTOM_EXERCISE: 'ADD_CUSTOM_EXERCISE',
}

// ─── Initial state ─────────────────────────────────────────────────────────────
export const initialState = {
  setupComplete: false,
  split: null,          // selected split id
  currentDayIndex: 0,   // increments each completed session; mod in selector
  session: null,        // active workout session (persisted so refresh is safe)
  history: [],          // completed sessions, newest first
  customExercises: [],  // user-created exercises appended to library
}

// ─── Pure helpers ─────────────────────────────────────────────────────────────
function makeId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function makeDefaultSet(setNumber, reps = 10) {
  return {
    id: makeId('set'),
    setNumber,
    reps,
    weight: 0,
    completed: false,
    restSeconds: 90,
  }
}

// ─── Reducer ──────────────────────────────────────────────────────────────────
export function reducer(state, action) {
  switch (action.type) {

    // ── Setup ────────────────────────────────────────────────────────────────
    case A.COMPLETE_SETUP:
      return { ...state, setupComplete: true, split: action.payload }

    // ── Session lifecycle ────────────────────────────────────────────────────
    case A.START_SESSION:
      return {
        ...state,
        session: {
          id: makeId('session'),
          date: new Date().toISOString(),
          startedAt: new Date().toISOString(),
          endedAt: null,
          splitDay: action.payload.splitDay,
          exercises: action.payload.exercises,
        },
      }

    case A.DISCARD_SESSION:
      return { ...state, session: null }

    case A.COMPLETE_SESSION: {
      if (!state.session) return state
      const completed = { ...state.session, endedAt: new Date().toISOString() }
      return {
        ...state,
        session: null,
        history: [completed, ...state.history],
        currentDayIndex: state.currentDayIndex + 1,
      }
    }

    // ── Exercise management ───────────────────────────────────────────────────
    case A.ADD_EXERCISE:
      return {
        ...state,
        session: {
          ...state.session,
          exercises: [...state.session.exercises, action.payload],
        },
      }

    case A.REMOVE_EXERCISE:
      return {
        ...state,
        session: {
          ...state.session,
          exercises: state.session.exercises.filter(e => e.id !== action.payload),
        },
      }

    // ── Set management ────────────────────────────────────────────────────────
    case A.ADD_SET: {
      const { exerciseId } = action.payload
      return {
        ...state,
        session: {
          ...state.session,
          exercises: state.session.exercises.map(ex => {
            if (ex.id !== exerciseId) return ex
            const last = ex.sets[ex.sets.length - 1]
            return {
              ...ex,
              sets: [
                ...ex.sets,
                makeDefaultSet(ex.sets.length + 1, last?.reps ?? 10),
              ],
            }
          }),
        },
      }
    }

    case A.UPDATE_SET: {
      const { exerciseId, setId, field, value } = action.payload
      return {
        ...state,
        session: {
          ...state.session,
          exercises: state.session.exercises.map(ex => {
            if (ex.id !== exerciseId) return ex
            return {
              ...ex,
              sets: ex.sets.map(s => s.id === setId ? { ...s, [field]: value } : s),
            }
          }),
        },
      }
    }

    case A.REMOVE_SET: {
      const { exerciseId, setId } = action.payload
      return {
        ...state,
        session: {
          ...state.session,
          exercises: state.session.exercises.map(ex => {
            if (ex.id !== exerciseId) return ex
            const sets = ex.sets
              .filter(s => s.id !== setId)
              .map((s, i) => ({ ...s, setNumber: i + 1 }))
            return { ...ex, sets }
          }),
        },
      }
    }

    case A.TOGGLE_SET_COMPLETE: {
      const { exerciseId, setId } = action.payload
      return {
        ...state,
        session: {
          ...state.session,
          exercises: state.session.exercises.map(ex => {
            if (ex.id !== exerciseId) return ex
            return {
              ...ex,
              sets: ex.sets.map(s =>
                s.id === setId ? { ...s, completed: !s.completed } : s
              ),
            }
          }),
        },
      }
    }

    // ── Custom exercises ──────────────────────────────────────────────────────
    case A.ADD_CUSTOM_EXERCISE:
      // Idempotent: skip duplicates
      if (state.customExercises.some(e => e.id === action.payload.id)) return state
      return { ...state, customExercises: [...state.customExercises, action.payload] }

    default:
      return state
  }
}

// ─── Exported helpers used by pages/components ────────────────────────────────

/** Create a session exercise entry from a library exercise object */
export function makeSessionExercise(exercise) {
  return {
    id: makeId(exercise.id),
    exerciseId: exercise.id,
    name: exercise.name,
    muscles: exercise.muscles,
    equipment: exercise.equipment,
    sets: [makeDefaultSet(1, exercise.suggestedReps ?? 10)],
  }
}

/** Get the current split day from the schedule, wrapping around cyclically */
export function getCurrentDay(split, currentDayIndex) {
  if (!split) return null
  return split.schedule[currentDayIndex % split.schedule.length]
}

/** Find the most recent completed performance for an exercise id in history */
export function getPreviousPerformance(exerciseId, history) {
  for (const session of history) {
    const match = session.exercises.find(e => e.exerciseId === exerciseId)
    if (match) {
      const done = match.sets.filter(s => s.completed)
      if (done.length > 0) return done
    }
  }
  return null
}

/** Format elapsed seconds into human-readable string */
export function formatDuration(seconds) {
  if (!seconds || seconds < 1) return '0s'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m${s > 0 ? ` ${s}s` : ''}`
  return `${s}s`
}
