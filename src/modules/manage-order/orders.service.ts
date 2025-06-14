import { prisma } from "../../lib/prisma";
import { NotFoundError, ValidationError } from "../../utils/errors";

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
};

export const orderCancellationService = async (userId: number, orderId: number) => {

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
            status: 'cancelado'
        }
    });
};

export const orderReadyService = async (userId: number, orderId: number) => {

    const store = await prisma.store.findUnique({ where: { userId } });
    if (!store) throw new NotFoundError('Loja não encontrada');

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundError('Pedido não encontrado');

    if (order.storeId !== store.id) {
        throw new NotFoundError("Pedido não pertence a esta loja");
    };

    if (order.deliveryType !== 'delivery' && order.deliveryType !== 'pickup') {
        throw new ValidationError("Tipo de entrega inválido. Use 'delivery' ou 'pickup'.");
    };

    const newStatus = order.deliveryType === 'delivery' 
    ? 'a_caminho' 
    : 'pronto_para_retirada';

    await prisma.order.update({
        where: { id: orderId },
        data: { status: newStatus }
    });
};

export const orderDeliveredService = async (userId: number, orderId: number) => {

    const store = await prisma.store.findUnique({ where: { userId } });
    if (!store) throw new NotFoundError('Loja não encontrada');

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundError('Pedido não encontrado');

    if (order.storeId !== store.id) {
        throw new NotFoundError("Pedido não pertence a esta loja");
    };

    await prisma.order.update({
        where: { id: orderId },
        data: { status: 'entregue' }
    });
};