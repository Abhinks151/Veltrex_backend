/*
  Warnings:

  - You are about to drop the column `machine_id` on the `production_shifts` table. All the data in the column will be lost.
  - You are about to drop the column `machine_id` on the `shift_templates` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[employee_id,date,shift_type]` on the table `production_shifts` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "production_shifts" DROP CONSTRAINT "production_shifts_machine_id_fkey";

-- DropForeignKey
ALTER TABLE "shift_templates" DROP CONSTRAINT "shift_templates_machine_id_fkey";

-- DropIndex
DROP INDEX "production_shifts_shift_template_id_date_key";

-- AlterTable
ALTER TABLE "production_shifts" DROP COLUMN "machine_id";

-- AlterTable
ALTER TABLE "shift_templates" DROP COLUMN "machine_id";

-- CreateIndex
CREATE UNIQUE INDEX "production_shifts_employee_id_date_shift_type_key" ON "production_shifts"("employee_id", "date", "shift_type");
