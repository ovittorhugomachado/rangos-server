/*
  Warnings:

  - The values [pronto_para_returada] on the enum `OrderStaus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderStaus_new" AS ENUM ('aguardando_aprovacao', 'em_preparo', 'pronto_para_retirada', 'a_caminho', 'entregue', 'cancelado', 'cancelado_automaticamente');
ALTER TABLE "orders" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "orders" ALTER COLUMN "status" TYPE "OrderStaus_new" USING ("status"::text::"OrderStaus_new");
ALTER TYPE "OrderStaus" RENAME TO "OrderStaus_old";
ALTER TYPE "OrderStaus_new" RENAME TO "OrderStaus";
DROP TYPE "OrderStaus_old";
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'aguardando_aprovacao';
COMMIT;
