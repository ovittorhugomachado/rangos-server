/*
  Warnings:

  - The `status` column on the `orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('aguardando_aprovacao', 'em_preparo', 'pronto_para_retirada', 'a_caminho', 'entregue', 'cancelado', 'cancelado_automaticamente');

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "status",
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'aguardando_aprovacao';

-- DropEnum
DROP TYPE "OrderStaus";
