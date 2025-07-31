-- AlterTable
ALTER TABLE "stores" ADD COLUMN     "delivery" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "pickup" BOOLEAN NOT NULL DEFAULT false;
