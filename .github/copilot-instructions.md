# GitHub Copilot Instructions — node-js-template

Full-stack monorepo with a **Node.js backend** and a **React UI**, organized into two independent subfolders.

## Workspace Structure

| Folder | Stack | Instructions |
|--------|-------|--------------|
| `backend/` | Fastify · Nx · Prisma · MongoDB · Inversify · TypeScript | [backend.instructions.md](instructions/backend.instructions.md) |
| `ui/` | React 19 · Vite · MUI · Zustand · Axios · react-hook-form | [ui.instructions.md](instructions/ui.instructions.md) |

## Routing of Context-Specific Instructions

Copilot automatically loads the instructions file that matches the file being edited:
- Editing any file under `backend/` → [backend.instructions.md](instructions/backend.instructions.md) is active
- Editing any file under `ui/` → [ui.instructions.md](instructions/ui.instructions.md) is active

## Detailed Rule Documents

All detailed guidelines live in `.ai/`:

**Backend** (`.ai/backend/`):
- [repository.md](../.ai/backend/repository.md) — architecture overview, start here
- [nx-rules.md](../.ai/backend/nx-rules.md) — Nx workspace conventions
- [system-design-rules.md](../.ai/backend/system-design-rules.md) — CQRS, service bus, Result pattern
- [module-design-rule.md](../.ai/backend/module-design-rule.md) — application/domain/infrastructure layers
- [testing-rules.md](../.ai/backend/testing-rules.md) — testing conventions
- [api-layer-rules.md](../.ai/backend/api-layer-rules.md) — Fastify routes and schemas

**UI** (`.ai/ui/`): *(populated as UI is built)*

## General Rules (apply everywhere)
- Follow existing conventions in the file you are editing
- Never mix backend and UI code — each folder is independently deployable
- Prefer small, focused changes over large refactors
