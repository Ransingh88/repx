# Error Handling Standards
**Projects:** Qodex · MoveX  
**Stack:** Express/Node.js · React · Socket.io · Judge0  
**Version:** 1.0 — May 2026

---

## 1. Core Philosophy

- **Fail loudly in development, fail gracefully in production.** Never swallow errors silently in either environment.
- **Never expose internals.** Stack traces, DB query details, and third-party error objects must never reach the client.
- **Classify before you respond.** Every error has a type (operational vs programmer) and a severity (fatal / recoverable / expected). Handle accordingly.
- **Errors are first-class citizens.** Log them like you log business events — structured, searchable, and actionable.

---

## 2. Error Classification

| Class | Examples | Response Strategy |
|---|---|---|
| **Operational – Expected** | 404 not found, 401 unauthorized, validation failure | Return user-facing error with clear message |
| **Operational – Unexpected** | DB timeout, Judge0 down, Socket disconnect | Return generic 500, log full details, alert if critical |
| **Programmer Error** | TypeError, null ref, unhandled promise | Crash (dev) / log + 500 (prod), never silently swallow |
| **External Dependency** | OpenAI API error, Google OAuth failure | Degrade gracefully, surface actionable user message |

---

## 3. Backend Standards (Express / Node.js)

### 3.1 Custom AppError Class

All intentionally thrown errors must use `AppError`. Never `throw new Error(...)` directly in route/service code.

```js
// src/utils/AppError.js
class AppError extends Error {
  constructor(message, statusCode, code = null, meta = {}) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 500 ? 'error' : 'fail';
    this.code = code;           // e.g. 'AUTH_TOKEN_EXPIRED'
    this.meta = meta;           // non-sensitive contextual data
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
```

Usage:
```js
throw new AppError('Email already in use', 409, 'USER_EMAIL_CONFLICT');
throw new AppError('Problem not found', 404, 'PROBLEM_NOT_FOUND');
throw new AppError('Rate limit exceeded', 429, 'RATE_LIMIT_HIT');
```

### 3.2 Async Handler Wrapper

Never use try/catch in every route. Wrap async routes with `catchAsync`.

```js
// src/utils/catchAsync.js
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = catchAsync;
```

Usage:
```js
router.post('/submit', catchAsync(async (req, res) => {
  const result = await judgeService.submit(req.body);
  res.status(200).json({ status: 'success', data: result });
}));
```

### 3.3 Global Error Handler Middleware

Must be registered **last** in `app.js` — after all routes.

```js
// src/middleware/errorHandler.js
const AppError = require('../utils/AppError');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    code: err.code,
    message: err.message,
    stack: err.stack,
    meta: err.meta,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      code: err.code,
      message: err.message,
    });
  }
  // Programmer error — don't leak details
  console.error('UNHANDLED ERROR:', err);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong. Please try again.',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Normalize known third-party errors
  if (err.name === 'JsonWebTokenError')
    err = new AppError('Invalid token.', 401, 'AUTH_TOKEN_INVALID');
  if (err.name === 'TokenExpiredError')
    err = new AppError('Token has expired.', 401, 'AUTH_TOKEN_EXPIRED');
  if (err.code === 11000)
    err = new AppError(`Duplicate field: ${Object.keys(err.keyValue).join(', ')}`, 409, 'DB_DUPLICATE_KEY');
  if (err.name === 'ValidationError')
    err = new AppError(Object.values(err.errors).map(e => e.message).join('. '), 400, 'VALIDATION_ERROR');
  if (err.name === 'CastError')
    err = new AppError(`Invalid ${err.path}: ${err.value}`, 400, 'DB_CAST_ERROR');

  process.env.NODE_ENV === 'development'
    ? sendErrorDev(err, res)
    : sendErrorProd(err, res);
};
```

Register in `app.js`:
```js
const errorHandler = require('./middleware/errorHandler');
// ... all routes ...
app.use(errorHandler);
```

### 3.4 Unhandled Rejections & Uncaught Exceptions

Add to the entry point (`server.js`):

```js
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
```

### 3.5 Judge0 / External API Error Handling (Qodex)

