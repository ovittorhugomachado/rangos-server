-- CreateEnum
CREATE TYPE "OrderStaus" AS ENUM ('aguardando_aprovacao', 'em_preparo', 'pronto_para_returada', 'a_caminho', 'entregue', 'cancelado');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "status" "OrderStaus" NOT NULL DEFAULT 'aguardando_aprovacao';
