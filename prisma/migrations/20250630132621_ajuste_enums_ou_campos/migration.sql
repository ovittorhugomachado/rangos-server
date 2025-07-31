/*
  Warnings:

  - The `textButtonColor` column on the `store_styles` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `backgroundColor` column on the `store_styles` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "BackgroundColor" AS ENUM ('black', 'white');

-- CreateEnum
CREATE TYPE "TextButtonColor" AS ENUM ('black', 'white');

-- AlterTable
ALTER TABLE "store_styles" DROP COLUMN "textButtonColor",
ADD COLUMN     "textButtonColor" "TextButtonColor" NOT NULL DEFAULT 'black',
DROP COLUMN "backgroundColor",
ADD COLUMN     "backgroundColor" "BackgroundColor" NOT NULL DEFAULT 'white';

-- DropEnum
DROP TYPE "backgroundColor";
