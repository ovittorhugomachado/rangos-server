/*
  Warnings:

  - The primary key for the `opening_hours` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `opening_hours` table. All the data in the column will be lost.
  - You are about to drop the column `accountStatus` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `plan` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `store_customizations` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `storeId` to the `opening_hours` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "opening_hours" DROP CONSTRAINT "opening_hours_userId_fkey";

-- DropForeignKey
ALTER TABLE "store_customizations" DROP CONSTRAINT "store_customizations_userId_fkey";

-- AlterTable
ALTER TABLE "opening_hours" DROP CONSTRAINT "opening_hours_pkey",
DROP COLUMN "userId",
ADD COLUMN     "storeId" INTEGER NOT NULL,
ADD CONSTRAINT "opening_hours_pkey" PRIMARY KEY ("storeId", "day");

-- AlterTable
ALTER TABLE "users" DROP COLUMN "accountStatus",
DROP COLUMN "plan";

-- DropTable
DROP TABLE "store_customizations";

-- DropEnum
DROP TYPE "AccountStatus";

-- DropEnum
DROP TYPE "PlanType";

-- CreateTable
CREATE TABLE "stores" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "logoUrl" TEXT,
    "bannerUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_styles" (
    "id" SERIAL NOT NULL,
    "primaryColor" TEXT NOT NULL DEFAULT '#4F46E5',
    "backgroundColor" TEXT NOT NULL DEFAULT '#FFFFFF',
    "textColor" TEXT NOT NULL DEFAULT '#1F2937',
    "textButtonColor" TEXT NOT NULL DEFAULT '#FFFFFF',
    "storeId" INTEGER NOT NULL,

    CONSTRAINT "store_styles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stores_userId_key" ON "stores"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "store_styles_storeId_key" ON "store_styles"("storeId");

-- AddForeignKey
ALTER TABLE "stores" ADD CONSTRAINT "stores_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_styles" ADD CONSTRAINT "store_styles_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opening_hours" ADD CONSTRAINT "opening_hours_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
