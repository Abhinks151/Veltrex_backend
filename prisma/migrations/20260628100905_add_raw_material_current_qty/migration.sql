/*
  Warnings:

  - You are about to drop the column `assigned_to` on the `jobs` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "jobs" DROP CONSTRAINT "jobs_assigned_to_fkey";

-- AlterTable
ALTER TABLE "jobs" DROP COLUMN "assigned_to";

-- AlterTable
ALTER TABLE "raw_materials" ADD COLUMN     "current_qty" INTEGER NOT NULL DEFAULT 0;
