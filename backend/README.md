# Backend - Modular Monolith

## 🚀 Quick Start

Run all commands from the `backend` directory.

### First-time setup

```powershell
make setup
```

### Start the application

```powershell
make serve
```

### Stop the environment

```powershell
make supabase-down
```

---

## 📋 Details

### What does `make setup` do?

Automatically configures the entire local environment:

1. **Installs dependencies** — `npm ci`
2. **Starts Supabase** — local Postgres + Auth + Studio in Docker
3. **Waits for the database** — healthcheck on port `54322`
4. **Creates schemas** — `core`, `products`, `identity`
5. **Runs Prisma migrations** — applies schema changes to the database
6. **Generates Prisma clients** — for all modules

Supabase runs in Docker and is available at:
- **Postgres**: `postgresql://postgres:postgres@127.0.0.1:54322/postgres`
- **Studio** (dashboard): http://127.0.0.1:54323
- **Auth API**: http://127.0.0.1:54321

### Available commands

| Command | Description |
|---------|-------------|
| `make setup` | Full setup from scratch |
| `make serve` | Start the application |
| `make supabase-up` | Start Supabase (without reinstalling) |
| `make supabase-down` | Stop Supabase |
| `make schemas` | Create database schemas |
| `make migrate` | Run Prisma migrations |
| `make generate` | Generate Prisma clients |
| `make test` | Run tests |
| `make build` | Build production artifacts |

### Creating Prisma migrations

When you change a model in `schema.prisma`, create a migration:

```powershell
make migration-create SCHEMA=core NAME=add_audit_columns
make migration-create SCHEMA=products NAME=add_sku_field
make migration-create SCHEMA=identity NAME=add_user_roles
```

### Troubleshooting

**Supabase won't start** → check that Docker Desktop is running  
**Port 54322 in use** → stop other Postgres instances  
**Migration error** → make sure `make schemas` has been run first  

---

## 🐳 Production Deploy (Docker)

### Environment variables

Create `iac/docker/.env` with your Supabase Cloud credentials:

```env
DATABASE_URL_CORE=postgresql://postgres.gqtspfhjwnzvpysjpkvf:YOUR_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&schema=core
DIRECT_URL_CORE=postgresql://postgres.gqtspfhjwnzvpysjpkvf:YOUR_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?schema=core
DATABASE_URL_PRODUCTS=postgresql://postgres.gqtspfhjwnzvpysjpkvf:YOUR_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&schema=products
DIRECT_URL_PRODUCTS=postgresql://postgres.gqtspfhjwnzvpysjpkvf:YOUR_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?schema=products
DATABASE_URL_IDENTITY=postgresql://postgres.gqtspfhjwnzvpysjpkvf:YOUR_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&schema=identity
DIRECT_URL_IDENTITY=postgresql://postgres.gqtspfhjwnzvpysjpkvf:YOUR_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?schema=identity
SUPABASE_URL=https://gqtspfhjwnzvpysjpkvf.supabase.co
SUPABASE_PUBLISHABLE_KEY=<from-dashboard>
SUPABASE_SERVICE_ROLE_KEY=<from-dashboard>
LOG_LEVEL=info
```

**Port explanation:**
- **6543** — Supavisor connection pooler — for regular queries (`DATABASE_URL_*`)
- **5432** — direct connection — for migrations only (`DIRECT_URL_*`)

### Deploy

```powershell
# Build Docker image
make docker-build

# Start production environment
make prod-up

# Stop
make prod-down
```

Docker Compose automatically:
1. Creates schemas in Supabase Cloud
2. Runs Prisma migrations
3. Starts the application

See [iac/docker/docker-compose-prod.yml](iac/docker/docker-compose-prod.yml) for details.
