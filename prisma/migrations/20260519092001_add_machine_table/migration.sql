-- CreateEnum
CREATE TYPE "MachineType" AS ENUM ('MILL', 'LATHE');

-- CreateTable
CREATE TABLE "machines" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "max_rpm" INTEGER NOT NULL,
    "axis" INTEGER NOT NULL,
    "type" "MachineType" NOT NULL,
    "max_travel_speed" INTEGER NOT NULL,
    "holding_size" INTEGER NOT NULL,
    "tool_count" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "is_blocked" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "machines_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "machines" ADD CONSTRAINT "machines_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
