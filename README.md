# Node.js Template

## Project Structure

The repository contains two independent subfolders:

- **`backend/`** — Nx monorepo with a Fastify API, Prisma, MongoDB, Inversify DI, and Supabase auth. See [backend/README.md](backend/README.md).
- **`ui/`** — React 19 + Vite frontend with MUI, Zustand, Axios, and react-hook-form.

## AI Guidelines

AI coding assistant instructions are maintained at the root level:

- **`.github/copilot-instructions.md`** — loaded automatically by GitHub Copilot in VS Code
- **`.github/instructions/backend.instructions.md`** — backend-specific rules, applied when editing files under `backend/`
- **`.github/instructions/ui.instructions.md`** — UI-specific rules, applied when editing files under `ui/`
- **`AGENTS.md`** — guidelines for GitHub Codex and other coding agents
- **`.ai/backend/`** — detailed backend architecture rules (linked from instructions above)
- **`.ai/ui/`** — detailed UI rules (populated as the UI grows)

## Quick Start

### Backend

```powershell
cd backend
make setup
make serve
```

### UI

```powershell
cd ui
npm install
npm run dev
```