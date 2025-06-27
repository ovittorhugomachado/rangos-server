/*
  Warnings:

  - The `backgroundColor` column on the `store_styles` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "backgroundColor" AS ENUM ('black', 'white');

-- AlterTable
ALTER TABLE "store_styles" DROP COLUMN "backgroundColor",
ADD COLUMN     "backgroundColor" "backgroundColor" NOT NULL DEFAULT 'white';
