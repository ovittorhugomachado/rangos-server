/*
  Warnings:

  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - Added the required column `cpf` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownersName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "name",
ADD COLUMN     "cnpj" TEXT,
ADD COLUMN     "cpf" TEXT NOT NULL,
ADD COLUMN     "ownersName" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL;
