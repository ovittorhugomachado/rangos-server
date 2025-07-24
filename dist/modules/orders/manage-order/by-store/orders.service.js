"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderDeliveredService = exports.orderReadyService = exports.orderCancellationService = exports.orderAcceptanceService = exports.orderDetailingService = exports.listOrdersService = void 0;
const prisma_1 = require("../../../../lib/prisma");
const errors_1 = require("../../../../utils/errors");
const listOrdersService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ startDate, endDate, status, limit, offset, storeId, }) {
    let createdAtFilter;
    const adjustDateToEndOfDayUTC = (date) => {
        const adjusted = new Date(date);
        adjusted.setUTCHours(23, 59, 59, 999);
        return adjusted;
    };
    if (startDate && !endDate) {
        createdAtFilter = {
            gte: startDate,
            lte: adjustDateToEndOfDayUTC(new Date())
        };
    }
    else if (!startDate && endDate) {
        createdAtFilter = {
            lte: adjustDateToEndOfDayUTC(endDate)
        };
    }
    else if (startDate && endDate) {
        createdAtFilter = {
            gte: startDate,
            lte: adjustDateToEndOfDayUTC(endDate)
        };
    }
    const where = Object.assign(Object.assign(Object.assign({}, (createdAtFilter && { createdAt: createdAtFilter })), (status && { status: { equals: status } })), (storeId && { storeId: { equals: storeId } }));
    const [orders, total] = yield Promise.all([
        prisma_1.prisma.order.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: offset,
            take: limit,
            include: {
                orderItems: {
                    include: {
                        menuItem: { select: {
                                name: true,
                                price: true,
                            } }
                    }
                }
            },
        }),
        prisma_1.prisma.order.count({ where }),
    ]);
    return { data: orders, total };
});
exports.listOrdersService = listOrdersService;
const orderDetailingService = (userId, orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const store = yield prisma_1.prisma.store.findUnique({ where: { userId } });
    if (!store)
        throw new errors_1.NotFoundError('Loja não encontrada');
    const order = yield prisma_1.prisma.order.findUnique({
        where: { id: orderId },
        include: {
            orderItems: {
                include: {
                    menuItem: {
                        select: {
                            name: true,
                            price: true,
                        }
                    }
                }
            }
        }
    });
    if (!order)
        throw new errors_1.NotFoundError('Pedido não encontrado');
    if (order.storeId !== store.id) {
        throw new errors_1.ForbiddenError("Pedido não pertence a esta loja");
    }
    return order;
});
exports.orderDetailingService = orderDetailingService;
const orderAcceptanceService = (userId, orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const store = yield prisma_1.prisma.store.findUnique({ where: { userId } });
    if (!store)
        throw new errors_1.NotFoundError('Loja não encontrada');
    const order = yield prisma_1.prisma.order.findUnique({ where: { id: orderId } });
    if (!order)
        throw new errors_1.NotFoundError('Pedido não encontrado');
    if (order.storeId !== store.id) {
        throw new errors_1.ForbiddenError("Pedido não pertence a esta loja");
    }
    yield prisma_1.prisma.order.update({
        where: { id: orderId },
        data: {
            status: 'em_preparo'
        }
    });
});
exports.orderAcceptanceService = orderAcceptanceService;
const orderCancellationService = (userId, orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const store = yield prisma_1.prisma.store.findUnique({ where: { userId } });
    if (!store)
        throw new errors_1.NotFoundError('Loja não encontrada');
    const order = yield prisma_1.prisma.order.findUnique({ where: { id: orderId } });
    if (!order)
        throw new errors_1.NotFoundError('Pedido não encontrado');
    if (order.storeId !== store.id) {
        throw new errors_1.ForbiddenError("Pedido não pertence a esta loja");
    }
    yield prisma_1.prisma.order.update({
        where: { id: orderId },
        data: {
            status: 'cancelado'
        }
    });
});
exports.orderCancellationService = orderCancellationService;
const orderReadyService = (userId, orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const store = yield prisma_1.prisma.store.findUnique({ where: { userId } });
    if (!store)
        throw new errors_1.NotFoundError('Loja não encontrada');
    const order = yield prisma_1.prisma.order.findUnique({ where: { id: orderId } });
    if (!order)
        throw new errors_1.NotFoundError('Pedido não encontrado');
    if (order.storeId !== store.id) {
        throw new errors_1.ForbiddenError("Pedido não pertence a esta loja");
    }
    ;
    if (order.deliveryType !== 'delivery' && order.deliveryType !== 'pickup') {
        throw new errors_1.ValidationError("Tipo de entrega inválido. Use 'delivery' ou 'pickup'.");
    }
    ;
    const newStatus = order.deliveryType === 'delivery'
        ? 'a_caminho'
        : 'pronto_para_retirada';
    yield prisma_1.prisma.order.update({
        where: { id: orderId },
        data: { status: newStatus }
    });
});
exports.orderReadyService = orderReadyService;
const orderDeliveredService = (userId, orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const store = yield prisma_1.prisma.store.findUnique({ where: { userId } });
    if (!store)
        throw new errors_1.NotFoundError('Loja não encontrada');
    const order = yield prisma_1.prisma.order.findUnique({ where: { id: orderId } });
    if (!order)
        throw new errors_1.NotFoundError('Pedido não encontrado');
    if (order.storeId !== store.id) {
        throw new errors_1.ForbiddenError("Pedido não pertence a esta loja");
    }
    ;
    yield prisma_1.prisma.order.update({
        where: { id: orderId },
        data: { status: 'entregue' }
    });
});
exports.orderDeliveredService = orderDeliveredService;