```js
// src/services/judgeService.js
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const submitCode = async (payload) => {
  let response;
  try {
    response = await axios.post(`${JUDGE0_URL}/submissions`, payload, { timeout: 10000 });
  } catch (err) {
    if (err.code === 'ECONNABORTED')
      throw new AppError('Code execution timed out. Try again.', 504, 'JUDGE0_TIMEOUT');
    throw new AppError('Code execution service unavailable.', 503, 'JUDGE0_UNAVAILABLE');
  }

  const { status, stderr, compile_output } = response.data;
  if (status?.id === 6) // Compilation error
    throw new AppError(compile_output || 'Compilation failed.', 422, 'JUDGE0_COMPILE_ERROR', { stderr });

  return response.data;
};
```

### 3.6 Socket.io Error Handling (MoveX)

```js
// src/socket/rideSocket.js
io.on('connection', (socket) => {

  const safeEmit = (event, data) => {
    try {
      socket.emit(event, data);
    } catch (err) {
      console.error(`Socket emit failed [${event}]:`, err.message);
    }
  };

  socket.on('request:ride', async (data) => {
    try {
      const ride = await rideService.createRide(data);
      safeEmit('ride:created', ride);
    } catch (err) {
      const isOperational = err.isOperational;
      safeEmit('error', {
        code: err.code || 'RIDE_REQUEST_FAILED',
        message: isOperational ? err.message : 'Failed to create ride. Try again.',
      });
      if (!isOperational) console.error('Socket ride error:', err);
    }
  });

  socket.on('error', (err) => {
    console.error('Socket error on connection:', socket.id, err.message);
  });

  socket.on('disconnect', (reason) => {
    if (reason === 'transport error')
      console.warn('Socket transport error disconnect:', socket.id);
  });
});
```

---

## 4. Frontend Standards (React)

### 4.1 API Error Response Shape

Expect and handle the standardized shape from the backend at all times:

```js
// Expected shape (from global error handler):
{
  status: 'fail' | 'error',
  code: 'SOME_ERROR_CODE',
  message: 'Human-readable message'
}
```

### 4.2 Axios Interceptor

Set up a global response interceptor once in your API client:

```js
// src/api/axiosInstance.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const code = error.response?.data?.code;
    const message = error.response?.data?.message || 'Something went wrong.';

    if (status === 401 && code === 'AUTH_TOKEN_EXPIRED') {
      // Trigger token refresh or redirect to login
      window.location.href = '/login?session=expired';
      return Promise.reject(error);
    }

    if (status === 429) {
      // Surface rate limit feedback
      return Promise.reject({ ...error, userMessage: 'Too many requests. Please slow down.' });
    }

    return Promise.reject({ ...error, userMessage: message });
  }
);

export default api;
```

### 4.3 React Error Boundary

Wrap major page sections (not individual components) with an Error Boundary:

```jsx
// src/components/ErrorBoundary.jsx
import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('React Error Boundary caught:', error, info.componentStack);
    // Send to error tracking service (e.g. Sentry) here
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-fallback">
          <h2>Something went wrong.</h2>
          <button onClick={() => this.setState({ hasError: false })}>Try again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
```

Usage:
```jsx
<ErrorBoundary fallback={<ProblemPageError />}>
  <ProblemEditor />
</ErrorBoundary>
```

### 4.4 Async State Pattern (with error state)

Use a consistent pattern for data-fetching hooks:

```js
// src/hooks/useAsync.js
import { useState, useCallback } from 'react';

const useAsync = (asyncFn) => {
  const [state, setState] = useState({ data: null, loading: false, error: null });

  const execute = useCallback(async (...args) => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await asyncFn(...args);
      setState({ data, loading: false, error: null });
      return data;
    } catch (err) {
      const message = err.userMessage || err.message || 'Something went wrong.';
      setState({ data: null, loading: false, error: message });
      throw err; // re-throw so callers can react if needed
    }
  }, [asyncFn]);

  return { ...state, execute };
};

export default useAsync;
```

Usage:
```jsx
const { data, loading, error, execute } = useAsync(rideApi.bookRide);
```

### 4.5 Socket.io Client Error Handling (MoveX)

