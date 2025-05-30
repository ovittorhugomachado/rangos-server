/*
  Warnings:

  - The primary key for the `opening_hours` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `opening_hours` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "opening_hours" DROP CONSTRAINT "opening_hours_pkey",
DROP COLUMN "id",
ALTER COLUMN "open" SET DEFAULT 'closed',
ALTER COLUMN "close" SET DEFAULT 'closed',
ADD CONSTRAINT "opening_hours_pkey" PRIMARY KEY ("userId", "day");
