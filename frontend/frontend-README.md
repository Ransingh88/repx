# Client — React Frontend

A React single-page application built with **Vite**, **Redux Toolkit**, and **React Router v6**.  
Follows a feature-first folder structure — each domain owns its own components, hooks, and state.

---

## Tech stack

| Concern | Technology |
|---|---|
| Build tool | Vite |
| UI | React 18 |
| State management | Redux Toolkit + RTK Query |
| Routing | React Router v6 |
| Styling | CSS Modules (+ Tailwind optional) |
| HTTP client | Axios (configured instance) |
| Real-time | Socket.io-client |
| Testing | Vitest + React Testing Library |
| Forms | React Hook Form + Zod |

---

## Folder structure

```
client/
├── public/                   # Static assets served as-is
├── src/
│   ├── assets/               # Images, fonts — no business logic
│   ├── components/           # Globally reusable UI components
│   │   ├── ui/               # Design system atoms — Button, Input, Modal
│   │   └── layout/           # Shells — Navbar, Sidebar, PageWrapper
│   ├── features/             # Feature-first modules — self-contained
│   │   ├── auth/
│   │   │   ├── components/   # LoginForm, RegisterForm — auth-only
│   │   │   ├── hooks/        # useAuth, useOAuth
│   │   │   ├── authSlice.js  # Redux slice + async thunks
│   │   │   └── auth.api.js   # All API calls for this feature
│   │   └── [feature]/        # Same structure per feature
│   ├── hooks/                # Shared hooks used in 2+ features
│   ├── lib/                  # Configured third-party clients
│   │   ├── axios.js          # Axios instance + interceptors
│   │   ├── socket.js         # Socket.io-client instance
│   │   └── queryClient.js    # React Query client (if used)
│   ├── pages/                # Route-level components — thin shells only
│   ├── store/                # Redux store config + root reducer
│   ├── utils/                # Pure JS helpers — no React imports
│   ├── router.jsx            # React Router v6 route definitions
│   └── main.jsx              # Entry point — providers only
├── .env.example
├── package.json
└── vite.config.js
```

---

## Architecture rules

### Feature-first structure

Every domain feature (auth, dashboard, settings, etc.) is self-contained:

```
features/auth/
├── components/   — UI only used within auth
├── hooks/        — hooks only used within auth
├── authSlice.js  — Redux state + async thunks
└── auth.api.js   — Axios calls for auth endpoints
```

**Promotion rule:** A component or hook moves to `src/components/` or `src/hooks/`  
only when it is used in two or more separate features.

### Layer responsibilities

| Layer | Rule |
|---|---|
| `pages/` | Compose feature components. No business logic. No direct API calls. |
| `features/*/components/` | Feature-specific UI. Can read from its own slice. |
| `components/ui/` | Zero business logic. Props-driven only. |
| `features/*/authSlice.js` | State + reducers + thunks. Thunks call `*.api.js`, never raw axios. |
| `lib/axios.js` | Single axios instance. Auth interceptors live here — once, globally. |

---

## Getting started

### Prerequisites

- Node.js 20+
- Backend API running (see `../server/README.md`)

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env
# Set VITE_API_URL to your backend URL

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Available scripts

| Script | Description |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm test` | Run Vitest test suite |
| `npm run test:ui` | Vitest with browser UI |
| `npm run lint` | ESLint check |
| `npm run lint:fix` | ESLint autofix |

---

## Environment variables

All client-side env vars must be prefixed with `VITE_` to be exposed to the browser.

```env
# API
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000

# Feature flags (optional)
VITE_ENABLE_ANALYTICS=false
```

> Never put secrets in frontend env vars — they are bundled into the JS output and publicly visible.

---

## Path aliases

`@/` resolves to `src/`. Configured in both `vite.config.js` and `tsconfig.json`.

```js
// Instead of this
import { Button } from '../../../components/ui/Button';

// Write this
import { Button } from '@/components/ui/Button';
```

---

## State management

Redux Toolkit is used for global state. The pattern per feature:

```js
// features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser } from './auth.api';

export const login = createAsyncThunk('auth/login', loginUser);

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, status: 'idle' },
  reducers: { logout: (state) => { state.user = null; } },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
```

**Local UI state** (form open/closed, hover, tab selection) stays in component `useState`.  
**Server state** (data fetched from API) uses RTK Query or React Query — not manual thunks.

---

## HTTP client

Never call raw `axios.get()` in components. Always use the configured instance:

```js
// lib/axios.js — configured once
import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 401 → token refresh logic lives here, not in components
api.interceptors.response.use(null, handleUnauthorized);

export default api;
```

---

## Routing

All routes are lazy-loaded. Protected routes use a wrapper component.

```jsx
// router.jsx
const LoginPage = React.lazy(() => import('@/pages/LoginPage'));
const DashboardPage = React.lazy(() => import('@/pages/DashboardPage'));

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <ProtectedRoute />,   // Redirects to /login if not authenticated
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
    ],
  },
]);
```

---

## Testing conventions

```
src/
└── features/
    └── auth/
        └── components/
            ├── LoginForm.jsx
            └── LoginForm.test.jsx   # Co-located with component
```

- Component tests live next to the component file.
- Use React Testing Library — test behaviour, not implementation.
- Mock `lib/axios.js` in tests with `vi.mock('@/lib/axios')`.
- Aim for > 70% coverage on `features/` components.

---

## Contributing

1. Branch from `main` using `feat/`, `fix/`, or `chore/` prefixes.
2. New components must have at least one behaviour test.
3. No direct `process.env` or `import.meta.env` reads outside `lib/` or `config/`.
4. All PRs must pass lint + tests before merge.
