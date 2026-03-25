CREATE TABLE "identity"."UserProfile" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastLoginAt" TIMESTAMP(3),
  CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "identity"."Role" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "identity"."Permission" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "identity"."RolePermission" (
  "roleId" TEXT NOT NULL,
  "permissionId" TEXT NOT NULL,
  CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleId", "permissionId")
);

CREATE TABLE "identity"."UserRole" (
  "userId" TEXT NOT NULL,
  "roleId" TEXT NOT NULL,
  CONSTRAINT "UserRole_pkey" PRIMARY KEY ("userId", "roleId")
);

CREATE UNIQUE INDEX "UserProfile_email_key" ON "identity"."UserProfile"("email");
CREATE UNIQUE INDEX "Role_name_key" ON "identity"."Role"("name");
CREATE UNIQUE INDEX "Permission_name_key" ON "identity"."Permission"("name");

ALTER TABLE "identity"."RolePermission"
  ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "identity"."Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "identity"."RolePermission"
  ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "identity"."Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "identity"."UserRole"
  ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "identity"."UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "identity"."UserRole"
  ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "identity"."Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
