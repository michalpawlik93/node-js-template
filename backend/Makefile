SHELL := powershell.exe
.SHELLFLAGS := -NoProfile -ExecutionPolicy Bypass -Command
.DEFAULT_GOAL := help

COMPOSE_PROD := docker compose --env-file iac/docker/.env -f iac/docker/docker-compose-prod.yml
APP_IMAGE ?= modular-monolith-app-console:latest
APP_API_IMAGE ?= modular-monolith-app-api:latest

POSTGRES_USER ?= postgres
POSTGRES_PASSWORD ?= postgres
POSTGRES_DB ?= postgres
POSTGRES_HOST ?= 127.0.0.1
POSTGRES_PORT ?= 54322

CORE_SCHEMA := libs/core/src/providers/prisma/schema.prisma
PRODUCTS_SCHEMA := libs/products/src/infrastructure/prisma/schema.prisma
IDENTITY_SCHEMA := libs/identity/src/infrastructure/prisma/schema.prisma
CORE_DB_URL := postgresql://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@$(POSTGRES_HOST):$(POSTGRES_PORT)/$(POSTGRES_DB)?schema=core
CORE_DIRECT_URL := postgresql://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@$(POSTGRES_HOST):$(POSTGRES_PORT)/$(POSTGRES_DB)?schema=core
PRODUCTS_DB_URL := postgresql://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@$(POSTGRES_HOST):$(POSTGRES_PORT)/$(POSTGRES_DB)?schema=products
PRODUCTS_DIRECT_URL := postgresql://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@$(POSTGRES_HOST):$(POSTGRES_PORT)/$(POSTGRES_DB)?schema=products
IDENTITY_DB_URL := postgresql://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@$(POSTGRES_HOST):$(POSTGRES_PORT)/$(POSTGRES_DB)?schema=identity
IDENTITY_DIRECT_URL := postgresql://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@$(POSTGRES_HOST):$(POSTGRES_PORT)/$(POSTGRES_DB)?schema=identity

.PHONY: help install setup supabase-up supabase-down wait schemas migrate generate migration-create serve serve-api test build docker-build docker-build-api prod-up prod-down

help:
	Write-Host 'Available targets:' -ForegroundColor Cyan; Write-Host '  make setup                              Full local setup from scratch'; Write-Host '  make supabase-up / make supabase-down  Start or stop local supabase stack'; Write-Host '  make wait                              Wait for Supabase Postgres on port 54322'; Write-Host '  make schemas                           Create prisma schemas in Supabase Postgres'; Write-Host '  make migrate                           Apply prisma migrations for core, products, and identity'; Write-Host '  make generate                          Generate prisma clients for core, products, and identity'; Write-Host '  make migration-create SCHEMA=... NAME=...  Create a new prisma migration'; Write-Host '  make serve                             Run nx serve app-console'; Write-Host '  make serve-api                         Run nx serve app-api'; Write-Host '  make test                              Run workspace tests'; Write-Host '  make build                             Build production artifacts (app-console and app-api)'; Write-Host '  make docker-build                      Build the app-console production docker image'; Write-Host '  make docker-build-api                  Build the app-api production docker image'; Write-Host '  make prod-up / make prod-down          Start or stop production docker compose (includes app-api)'

install:
	npm ci

setup: install supabase-up wait schemas migrate generate

supabase-up:
	npx supabase start

supabase-down:
	npx supabase stop

wait:
	powershell -NoProfile -ExecutionPolicy Bypass -File iac/scripts/wait-for-postgres.ps1 -HostName $(POSTGRES_HOST) -Port $(POSTGRES_PORT)

schemas:
	docker exec supabase_db_backend psql -U $(POSTGRES_USER) -d $(POSTGRES_DB) -c 'CREATE SCHEMA IF NOT EXISTS "core";'
	docker exec supabase_db_backend psql -U $(POSTGRES_USER) -d $(POSTGRES_DB) -c 'CREATE SCHEMA IF NOT EXISTS "products";'
	docker exec supabase_db_backend psql -U $(POSTGRES_USER) -d $(POSTGRES_DB) -c 'CREATE SCHEMA IF NOT EXISTS "identity";'

migrate:
	$$env:DATABASE_URL_CORE = '$(CORE_DB_URL)'; $$env:DIRECT_URL_CORE = '$(CORE_DIRECT_URL)'; npx prisma migrate deploy --schema $(CORE_SCHEMA); if ($$LASTEXITCODE -ne 0) { throw 'Core prisma migrate deploy failed.' }
	$$env:DATABASE_URL_PRODUCTS = '$(PRODUCTS_DB_URL)'; $$env:DIRECT_URL_PRODUCTS = '$(PRODUCTS_DIRECT_URL)'; npx prisma migrate deploy --schema $(PRODUCTS_SCHEMA); if ($$LASTEXITCODE -ne 0) { throw 'Products prisma migrate deploy failed.' }
	$$env:DATABASE_URL_IDENTITY = '$(IDENTITY_DB_URL)'; $$env:DIRECT_URL_IDENTITY = '$(IDENTITY_DIRECT_URL)'; npx prisma migrate deploy --schema $(IDENTITY_SCHEMA); if ($$LASTEXITCODE -ne 0) { throw 'Identity prisma migrate deploy failed.' }

generate:
	$$env:DATABASE_URL_CORE = '$(CORE_DB_URL)'; $$env:DIRECT_URL_CORE = '$(CORE_DIRECT_URL)'; npx prisma generate --schema $(CORE_SCHEMA); if ($$LASTEXITCODE -ne 0) { throw 'Core prisma generate failed.' }
	$$env:DATABASE_URL_PRODUCTS = '$(PRODUCTS_DB_URL)'; $$env:DIRECT_URL_PRODUCTS = '$(PRODUCTS_DIRECT_URL)'; npx prisma generate --schema $(PRODUCTS_SCHEMA); if ($$LASTEXITCODE -ne 0) { throw 'Products prisma generate failed.' }
	$$env:DATABASE_URL_IDENTITY = '$(IDENTITY_DB_URL)'; $$env:DIRECT_URL_IDENTITY = '$(IDENTITY_DIRECT_URL)'; npx prisma generate --schema $(IDENTITY_SCHEMA); if ($$LASTEXITCODE -ne 0) { throw 'Identity prisma generate failed.' }

migration-create:
	powershell -NoProfile -ExecutionPolicy Bypass -File iac/scripts/migration-create.ps1 -Schema '$(SCHEMA)' -Name '$(NAME)' -CoreSchema '$(CORE_SCHEMA)' -ProductsSchema '$(PRODUCTS_SCHEMA)' -IdentitySchema '$(IDENTITY_SCHEMA)' -CoreDbUrl '$(CORE_DB_URL)' -CoreDirectUrl '$(CORE_DIRECT_URL)' -ProductsDbUrl '$(PRODUCTS_DB_URL)' -ProductsDirectUrl '$(PRODUCTS_DIRECT_URL)' -IdentityDbUrl '$(IDENTITY_DB_URL)' -IdentityDirectUrl '$(IDENTITY_DIRECT_URL)'

serve:
	npx nx serve app-console

serve-api:
	npx nx serve app-api

test:
	npm test

build:
	npx nx run-many --target=build --projects=core,products,integration-contracts,identity,app-console,app-api

docker-build:
	docker build --target runtime -t $(APP_IMAGE) .

docker-build-api:
	docker build --target runtime-api -t $(APP_API_IMAGE) .

prod-up:
	$(COMPOSE_PROD) up -d --build

prod-down:
	$(COMPOSE_PROD) down
