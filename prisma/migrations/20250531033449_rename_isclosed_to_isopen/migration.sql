/*
  Warnings:

  - You are about to drop the column `isClosed` on the `opening_hours` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "opening_hours" DROP COLUMN "isClosed",
ADD COLUMN     "isOpen" BOOLEAN NOT NULL DEFAULT false;
