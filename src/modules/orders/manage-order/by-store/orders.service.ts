import { prisma } from "../../../../lib/prisma";
import { ForbiddenError, NotFoundError, ValidationError } from "../../../../utils/errors";
import { OrderStatus } from "@prisma/client";

interface ListOrdersParams {
    startDate?: Date;
    endDate?: Date;
    status?: OrderStatus;
    limit?: number;
    offset?: number;
    storeId?: number;
}

export const listOrdersService = async ({
    startDate,
    endDate,
    status,
    limit,
    offset,
    storeId,
}: ListOrdersParams) => {

    let createdAtFilter: { gte?: Date; lte?: Date } | undefined;

    const adjustDateToEndOfDayUTC = (date: Date): Date => {
        const adjusted = new Date(date);
        adjusted.setUTCHours(23, 59, 59, 999);
        return adjusted;
    };

    if (startDate && !endDate) {
        createdAtFilter = {
            gte: startDate,
            lte: adjustDateToEndOfDayUTC(new Date()) 
        };
    } else if (!startDate && endDate) {
        createdAtFilter = {
            lte: adjustDateToEndOfDayUTC(endDate)
        };
    } else if (startDate && endDate) {
        createdAtFilter = {
            gte: startDate,
            lte: adjustDateToEndOfDayUTC(endDate)
        };
    }

    const where = {
        ...(createdAtFilter && { createdAt: createdAtFilter }),
        ...(status && { status: { equals: status } }),
        ...(storeId && { storeId: { equals: storeId } }), 
    };

    const [orders, total] = await Promise.all([
        prisma.order.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: offset,
            take: limit,
            include: { orderItems: true },
        }),
        prisma.order.count({ where }),
    ]);

    return { data: orders, total };
};

export const orderDetailingService = async (userId: number, orderId: number) => {

    const store = await prisma.store.findUnique({ where: { userId } });
    if (!store) throw new NotFoundError('Loja não encontrada');

    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { orderItems: true }
    });
    if (!order) throw new NotFoundError('Pedido não encontrado');

    if (order.storeId !== store.id) {
        throw new ForbiddenError("Pedido não pertence a esta loja");
    }

    return order
};

export const orderAcceptanceService = async (userId: number, orderId: number) => {

    const store = await prisma.store.findUnique({ where: { userId } });
    if (!store) throw new NotFoundError('Loja não encontrada');

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundError('Pedido não encontrado');

    if (order.storeId !== store.id) {
        throw new ForbiddenError("Pedido não pertence a esta loja");
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
        throw new ForbiddenError("Pedido não pertence a esta loja");
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
        throw new ForbiddenError("Pedido não pertence a esta loja");
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
        throw new ForbiddenError("Pedido não pertence a esta loja");
    };

    await prisma.order.update({
        where: { id: orderId },
        data: { status: 'entregue' }
    });
};