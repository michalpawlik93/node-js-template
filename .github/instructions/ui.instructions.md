---
applyTo: "ui/**"
---
# UI Development Guidelines

This frontend uses **React 19**, **Vite**, **TypeScript**, **MUI v7**, **Zustand**, **Axios**, **react-hook-form**, and **react-i18next**.

## Architecture — Feature-Based

Code is organized by feature, not by type:

```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── containers/     ← smart components (side effects, store, hooks)
│   │   │   ├── presentational/ ← pure components (props only, no store imports)
│   │   │   └── pages/          ← thin wrappers, just render the container
│   │   ├── services/           ← Axios calls (AuthService.ts)
│   │   ├── stores/             ← Zustand store (authStore.ts)
│   │   └── types/              ← TypeScript types for this feature
│   └── products/               ← same pattern
│       └── components/
│           ├── forms/          ← form wrappers (Paper + FormElements + buttons)
│           ├── containers/
│           ├── presentational/
│           └── pages/
├── shared/
│   ├── lib/
│   │   └── apiClient.ts        ← single Axios instance, auth interceptors
│   ├── components/
│   │   ├── presentational/     ← Button, Loader, FormInput, FormSelect, ErrorFallback
│   │   └── layout/             ← AppLayout, SidebarNav
│   └── types/                  ← ApiResponse<T>, Pager, PagedResult<T>
├── i18n/                       ← i18next config + locales (en, pl)
└── theme/                      ← MUI createTheme
```

## Key Rules

### Container vs Presentational
- **Containers**: import Zustand stores, call service actions, manage `useEffect`, use `react-hook-form` — pass data/handlers as props
- **Presentational**: receive props only — no `useStore`, no `useEffect`, no service imports — pure render
- **Pages**: `export const XPage = () => <XContainer />;` — nothing else

### HTTP Client
- **Never** use `fetch` directly — always use `shared/lib/apiClient.ts` (Axios instance)
- The Axios instance handles: Bearer token injection, 401 auto-refresh, error normalization
- Services only call `apiClient.post(...)` / `apiClient.get(...)` — no manual header management

### State Management
- One Zustand store per feature (`productsStore.ts`, `authStore.ts`, etc.)
- Store actions call services and update state — no business logic in components
- Auth state lives in Zustand store, **not** React Context

### Forms
- Always use `react-hook-form` with `Controller` + MUI components via `shared/components/presentational/FormInput` and `FormSelect`
- Form submission logic in Container, form field components in `presentational/` or `forms/`

### i18n
- All user-visible text must use `useTranslation()` — no hardcoded strings
- Keys go in `i18n/locales/en/translation.json` and `pl/translation.json`

### Backend API Contract
- Response envelope: `{ data: T, messages?: string[] }` — unwrap in services
- Paged responses: `{ data: T[], cursor?: string }` — use `shared/types/Pager.ts`
- Auth endpoints: `/auth/login`, `/auth/register`, `/auth/logout`, `/auth/refresh`, `/auth/me`
- Products endpoints: `POST /products`, `DELETE /products/:id`, `POST /products/search`
