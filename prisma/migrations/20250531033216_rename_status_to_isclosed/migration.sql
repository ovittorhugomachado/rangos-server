/*
  Warnings:

  - You are about to drop the column `status` on the `opening_hours` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "opening_hours" DROP COLUMN "status",
ADD COLUMN     "isClosed" BOOLEAN NOT NULL DEFAULT true;
