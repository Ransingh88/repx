# repx — Claude Code Guide

## Project Overview

**repx** is a full-stack workout tracking app. Users select a workout split, browse exercises by muscle group, and log sets/reps/weight with a rest timer.

Monorepo layout:
```
repx/
├── backend/    # Node.js/Express REST API
└── frontend/   # React SPA
```

---

## Backend

**Stack:** Node.js (ESM), Express 5, Mongoose 8, MongoDB, dotenv, cookie-parser, cors

**Run:**
```bash
cd backend
npm run dev       # nodemon with dotenv
npm start         # production
```

**Environment variables** (`backend/.env`):
```
MONGODB_URI=
PORT=5000
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

**API base:** `http://localhost:5000/api/v1`

### Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/healthcheck` | Server health check |
| POST | `/api/v1/user/register` | Register new user |
| POST | `/api/v1/user/login` | Login (email + password) |
| POST | `/api/v1/workout/createWorkout` | Create an exercise |
| POST | `/api/v1/workout/createWorkoutPlan` | Create a workout plan |
| POST | `/api/v1/workout/workoutLog` | Log a workout session |

### Key Conventions

- All modules use **ESM** (`import`/`export`) — never use `require()`
- Controllers use `asyncHandler` wrapper for async error propagation
- Responses use `ApiResponse(statusCode, data, message)` — note arg order
- Errors use `ApiError(statusCode, message, errors[])`, caught by `errorHandler`
- Auth is token-based: token stored in `user.token` + sent as `httpOnly` cookie `token`
- Login uses **email** (not username)

### Models

| Model | File | Notes |
|-------|------|-------|
| User | `models/user.model.js` | Has `token` field, refs WorkoutPlan and Streak |
| Exercise | `models/exercise.model.js` | Exercise library; IDs like `ch-001`, `bk-001` |
| WorkoutPlan | `models/workoutPlan.model.js` | PPL / bro split, `workoutDays[]` |
| WorkoutLog | `models/workoutlog.model.js` | Daily log with `exercises[{ exerciseId, sets[{set,reps,weight}] }]` |
| History | `models/history.model.js` | Per-user workout dates + status |
| Streak | `models/streak.model.js` | Current/longest streak |

---

## Frontend

**Stack:** React 19, React Router 7 (from `'react-router'`), Vite 6, Tailwind CSS 4, lucide-react, tailwind-merge

**Run:**
```bash
cd frontend
npm run dev       # Vite dev server → http://localhost:5173
npm run build     # Production build (confirmed working)
```

### Folder Structure

```
frontend/src/
├── constants/
│   ├── muscles.js         # MUSCLE_GROUPS array + MUSCLE_COLORS map
│   ├── exercises.js       # EXERCISES array (~55 exercises, all muscle groups)
│   └── splits.js          # SPLITS array (PPL, Upper/Lower, Bro Split, Full Body, Arnold)
├── store/
│   ├── reducer.js         # ACTION_TYPES (A.*), initialState, reducer, helper fns
│   └── WorkoutContext.jsx # WorkoutProvider + useWorkout() hook
├── hooks/
│   ├── useRestTimer.js    # Countdown timer hook (start/stop/timeLeft/isRunning)
│   └── useStopwatch.js    # Elapsed time since ISO startTime
├── components/
│   ├── ui/
│   │   ├── Button.jsx     # variant: primary|secondary|danger|ghost|outline; size: sm|md|lg
│   │   ├── Input.jsx      # label, error, labelVisible, all native input props
│   │   ├── Badge.jsx      # muscle prop → color from MUSCLE_COLORS; or plain via className
│   │   ├── Card.jsx       # + CardHeader, CardBody named exports
│   │   └── Modal.jsx      # isOpen, onClose, title, size: sm|md|lg|xl
│   ├── layout/
│   │   ├── Navbar.jsx     # Fixed top nav; shows "Active" pill when session exists
│   │   └── PageLayout.jsx # max-w-5xl centered wrapper
│   ├── split/
│   │   ├── SplitCard.jsx  # Single split option card
│   │   └── SplitSelector.jsx # Renders all splits from constants
│   ├── exercise/
│   │   ├── ExerciseCard.jsx   # name, muscles (Badges), equipment; onAdd optional
│   │   ├── ExerciseFilter.jsx # Muscle group filter pills
│   │   ├── ExerciseSearch.jsx # Search input with clear button
│   │   ├── ExercisePicker.jsx # Modal: Library tab + Add Custom tab
│   │   └── AddCustomExerciseForm.jsx # Form to create custom exercise
│   └── session/
│       ├── SetRow.jsx         # One set row: weight|reps|rest|complete|delete
│       ├── SetTable.jsx       # Column headers + maps SetRows
│       ├── ExerciseBlock.jsx  # Collapsible card: SetTable + Add Set
│       ├── RestTimerBanner.jsx # Fixed bottom countdown
│       └── SessionHeader.jsx  # Date, elapsed, progress bar, Finish/Discard buttons
├── pages/
│   ├── WorkoutSetup.jsx   # Onboarding split selection (shown until setupComplete=true)
│   ├── Dashboard.jsx      # Today's workout card + stats + recent history
│   ├── WorkoutSession.jsx # Active session tracker
│   ├── ExerciseLibrary.jsx # Browse + search all exercises
│   └── History.jsx        # Past sessions with expandable detail
├── router/
│   └── AppRoute.jsx       # Routes; shows WorkoutSetup if !setupComplete
├── App.jsx                # Wraps with <WorkoutProvider>
└── main.jsx               # DO NOT TOUCH — has BrowserRouter
```

### Routes

| Path | Component |
|------|-----------|
| `/` | Dashboard |
| `/session` | WorkoutSession (redirects to `/` if no active session) |
| `/exercises` | ExerciseLibrary |
| `/history` | History |
| `*` (pre-setup) | WorkoutSetup |

### Global State Shape (`store/reducer.js`)

```js
{
  setupComplete: false,     // true after split selected
  split: null,              // selected split ID string
  currentDayIndex: 0,       // increments each completed session; mod in getCurrentDay()
  session: null,            // active session (persisted to localStorage)
  history: [],              // completed sessions, newest first
  customExercises: [],      // user-created exercises (appended to library)
}
```

**Session shape:**
```js
{
  id, date, startedAt, endedAt,
  splitDay: { name, muscles, exercises },
  exercises: [{ id, exerciseId, name, muscles, equipment, sets: [{ id, setNumber, weight, reps, completed, restSeconds }] }]
}
```

### Key Conventions

- State is persisted to `localStorage` under key `repx_v1`
- Import actions as `{ A }` from `'../store/reducer'`
- All utility fns live in `store/reducer.js`: `makeSessionExercise`, `getCurrentDay`, `getPreviousPerformance`, `formatDuration`
- Tailwind CSS v4 — use utility classes; `twMerge` from `tailwind-merge` for conditional merging
- Icons from `lucide-react`
- No TypeScript — plain JSX throughout

---

## Known Backend Issues (TODO)

- [ ] Hash passwords with bcrypt in register + login
- [ ] Refactor `registerUser` to use `asyncHandler` / `ApiError` / `ApiResponse`
- [ ] Add `token` field to `User` model schema
- [ ] Fix `History.findByIdAndUpdate(userId)` → should be `findOneAndUpdate({ userId })`
- [ ] Set `active` field when creating a WorkoutPlan
- [ ] Add auth middleware to validate token cookie on protected routes
- [ ] Wire up `Streak` model (defined but unused)
- [ ] Connect frontend to backend API (frontend currently uses localStorage only)