```js
// src/socket/useRideSocket.js
import { useEffect } from 'react';
import { socket } from './socketClient';

const useRideSocket = ({ onRideUpdate, onError }) => {
  useEffect(() => {
    socket.on('ride:update', onRideUpdate);

    socket.on('error', (err) => {
      console.error('Socket error from server:', err);
      onError?.(err.message || 'Connection error. Please refresh.');
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connect error:', err.message);
      onError?.('Unable to connect. Retrying...');
    });

    socket.on('disconnect', (reason) => {
      if (reason === 'io server disconnect') {
        socket.connect(); // server intentionally disconnected, reconnect manually
      }
      // For transport close, socket.io auto-reconnects
    });

    return () => {
      socket.off('ride:update', onRideUpdate);
      socket.off('error');
      socket.off('connect_error');
      socket.off('disconnect');
    };
  }, [onRideUpdate, onError]);
};
```

---

## 5. HTTP Status Code Reference

| Code | Use Case | Example in Qodex/MoveX |
|---|---|---|
| 200 | Success | Submission result returned |
| 201 | Resource created | New user registered |
| 400 | Bad request / validation | Missing fields in ride request |
| 401 | Unauthenticated | Expired JWT |
| 403 | Unauthorized (authenticated but no access) | Non-admin accessing admin route |
| 404 | Resource not found | Problem ID doesn't exist |
| 409 | Conflict | Duplicate email on register |
| 422 | Unprocessable (logic error) | Compile error from Judge0 |
| 429 | Rate limit | Too many code submissions |
| 503 | Service unavailable | Judge0 or OpenAI down |
| 504 | Gateway timeout | Judge0 execution timeout |

---

## 6. Error Code Registry

Define all error codes as constants. Never use magic strings.

```js
// src/constants/errorCodes.js
module.exports = {
  // Auth
  AUTH_TOKEN_INVALID:     'AUTH_TOKEN_INVALID',
  AUTH_TOKEN_EXPIRED:     'AUTH_TOKEN_EXPIRED',
  AUTH_TOKEN_MISSING:     'AUTH_TOKEN_MISSING',
  AUTH_UNAUTHORIZED:      'AUTH_UNAUTHORIZED',

  // User
  USER_NOT_FOUND:         'USER_NOT_FOUND',
  USER_EMAIL_CONFLICT:    'USER_EMAIL_CONFLICT',
  USER_INVALID_PASSWORD:  'USER_INVALID_PASSWORD',

  // Qodex – Problems & Submissions
  PROBLEM_NOT_FOUND:      'PROBLEM_NOT_FOUND',
  JUDGE0_TIMEOUT:         'JUDGE0_TIMEOUT',
  JUDGE0_UNAVAILABLE:     'JUDGE0_UNAVAILABLE',
  JUDGE0_COMPILE_ERROR:   'JUDGE0_COMPILE_ERROR',
  HINT_SERVICE_FAILED:    'HINT_SERVICE_FAILED',

  // MoveX – Rides
  RIDE_NOT_FOUND:         'RIDE_NOT_FOUND',
  RIDE_REQUEST_FAILED:    'RIDE_REQUEST_FAILED',
  DRIVER_NOT_AVAILABLE:   'DRIVER_NOT_AVAILABLE',

  // Generic
  VALIDATION_ERROR:       'VALIDATION_ERROR',
  DB_DUPLICATE_KEY:       'DB_DUPLICATE_KEY',
  DB_CAST_ERROR:          'DB_CAST_ERROR',
  RATE_LIMIT_HIT:         'RATE_LIMIT_HIT',
};
```

---

## 7. Logging Standards

- Use `console.error` (or a logger like Winston/Pino) consistently — never `console.log` for errors.
- Log structure: `{ timestamp, level, code, message, stack?, meta? }`.
- **Never log:** passwords, tokens, PII, full request bodies in production.
- Operational errors: log at `warn` level. Programmer errors: log at `error` level.

Minimal structured log pattern:
```js
const log = (level, code, message, meta = {}) => {
  console[level](JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    code,
    message,
    ...meta,
  }));
};
```

---

## 8. Checklist — Per Feature / PR

- [ ] All async route handlers wrapped in `catchAsync`
- [ ] All thrown errors use `AppError` with a defined error code
- [ ] No raw `Error` objects thrown in service/route layer
- [ ] External service calls (Judge0, OpenAI, Google OAuth) have try/catch with specific error codes
- [ ] Socket event handlers have try/catch; errors emitted to client with safe messages
- [ ] Frontend API calls use the axios interceptor; no raw `catch(err) => console.log(err)`
- [ ] Major React sections wrapped in `<ErrorBoundary>`
- [ ] HTTP status codes match the reference table
- [ ] No stack traces or DB details exposed in production responses
