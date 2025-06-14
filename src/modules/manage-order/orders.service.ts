import { prisma } from "../../lib/prisma";
import { NotFoundError } from "../../utils/errors";

export const orderAcceptanceService = async (userId: number, orderId: number) => {

    const store = await prisma.store.findUnique({ where: { userId } });
    if (!store) throw new NotFoundError('Loja não encontrada');

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundError('Pedido não encontrado');

    if (order.storeId !== store.id) {
        throw new NotFoundError("Pedido não pertence a esta loja");
    }

    await prisma.order.update({
        where: { id: orderId },
        data: {
            status: 'em_preparo'
        }
    });
}