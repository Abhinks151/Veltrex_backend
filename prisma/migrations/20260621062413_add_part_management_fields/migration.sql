-- CreateEnum
CREATE TYPE "OperationType" AS ENUM ('MILL', 'LATHE');

-- CreateEnum
CREATE TYPE "PartPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- AlterTable
ALTER TABLE "parts" ADD COLUMN     "cycle_time" TEXT,
ADD COLUMN     "dimensions" JSONB,
ADD COLUMN     "engineering_drawing_key" TEXT,
ADD COLUMN     "fixture_id" UUID,
ADD COLUMN     "is_blocked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "machine_id" UUID,
ADD COLUMN     "material" TEXT,
ADD COLUMN     "operation_type" "OperationType",
ADD COLUMN     "priority" "PartPriority" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "raw_material_id" UUID,
ADD COLUMN     "setup_sheet_key" TEXT,
ADD COLUMN     "setup_time" TEXT;

-- AddForeignKey
ALTER TABLE "parts" ADD CONSTRAINT "parts_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "machines"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parts" ADD CONSTRAINT "parts_fixture_id_fkey" FOREIGN KEY ("fixture_id") REFERENCES "fixtures"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parts" ADD CONSTRAINT "parts_raw_material_id_fkey" FOREIGN KEY ("raw_material_id") REFERENCES "raw_materials"("id") ON DELETE SET NULL ON UPDATE CASCADE;
