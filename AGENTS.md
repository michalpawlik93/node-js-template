# AI Development Guidelines

This repository is a full-stack monorepo with two independent subfolders: `backend/` and `ui/`.

## Mandatory Guidelines

Before performing any modification, read the relevant guidelines for the area you are working in:

### Backend (`backend/`)
- [Repository Overview](./.ai/backend/repository.md) — architecture, module structure, start here
- [Nx Rules](./.ai/backend/nx-rules.md) — workspace conventions, project boundaries
- [System Design Rules](./.ai/backend/system-design-rules.md) — CQRS, service bus, Result pattern
- [Module Design Rules](./.ai/backend/module-design-rule.md) — application/domain/infrastructure layers
- [Testing Rules](./.ai/backend/testing-rules.md) — unit/integration test conventions
- [API Layer Rules](./.ai/backend/api-layer-rules.md) — Fastify routes, schemas, middleware

### UI (`ui/`)
Guidelines defined in [.github/instructions/ui.instructions.md](./.github/instructions/ui.instructions.md).

## Usage Instructions

- **Always** review the documents listed above before implementing features or suggesting changes.
- Never mix backend and UI code — each folder is independently deployable.
- Check this file for any updates before starting work.
