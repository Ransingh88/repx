# Server — Express / Node.js Backend

A RESTful API built with **Node.js**, **Express**, and **MongoDB (Mongoose)**.  
Follows a strict layered architecture: Routes → Controllers → Services → Models.

---

## Tech stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20+ |
| Framework | Express 4 |
| Database | MongoDB + Mongoose |
| Auth | JWT (access + refresh tokens) |
| Validation | Zod |
| Testing | Jest + Supertest |
| Task queue | BullMQ + Redis |
| Real-time | Socket.io |

---

## Folder structure

```
server/
├── src/
│   ├── config/               # DB connection, env validation
│   │   ├── db.js
│   │   └── env.js
│   ├── controllers/          # HTTP req/res only — no business logic
│   │   ├── auth.controller.js
│   │   └── user.controller.js
│   ├── services/             # All business logic — framework-agnostic
│   │   ├── auth.service.js
│   │   └── email.service.js
│   ├── models/               # Mongoose schemas — data shape only
│   │   └── User.model.js
│   ├── routes/               # URL + method mapping only
│   │   └── auth.routes.js
│   ├── middlewares/          # Auth guards, validators, error handler
│   │   ├── auth.middleware.js
│   │   └── errorHandler.middleware.js
│   ├── validators/           # Zod schemas for request validation
│   ├── utils/                # Pure stateless helper functions
│   ├── jobs/                 # BullMQ workers and cron tasks
│   ├── socket/               # Socket.io event handlers
│   ├── app.js                # Express app — middleware + route mounting
│   └── server.js             # Entry point — DB connect + app.listen()
├── tests/
│   ├── unit/                 # Mirrors src/ structure
│   └── integration/          # Supertest API tests
├── .env.example
├── package.json
└── Dockerfile
```

---

## Architecture rules

**Layer order — never skip or reverse:**

```
Request → Route → Middleware → Controller → Service → Model → DB
```

- **Routes** declare URL + method + middleware chain only.  
  No logic. Pattern: `router.post('/login', validate(schema), controller.login)`

- **Controllers** parse `req`, call one or more services, send `res`.  
  No DB queries. Target ≤ 30 lines per handler.

- **Services** contain all business logic.  
  No `req`/`res`. No Express imports. Fully unit-testable in isolation.

- **Models** define schema and DB-level helpers only.  
  No business logic. Pre/post hooks and virtuals are acceptable.

---

## Getting started

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas URI)
- Redis (required for BullMQ job queues)

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env
# Fill in required values (see Environment section below)

# Start development server with hot reload
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Available scripts

| Script | Description |
|---|---|
| `npm run dev` | Start with nodemon hot reload |
| `npm start` | Production start |
| `npm test` | Run Jest test suite |
| `npm run test:coverage` | Coverage report |
| `npm run lint` | ESLint check |
| `npm run lint:fix` | ESLint autofix |

---

## Environment variables

Copy `.env.example` to `.env` and populate every value.  
The app **will not start** if any required variable is missing (validated via Zod at startup).

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/your_db_name

# Auth
JWT_ACCESS_SECRET=your_access_secret_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_min_32_chars
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Redis (for BullMQ)
REDIS_URL=redis://localhost:6379

# Email
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=

# Client (for CORS)
CLIENT_URL=http://localhost:5173
```

> Never commit `.env`. Only `.env.example` is committed.

---

## API structure

All routes are prefixed with `/api`.

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/users/me
PATCH  /api/users/me
DELETE /api/users/me
```

### Standard response shape

```json
{
  "success": true,
  "data": { },
  "message": "Optional human-readable message"
}
```

### Error response shape

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": [ ]
  }
}
```

---

## Error handling

All services throw typed errors. The global error handler middleware in  
`src/middlewares/errorHandler.middleware.js` maps them to HTTP status codes.

```js
// Example — throw from a service
throw new AppError('User not found', 404, 'NOT_FOUND');

// The global handler catches this and sends:
// { success: false, error: { code: 'NOT_FOUND', message: 'User not found' } }
```

---

## Testing conventions

```
tests/
├── unit/
│   └── services/
│       └── auth.service.test.js   # Mirrors src/services/auth.service.js
└── integration/
    └── auth.routes.test.js        # Full HTTP cycle via Supertest
```

- Unit tests mock the DB layer — services are tested in isolation.
- Integration tests use an in-memory MongoDB instance (`mongodb-memory-server`).
- Aim for > 80% coverage on the `services/` layer.

---

## Docker

```bash
# Build the image
docker build -t myapp-server .

# Run with env file
docker run --env-file .env -p 5000:5000 myapp-server
```

For local full-stack development, use `docker-compose.yml` at the monorepo root.

---

## Contributing

1. Branch from `main` using `feat/`, `fix/`, or `chore/` prefixes.
2. Keep commits atomic — one concern per commit.
3. All PRs must pass lint + tests before merge.
4. Services must have unit tests before a PR is opened.
