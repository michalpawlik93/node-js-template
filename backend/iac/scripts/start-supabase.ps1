$ErrorActionPreference = 'Stop'

Write-Host 'Starting Supabase local stack...' -ForegroundColor Cyan
npx supabase start

if ($LASTEXITCODE -ne 0) {
  throw 'Supabase failed to start.'
}

Write-Host ''
Write-Host 'Supabase local defaults:' -ForegroundColor Green
Write-Host '  API URL: http://127.0.0.1:54321'
Write-Host '  DB URL:  postgresql://postgres:postgres@127.0.0.1:54322/postgres'
Write-Host '  Schemas used by app: core, products, identity (all on Supabase Postgres)'
Write-Host ''
Write-Host 'Copy keys printed above into apps/app-console/config/env.development:'
Write-Host '  SUPABASE_PUBLISHABLE_KEY'
Write-Host '  SUPABASE_SERVICE_ROLE_KEY'
