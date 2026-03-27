---
applyTo: "backend/**"
---
# Backend Development Guidelines

This backend uses **Fastify v5**, **Nx monorepo**, **Prisma + MongoDB**, **Inversify DI**, **Supabase auth**, and **TypeScript**.

## Required Reading
Before implementing or modifying any backend code, read the following documents:

- [Repository Overview](../../.ai/backend/repository.md) — architecture, module structure, full index of rules
- [Nx Rules](../../.ai/backend/nx-rules.md) — workspace conventions, project boundaries, generators
- [System Design Rules](../../.ai/backend/system-design-rules.md) — architecture patterns, service bus, Result pattern
- [Module Design Rules](../../.ai/backend/module-design-rule.md) — application/domain/infrastructure layers, CQRS
- [Testing Rules](../../.ai/backend/testing-rules.md) — unit/integration test conventions
- [API Layer Rules](../../.ai/backend/api-layer-rules.md) — Fastify routes, schemas, middleware

## Key Patterns
- Dependency injection via **Inversify** — always use constructor injection with symbols
- **CQRS** — commands and queries via service bus, never call handlers directly
- **Result pattern** — no thrown errors in domain/application layers
- **Repository pattern** — infrastructure layer only, never in application
- Modules are self-contained — no cross-module imports except via facades from `integration-contracts`
