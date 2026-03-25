param(
  [string]$HostName = '127.0.0.1',
  [int]$Port = 54322,
  [int]$MaxAttempts = 30
)

$ErrorActionPreference = 'Stop'

for ($attempt = 1; $attempt -le $MaxAttempts; $attempt++) {
  $connection = Test-NetConnection -ComputerName $HostName -Port $Port -WarningAction SilentlyContinue
  if ($connection.TcpTestSucceeded) {
    Write-Host 'Supabase Postgres is reachable.' -ForegroundColor Green
    exit 0
  }
  Write-Host "Waiting for Supabase Postgres ($attempt/$MaxAttempts)..."
  Start-Sleep -Seconds 2
}

throw 'Supabase Postgres did not become reachable in time.'
