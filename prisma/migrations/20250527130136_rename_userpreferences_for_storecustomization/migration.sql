/*
  Warnings:

  - You are about to drop the `user_preferences` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_preferences" DROP CONSTRAINT "user_preferences_userId_fkey";

-- DropTable
DROP TABLE "user_preferences";

-- CreateTable
CREATE TABLE "store_customizations" (
    "id" SERIAL NOT NULL,
    "primaryColor" TEXT NOT NULL,
    "backgroundColor" TEXT NOT NULL,
    "textColor" TEXT NOT NULL,
    "textButtonColor" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "bannerUrl" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "store_customizations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "store_customizations_userId_key" ON "store_customizations"("userId");

-- AddForeignKey
ALTER TABLE "store_customizations" ADD CONSTRAINT "store_customizations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
