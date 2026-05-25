# Coding Standards — Qodex & MoveX

> **Version:** 1.0  
> **Projects:** [Qodex](https://qodex.co.in) · MoveX  
> **Stack:** MERN (MongoDB · Express · React · Node.js) + Socket.io · Judge0 · OpenAI  
> **Purpose:** Onboarding collaborators and maintaining consistency across both codebases.

All contributors must read this document before making their first commit. Rules marked **Required** are non-negotiable. **Recommended** rules are strong defaults — deviate only with a comment explaining why. **Preferred** rules are team style choices; pick one and stay consistent.

---

## Table of contents

1. [Naming conventions](#1-naming-conventions)
2. [File & folder structure](#2-file--folder-structure)
3. [Git workflow](#3-git-workflow)
4. [API & backend](#4-api--backend)
5. [React & frontend](#5-react--frontend)
6. [AI tooling](#6-ai-tooling)
7. [Security](#7-security)
8. [Testing](#8-testing)

---

## 1. Naming conventions

### 1.1 Variables & functions — `camelCase` · Required

All JavaScript/TypeScript variables, function names, and method names use camelCase.

```js
const userId = req.user._id;
const getUserById = async (id) => { ... };
```

### 1.2 React components & classes — `PascalCase` · Required

All React components, ES6 classes, and TypeScript interfaces/types use PascalCase.

```tsx
const RideCard = () => { ... };
class UserService { ... }
interface UserProfile { ... }
```

### 1.3 Constants — `SCREAMING_SNAKE_CASE` · Required

Top-level constants and environment-derived config values use all-caps snake_case.

```js
const MAX_RETRY_ATTEMPTS = 3;
const JWT_SECRET = process.env.JWT_SECRET;
```

### 1.4 File names — `kebab-case` · Recommended

All file names use kebab-case. React component files are the sole exception — they match the component name (PascalCase).

```
auth-middleware.js
ride-service.js
RideCard.jsx
UserProfile.jsx
```

### 1.5 Boolean variables — `is` / `has` / `can` / `should` prefix · Required

Boolean variables must signal their type through a descriptive prefix.

```js
const isLoading = false;
const hasVerifiedEmail = user.emailVerified;
const canSubmitHint = remainingHints > 0;
const shouldRedirect = !user.isAuthenticated;
```

### 1.6 Event handlers — `handle` prefix · Recommended

Functions passed as event handlers should be named with a `handle` prefix.

```jsx
const handleRideCancel = () => { ... };
<button onClick={handleRideCancel}>Cancel ride</button>
```

---

## 2. File & folder structure

### 2.1 Feature-based folder structure · Required

Group files by **feature**, not by type. Avoid the flat `/controllers`, `/services`, `/models` anti-pattern at the root level.

```
src/
  features/
    auth/
      auth.controller.js
      auth.service.js
      auth.routes.js
      auth.validation.js
    rides/
      ride.controller.js
      ride.service.js
      ride.routes.js
    problems/               ← Qodex-specific
      problem.controller.js
      problem.service.js
    hints/                  ← Qodex-specific
      hint.controller.js
      hint.service.js
      hint.prompt.js
  config/
    db.js
    passport.js
    judge0.js
    openai.js
  middleware/
    auth.middleware.js
    errorHandler.js
    rateLimiter.js
  models/
    User.model.js
    Ride.model.js
    Problem.model.js
  prompts/
    hintPrompt.js
  utils/
    asyncWrapper.js
    tokenUtils.js
```

### 2.2 Index barrel exports · Recommended

Use `index.js` to re-export from feature folders to keep import paths short.

```js
// features/auth/index.js
export { authRouter } from './auth.routes';
export { AuthService } from './auth.service';
```

### 2.3 Config is isolated · Required

All environment config, third-party client setup, and constants live in `/config`. Business logic must never import directly from `process.env` — it reads from config instead.

```js
// config/openai.js
import OpenAI from 'openai';
export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
```

### 2.4 One component per file (React) · Required

Each React component lives in its own file. Co-locate its CSS module or styled component in the same folder.

```
components/
  RideCard/
    RideCard.jsx
    RideCard.module.css
    index.js
  ProblemEditor/
    ProblemEditor.jsx
    ProblemEditor.module.css
    index.js
```

---

## 3. Git workflow

### 3.1 Conventional commits · Required

All commits follow the [Conventional Commits](https://www.conventionalcommits.org) spec. This enables readable history and future changelog generation.

**Format:** `type(scope): short description`

| Type | When to use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `chore` | Tooling, deps, config |
| `refactor` | Code change with no behaviour change |
| `test` | Adding or updating tests |
| `docs` | Documentation only |
| `perf` | Performance improvement |

```
feat(auth): add Google OAuth callback handler
fix(rides): correct driver matching socket event name
chore: bump judge0 client to v2.1
refactor(ui): extract RideCard into shared component
test(auth): add login service unit tests
docs: update onboarding readme
```

### 3.2 Branch naming · Required

Every branch ties back to a Linear ticket. This makes PRs and reviews fully traceable.

**Format:** `type/DEB-XX-short-description`

```
feat/DEB-12-driver-socket-matching
fix/DEB-31-jwt-refresh-rotation
chore/DEB-5-eslint-config
refactor/DEB-19-extract-ride-service
```

### 3.3 No direct pushes to `main` · Required

All changes arrive via pull requests. When working solo, do a self-review pass before merging. When collaborators are involved, at least one approval is required.

### 3.4 Squash merge feature branches · Recommended

Squash-merge to keep `main` history linear. Each feature or fix = one commit on `main`.

### 3.5 PR description template · Recommended

Every PR should include:

```markdown
## What
Brief description of what changed.

## Why
Link to the Linear ticket (e.g. DEB-12) and context for why this change is needed.

## How to test
Step-by-step instructions for a reviewer to verify the change works.

## Screenshots (if UI change)
Before / after screenshots or a screen recording.
```

### 3.6 Commit message body for non-trivial changes · Preferred

For complex commits, add a body explaining the *why*, not the *what* (the diff shows the what).

```
feat(hints): rate-limit hint endpoint per user

OpenAI calls are costly. Without per-user limiting, a single user
could exhaust the monthly quota. Applied a 5 req/min limit using
express-rate-limit scoped to req.user._id.
```

---

## 4. API & backend

### 4.1 RESTful route naming · Required

Routes use nouns, not verbs. The HTTP method conveys the action.

```
GET    /api/rides            → list rides
POST   /api/rides            → create ride
GET    /api/rides/:id        → get one ride
PATCH  /api/rides/:id        → partial update
DELETE /api/rides/:id        → delete ride

GET    /api/problems         → list problems  (Qodex)
POST   /api/problems/:id/submit → submit solution
POST   /api/hints            → request a hint  (Qodex)
```

### 4.2 Centralised error handler · Required

Never send raw errors to the client. All errors flow through a single Express error middleware registered after all routes.

```js
// middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Something went wrong';
  res.status(status).json({ error: message });
};

// index.js — must be last
app.use(errorHandler);
```

### 4.3 Input validation with Joi or Zod · Required

Every route that accepts a body or query param must validate it before the request reaches the service layer. Use a dedicated validation middleware.

```js
// auth.validation.js
import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

// auth.routes.js
import { validate } from '../middleware/validate';
router.post('/login', validate(loginSchema), authController.login);
```

### 4.4 Service layer — no business logic in controllers · Required

Controllers handle HTTP only (parsing request, sending response). All business logic lives in service files. This makes services independently testable and reusable.

```js
// auth.controller.js
export const login = async (req, res, next) => {
  try {
    const result = await AuthService.login(req.body);
    res.json(result);
  } catch (e) {
    next(e);
  }
};

// auth.service.js
export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid credentials', 401);
  }
  return generateTokens(user);
};
```

### 4.5 Async/await with `asyncWrapper` · Required

Use async/await consistently. Wrap route handlers with a utility to avoid repeating try-catch in every controller.

```js
// utils/asyncWrapper.js
export const asyncWrapper = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// usage
router.get('/rides', asyncWrapper(rideController.listRides));
```

### 4.6 Rate limiting on all public endpoints · Required

Apply `express-rate-limit` globally and tighten it on sensitive endpoints (auth, AI). See also [§6.5](#65-rate-limit-ai-endpoints-separately--required) for AI-specific limits.

```js
// middleware/rateLimiter.js
import rateLimit from 'express-rate-limit';

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 min
  max: 100,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many attempts, please try again later.' },
});
```

### 4.7 HTTP status codes · Recommended

Use semantically correct status codes. Never return `200` for errors.

| Situation | Status |
|---|---|
| Success (read) | `200` |
| Created | `201` |
| No content (delete) | `204` |
| Bad request / validation | `400` |
| Unauthenticated | `401` |
| Forbidden | `403` |
| Not found | `404` |
| Too many requests | `429` |
| Server error | `500` |

---

## 5. React & frontend

### 5.1 Functional components + hooks only · Required

No class components. All state and side effects use hooks.

### 5.2 Custom hooks for shared logic · Required

Any logic used in two or more components becomes a custom hook in `/hooks`.

```js
// hooks/useRideStatus.js
const useRideStatus = (rideId) => {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    socket.on('rideUpdate', ({ id, status }) => {
      if (id === rideId) setStatus(status);
    });
    return () => socket.off('rideUpdate');
  }, [rideId]);

  return status;
};
```

### 5.3 TypeScript interfaces for all props · Required

Every component must declare its expected props using a TypeScript interface.

```tsx
interface RideCardProps {
  rideId: string;
  origin: string;
  destination: string;
  estimatedMinutes: number;
  onCancel: () => void;
}

const RideCard = ({ rideId, origin, destination, estimatedMinutes, onCancel }: RideCardProps) => { ... };
```

### 5.4 No inline styles except dynamic values · Recommended

Use CSS modules or Tailwind. Reserve inline styles for values that are computed at runtime (e.g. a width derived from state).

```jsx
// Bad
<div style={{ color: 'red', marginTop: '16px' }}>...</div>

// Good
<div className={styles.errorText}>...</div>

// OK — dynamic value
<div style={{ width: `${progress}%` }} />
```

### 5.5 `useCallback` and `useMemo` intentionally · Preferred

Don't memoize by default. Only use when a dependency is provably expensive or causes referential equality issues that break child renders. Add a comment explaining why when you do.

```jsx
// Memoised because passed to a deeply nested child that re-renders on every parent update
const handleSubmit = useCallback(() => { ... }, [problemId]);
```

### 5.6 Lazy load all page-level routes · Recommended

All page-level components should be code-split with `React.lazy` and `Suspense`.

```jsx
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const ProblemView = React.lazy(() => import('./pages/ProblemView'));

<Suspense fallback={<PageLoader />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/problems/:id" element={<ProblemView />} />
  </Routes>
</Suspense>
```

### 5.7 Error boundaries on route-level components · Recommended

Wrap lazy-loaded pages in an error boundary to prevent full-app crashes.

```jsx
<ErrorBoundary fallback={<ErrorPage />}>
  <Suspense fallback={<PageLoader />}>
    <Dashboard />
  </Suspense>
</ErrorBoundary>
```

---

## 6. AI tooling

> These rules apply to Qodex's hint system. If MoveX adds AI features later, the same rules apply.

### 6.1 Prompts in `/prompts` folder · Required

Never hardcode prompts inline inside service or controller files. Store them as template functions for easy tuning and review.

```js
// prompts/hintPrompt.js
export const buildHintPrompt = ({ problem, userCode, language, hintsUsed }) => `
You are a coding tutor helping a student solve a problem.
Do NOT give away the solution. Provide a single, concise hint.
Hints already given: ${hintsUsed}

Problem:
${problem}

User's current ${language} code:
${userCode}

Respond with one short hint only.
`.trim();
```

### 6.2 Always set `max_tokens` · Required

Set `max_tokens` explicitly on every AI API call. Log token usage per request for cost tracking.

```js
const response = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  max_tokens: 300,
  messages: [{ role: 'user', content: prompt }],
});

console.log('[hint] tokens used:', response.usage.total_tokens);
```

### 6.3 Graceful fallback on AI failures · Required

Never let an OpenAI error surface to the user as a 500. Always return a helpful, safe fallback message.

```js
try {
  return await getHintFromAI(payload);
} catch (err) {
  console.error('[hint] OpenAI error:', err.message);
  return {
    hint: 'Hint unavailable right now. Please try again in a moment.',
    fallback: true,
  };
}
```

### 6.4 Never send PII to external AI APIs · Required

Strip emails, names, user IDs, and any personally identifiable information before sending data to OpenAI or any third-party AI service. Only send the problem description and the user's code.

```js
// Bad
const payload = { user: req.user, code: req.body.code };

// Good
const payload = {
  problem: req.body.problemDescription,
  userCode: req.body.code,
  language: req.body.language,
};
```

### 6.5 Rate limit AI endpoints separately · Required

AI calls are expensive. Apply a stricter per-user rate limit on `/api/hints` and any future AI endpoints.

```js
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,      // 1 min
  max: 5,
  keyGenerator: (req) => req.user._id.toString(),
  message: { error: 'Hint limit reached. Wait a moment before trying again.' },
});
```

---

## 7. Security

### 7.1 Helmet.js on every Express app · Required

Add `helmet()` as the first middleware in every Express app. It sets 14 security-related HTTP headers automatically.

```js
import helmet from 'helmet';
app.use(helmet());
```

### 7.2 Refresh token rotation · Required

On every access token refresh, issue a new refresh token and invalidate the previous one. Prevents replay attacks.

```js
// On POST /api/auth/refresh
const newAccessToken = generateAccessToken(user._id);
const newRefreshToken = generateRefreshToken(user._id);

await invalidateRefreshToken(oldToken);   // delete from DB
await saveRefreshToken(user._id, newRefreshToken);

res.cookie('refreshToken', newRefreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
});

res.json({ accessToken: newAccessToken });
```

### 7.3 `httpOnly` + `Secure` cookies for refresh tokens · Required

Never store JWTs or refresh tokens in `localStorage`. Use `httpOnly` cookies for refresh tokens. Access tokens may live in memory (React state).

### 7.4 Sanitise all database inputs · Required

Always use Mongoose schema validation. Never build queries from raw user strings. Use `mongoose-sanitize` or validate before querying.

```js
// Bad
User.findOne({ username: req.body.username });

// Good — schema validates types; Joi/Zod validates before this point
const user = await User.findOne({ username: sanitizedUsername });
```

### 7.5 Email verification before full access · Required

New users must verify their email before accessing protected features. Wire the `isEmailVerified` flag to route guards.

```js
export const requireVerifiedEmail = (req, res, next) => {
  if (!req.user.isEmailVerified) {
    return res.status(403).json({ error: 'Please verify your email to continue.' });
  }
  next();
};
```

### 7.6 `.env` never committed · Required

`.env` must be in `.gitignore`. Maintain a `.env.example` with placeholder values for easy onboarding.

```env
# .env.example — commit this file
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret_at_least_32_chars
JWT_REFRESH_SECRET=your_refresh_secret
OPENAI_API_KEY=your_openai_api_key
JUDGE0_API_URL=https://judge0-api-url
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

## 8. Testing

### 8.1 Unit test all service layer functions · Required

Services contain pure business logic and are the easiest layer to test. Target 80%+ coverage on all service files.

```js
// auth.service.test.js
describe('AuthService.login', () => {
  it('returns tokens for valid credentials', async () => {
    const result = await AuthService.login({ email: 'test@test.com', password: 'valid123' });
    expect(result).toHaveProperty('accessToken');
  });

  it('throws 401 for invalid password', async () => {
    await expect(AuthService.login({ email: 'test@test.com', password: 'wrong' }))
      .rejects.toMatchObject({ statusCode: 401 });
  });
});
```

### 8.2 Integration tests for all API routes · Recommended

Use `supertest` to test the full request → response cycle for every route.

```js
// auth.routes.test.js
import request from 'supertest';
import app from '../app';

describe('POST /api/auth/login', () => {
  it('returns 200 and an access token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@test.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
  });

  it('returns 401 for bad credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@test.com', password: 'wrong' });

    expect(res.status).toBe(401);
  });
});
```

### 8.3 Mock all external services · Required

Never hit real APIs in tests. Mock OpenAI, Judge0, Socket.io, and any other external integrations.

```js
// Mock OpenAI for hint service tests
jest.mock('../config/openai', () => ({
  chat: {
    completions: {
      create: jest.fn().mockResolvedValue({
        choices: [{ message: { content: 'Try using a hash map.' } }],
        usage: { total_tokens: 42 },
      }),
    },
  },
}));
```

### 8.4 Test file co-location · Recommended

Test files live next to the code they test, not in a separate `/tests` root folder.

```
features/
  auth/
    auth.service.js
    auth.service.test.js
    auth.routes.js
    auth.routes.test.js
```

### 8.5 Test naming convention · Recommended

Describe blocks name the unit under test. `it` blocks read as a sentence.

```
describe('RideService.createRide')
  it('creates a ride and returns the ride document')
  it('throws if no available drivers are found')
  it('emits a socket event to the matched driver')
```

---

## Appendix: quick-reference cheat sheet

| Rule | Standard |
|---|---|
| Variables / functions | `camelCase` |
| Components / classes / types | `PascalCase` |
| Constants / env vars | `SCREAMING_SNAKE_CASE` |
| File names | `kebab-case` (components: `PascalCase`) |
| Boolean prefix | `is` / `has` / `can` / `should` |
| Commits | `feat(scope): description` |
| Branches | `type/DEB-XX-short-desc` |
| Error handling | Centralised `errorHandler` middleware |
| Validation | Joi or Zod on every route |
| Tokens in browser | `httpOnly` cookie (refresh) + memory (access) |
| AI prompts | `/prompts` folder, never inline |
| Test location | Co-located next to source file |

---

*Maintained by Debasish. Update this document whenever a new pattern is adopted or an existing one is changed. Version this file in Git alongside the codebase.*
