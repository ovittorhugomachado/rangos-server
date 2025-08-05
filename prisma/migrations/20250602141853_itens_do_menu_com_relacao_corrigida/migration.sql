/*
  Warnings:

  - Added the required column `storeId` to the `menu_category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "menu_category" ADD COLUMN     "storeId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "menu_category" ADD CONSTRAINT "menu_category_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
