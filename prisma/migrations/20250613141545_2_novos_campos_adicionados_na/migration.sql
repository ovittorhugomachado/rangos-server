-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "cancellationScheduledAt" TIMESTAMP(3),
ADD COLUMN     "expectedStatus" TEXT;
