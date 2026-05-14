/*
  Warnings:

  - Changed the type of `userId` on the `password_reset_tokens` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "password_reset_tokens" DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL;
