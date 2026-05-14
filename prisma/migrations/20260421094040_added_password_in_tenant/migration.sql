/*
  Warnings:

  - Added the required column `password` to the `tenants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tenants" ADD COLUMN     "password" TEXT NOT NULL;
