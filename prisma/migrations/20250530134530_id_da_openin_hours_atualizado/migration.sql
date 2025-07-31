/*
  Warnings:

  - You are about to drop the column `close` on the `opening_hours` table. All the data in the column will be lost.
  - You are about to drop the column `open` on the `opening_hours` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "opening_hours" DROP COLUMN "close",
DROP COLUMN "open",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'closed',
ADD COLUMN     "timeRanges" JSONB;
