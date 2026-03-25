param(
  [Parameter(Mandatory)][string]$Schema,
  [Parameter(Mandatory)][string]$Name,
  [string]$CoreSchema = 'libs/core/src/providers/prisma/schema.prisma',
  [string]$ProductsSchema = 'libs/products/src/infrastructure/prisma/schema.prisma',
  [string]$IdentitySchema = 'libs/identity/src/infrastructure/prisma/schema.prisma',
  [string]$CoreDbUrl = '',
  [string]$CoreDirectUrl = '',
  [string]$ProductsDbUrl = '',
  [string]$ProductsDirectUrl = '',
  [string]$IdentityDbUrl = '',
  [string]$IdentityDirectUrl = ''
)

$ErrorActionPreference = 'Stop'

switch ($Schema) {
  'core' {
    $schemaPath = $CoreSchema
    $env:DATABASE_URL_CORE = $CoreDbUrl
    $env:DIRECT_URL_CORE = $CoreDirectUrl
  }
  'products' {
    $schemaPath = $ProductsSchema
    $env:DATABASE_URL_PRODUCTS = $ProductsDbUrl
    $env:DIRECT_URL_PRODUCTS = $ProductsDirectUrl
  }
  'identity' {
    $schemaPath = $IdentitySchema
    $env:DATABASE_URL_IDENTITY = $IdentityDbUrl
    $env:DIRECT_URL_IDENTITY = $IdentityDirectUrl
  }
  default {
    throw "SCHEMA must be either core, products, or identity. Got: $Schema"
  }
}

npx prisma migrate dev --create-only --skip-generate --name $Name --schema $schemaPath
if ($LASTEXITCODE -ne 0) { throw 'Prisma migration creation failed.' }
