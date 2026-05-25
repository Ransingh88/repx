# Project — MERN Monorepo

A full-stack MERN monorepo managed with **npm workspaces** and **Turborepo**.  
The server, client, and all shared packages are developed and versioned together.

---

## Workspace overview

| Workspace | Path | Description |
|---|---|---|
| `@scope/server` | `apps/server/` | Express / Node.js REST API + Socket.io |
| `@scope/client` | `apps/client/` | React SPA (Vite + Redux Toolkit) |
| `@scope/shared-types` | `packages/shared-types/` | TypeScript types and Zod schemas shared by both apps |
| `@scope/ui-kit` | `packages/ui-kit/` | Shared React component library |
| `@scope/utils` | `packages/utils/` | Pure utility functions — works in Node and browser |
| `@scope/eslint-config` | `config/eslint-config/` | Shared ESLint config extended by all workspaces |
| `@scope/tsconfig` | `config/tsconfig/` | Base TypeScript configs (`base`, `node`, `react`) |

> Replace `@scope` with your organisation or project name (e.g. `@myapp`).

---

## Monorepo structure

```
project-root/
├── apps/
│   ├── server/               # Express backend (see apps/server/README.md)
│   └── client/               # React frontend (see apps/client/README.md)
├── packages/
│   ├── shared-types/         # DTOs, Zod schemas, enums — shared by server + client
│   ├── ui-kit/               # Generic React components — zero business logic
│   └── utils/                # Pure helpers — formatters, validators, constants
├── config/
│   ├── eslint-config/        # Shared ESLint rules
│   └── tsconfig/             # base.json, node.json, react.json
├── .github/
│   └── workflows/            # CI/CD pipelines
├── turbo.json                # Turborepo task pipeline
├── docker-compose.yml        # Local dev orchestration
├── package.json              # Root manifest — workspaces + dev tooling only
└── .env.example              # Root-level env vars (shared infra only)
```

---

## The golden rule

> **Apps never import from other apps.**  
> `apps/server` and `apps/client` are completely independent deployment units.  
> All shared code lives in `packages/` and is imported via the workspace protocol.

```js
// ✅ Correct — importing from a shared package
import { LoginDto } from '@scope/shared-types';

// ❌ Wrong — cross-app import
import { something } from '../../client/src/features/auth';
```

---

## Getting started

### Prerequisites

- Node.js 20+
- npm 9+ (workspaces support)
- MongoDB (local or Atlas URI)
- Redis (for BullMQ queues)
- Docker + Docker Compose (recommended for local infra)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/your-project.git
cd your-project

# Install all workspace dependencies from the root
npm install

# Copy and populate env files
cp .env.example .env
cp apps/server/.env.example apps/server/.env
cp apps/client/.env.example apps/client/.env
```

### Start local infrastructure (MongoDB + Redis)

```bash
# Starts DB and Redis only — no app containers
docker-compose up -d mongo redis
```

### Start all apps in development mode

```bash
# Runs server + client concurrently via Turborepo
npm run dev
```

Individual apps:

```bash
npm run dev --workspace=apps/server
npm run dev --workspace=apps/client
```

---

## Available scripts

Run from the **monorepo root** unless noted.

| Script | Description |
|---|---|
| `npm run dev` | Start all apps in parallel (via Turbo) |
| `npm run build` | Build all apps and packages in correct dependency order |
| `npm run test` | Run all test suites |
| `npm run lint` | Lint all workspaces |
| `npm run lint:fix` | Autofix lint errors across all workspaces |
| `npm run type-check` | TypeScript check across all workspaces |
| `npm run clean` | Remove all `dist/`, `.turbo/`, `node_modules/` |

Run a script in a single workspace:

```bash
npm run test --workspace=apps/server
npm run build --workspace=packages/shared-types
```

---

## Turborepo pipeline

`turbo.json` defines the task dependency graph so builds and tests run in the  
correct order and results are cached.

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {}
  }
}
```

`^build` means: build all upstream packages before building this workspace.  
`apps/server` and `apps/client` will never start until `packages/shared-types` is built.

---

## Shared packages

### `@scope/shared-types`

The most critical shared package. Defines API request/response DTOs as TypeScript types  
and Zod schemas — used for validation on the server and type safety on the client.

```ts
// packages/shared-types/src/auth.types.ts
import { z } from 'zod';

export const LoginDtoSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginDto = z.infer<typeof LoginDtoSchema>;
```

```ts
// apps/server — validate incoming request
import { LoginDtoSchema } from '@scope/shared-types';
router.post('/login', validate(LoginDtoSchema), authController.login);

// apps/client — type the form
import type { LoginDto } from '@scope/shared-types';
const form = useForm<LoginDto>();
```

### `@scope/utils`

Pure functions with zero framework dependencies. Works identically in Node and browser.  
Do not add `process.env` reads — accept config as function arguments.

### `@scope/ui-kit`

Shared React primitives (Button, Input, Badge, Modal).  
No business logic. No API calls. Peer-dep on React — not bundled.

---

## Environment variables

Each app manages its own env vars. Do not share secrets across apps via a root `.env`.

```
project-root/
├── .env                   # Shared infra only — Docker Compose, CI scripts
├── apps/server/.env       # Server-specific — DB, JWT, Redis, SMTP
└── apps/client/.env       # Client-specific — VITE_API_URL, feature flags
```

See each app's `README.md` for the full variable reference.

---

## CI / CD

GitHub Actions workflows in `.github/workflows/`:

| Workflow | Trigger | What it does |
|---|---|---|
| `ci.yml` | Push / PR to `main` | Lint → type-check → test all affected workspaces |
| `deploy-server.yml` | Push to `main` | Build + deploy `apps/server` |
| `deploy-client.yml` | Push to `main` | Build + deploy `apps/client` |

Turborepo's `--filter=[HEAD^1]` flag ensures only workspaces affected by a commit  
are re-tested and re-deployed. Unchanged packages use the Turbo remote cache.

```yaml
# Example — run tests only on affected workspaces
- name: Test affected
  run: npx turbo run test --filter=[HEAD^1]
```

---

## Docker

For production, each app has its own `Dockerfile`:

```bash
# Build server image
docker build -f apps/server/Dockerfile -t myapp-server .

# Build client image
docker build -f apps/client/Dockerfile -t myapp-client .
```

`docker-compose.yml` at the root is for **local development only** — it spins up  
MongoDB, Redis, and optionally the apps. Never use it for production.

---

## Adding a new package

```bash
# 1. Create the package folder
mkdir packages/my-package

# 2. Initialise with a package.json
cd packages/my-package
npm init -y
# Set "name": "@scope/my-package"

# 3. Add it as a dependency in the consuming app
cd ../../apps/server
npm install @scope/my-package

# 4. Import and use
import { helper } from '@scope/my-package';
```

---

## Contributing

1. Branch from `main` using `feat/`, `fix/`, or `chore/` prefixes.
2. Run `npm run lint && npm run type-check && npm run test` before opening a PR.
3. Changes to `packages/shared-types` require a version bump and a changelog entry.
4. Never add production dependencies to the root `package.json`.
5. Document new env vars in the relevant `apps/*/README.md` and `.env.example`.
