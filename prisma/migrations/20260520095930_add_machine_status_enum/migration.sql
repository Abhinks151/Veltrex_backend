/*
  Warnings:

  - Changed the type of `status` on the `machines` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MachineStatus" AS ENUM ('IDLE', 'RUNNING', 'MAINTENANCE');

-- AlterTable
ALTER TABLE "machines" DROP COLUMN "status",
ADD COLUMN     "status" "MachineStatus" NOT NULL;
