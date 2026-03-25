# Backend - Modular Monolith

## 🚀 Quick Start

Wszystkie komendy uruchamiaj z katalogu `backend`.

### Pierwsze uruchomienie (setup)

```powershell
make setup
```

### Uruchomienie aplikacji

```powershell
make serve
```

### Zatrzymanie środowiska

```powershell
make supabase-down
```

---

## 📋 Szczegóły

### Co robi `make setup`?

Automatycznie konfiguruje całe środowisko lokalne:

1. **Instaluje zależności** - `npm ci`
2. **Uruchamia Supabase** - lokalna baza Postgres + Auth + Studio
3. **Czeka na bazę** - healthcheck na porcie `54322`
4. **Tworzy schematy** - `core`, `products`, `identity`
5. **Migracje Prisma** - aktualizuje strukturę bazy
6. **Generuje klienty** - Prisma Client dla wszystkich modułów

Supabase uruchamia się w Docker i jest dostępny pod:
- **Postgres**: `postgresql://postgres:postgres@127.0.0.1:54322/postgres`
- **Studio** (dashboard): http://127.0.0.1:54323
- **Auth API**: http://127.0.0.1:54321

### Dostępne komendy

| Komenda | Co robi |
|---------|---------|
| `make setup` | Pełna konfiguracja od zera |
| `make serve` | Uruchamia aplikację |
| `make supabase-up` | Uruchamia Supabase (bez reinstalacji) |
| `make supabase-down` | Zatrzymuje Supabase |
| `make schemas` | Tworzy schematy w bazie |
| `make migrate` | Uruchamia migracje Prisma |
| `make generate` | Generuje klienty Prisma |
| `make test` | Uruchamia testy |
| `make build` | Buduje produkcyjne artefakty |

### Tworzenie migracji Prisma

Gdy zmieniasz model w `schema.prisma`, utwórz migrację:

```powershell
make migration-create SCHEMA=core NAME=add_audit_columns
make migration-create SCHEMA=products NAME=add_sku_field
make migration-create SCHEMA=identity NAME=add_user_roles
```

### Troubleshooting

**Supabase nie startuje** → sprawdź czy Docker Desktop działa  
**Port 54322 zajęty** → zatrzymaj inne instancje Postgres  
**Błąd migracji** → sprawdź czy `make schemas` zostało wykonane  

---

## 🐳 Deploy Produkcyjny (Docker)

### Konfiguracja zmiennych środowiskowych

Utwórz plik `iac/docker/.env` z wartościami Supabase Cloud:

```env
DATABASE_URL_CORE=postgresql://postgres.gqtspfhjwnzvpysjpkvf:YOUR_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&schema=core
DIRECT_URL_CORE=postgresql://postgres.gqtspfhjwnzvpysjpkvf:YOUR_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?schema=core
DATABASE_URL_PRODUCTS=postgresql://postgres.gqtspfhjwnzvpysjpkvf:YOUR_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&schema=products
DIRECT_URL_PRODUCTS=postgresql://postgres.gqtspfhjwnzvpysjpkvf:YOUR_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?schema=products
DATABASE_URL_IDENTITY=postgresql://postgres.gqtspfhjwnzvpysjpkvf:YOUR_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&schema=identity
DIRECT_URL_IDENTITY=postgresql://postgres.gqtspfhjwnzvpysjpkvf:YOUR_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?schema=identity
SUPABASE_URL=https://gqtspfhjwnzvpysjpkvf.supabase.co
SUPABASE_PUBLISHABLE_KEY=<z-dashboard>
SUPABASE_SERVICE_ROLE_KEY=<z-dashboard>
LOG_LEVEL=info
```

**Wyjaśnienie portów:**
- **6543** - connection pooler (Supavisor) - do normalnych zapytań (`DATABASE_URL_*`)
- **5432** - direct connection - do migracji (`DIRECT_URL_*`)

### Deploy

```powershell
# Build obrazu Docker
make docker-build

# Start środowiska produkcyjnego
make prod-up

# Stop
make prod-down
```

Docker Compose automatycznie:
1. Utworzy schematy w Supabase Cloud
2. Uruchomi migracje Prisma
3. Wystartuje aplikację

Więcej w [iac/docker/docker-compose-prod.yml](iac/docker/docker-compose-prod.yml).
