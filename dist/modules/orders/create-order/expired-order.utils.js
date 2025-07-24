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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleOrderCancellation = scheduleOrderCancellation;
exports.restoreScheduledCancellations = restoreScheduledCancellations;
const node_cron_1 = __importDefault(require("node-cron"));
const prisma_1 = require("../../../lib/prisma");
const activeTimeouts = {};
function cancelOrderIfNotUpdated(orderId, expectedStatus) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const order = yield prisma_1.prisma.order.findUnique({ where: { id: orderId } });
            if (!order)
                return;
            const shouldCancel = Array.isArray(expectedStatus)
                ? expectedStatus.includes(order.status)
                : order.status === expectedStatus;
            if (shouldCancel) {
                yield prisma_1.prisma.order.update({
                    where: { id: orderId },
                    data: {
                        status: 'cancelado_automaticamente',
                        expectedStatus: 'cancelado_automaticamente'
                    }
                });
                console.log(`[AUTO-CANCEL] Pedido ${orderId} cancelado automaticamente.`);
            }
            delete activeTimeouts[orderId];
        }
        catch (error) {
            console.error(`[AUTO-CANCEL] Erro ao cancelar pedido ${orderId}:`, error);
        }
    });
}
function scheduleOrderCancellation(orderId, status) {
    return __awaiter(this, void 0, void 0, function* () {
        if (activeTimeouts[orderId]) {
            clearTimeout(activeTimeouts[orderId]);
            delete activeTimeouts[orderId];
        }
        const statusArray = Array.isArray(status) ? status : [status];
        let delay;
        let expectedStatus;
        if (statusArray.includes('aguardando_aprovacao')) {
            delay = 10 * 60 * 1000; // 10 minutos
            expectedStatus = 'aguardando_aprovacao';
        }
        else if (statusArray.some(s => ['em_preparo', 'pronto_para_retirada', 'a_caminho'].includes(s))) {
            delay = 24 * 60 * 60 * 1000; // 24 horas
            expectedStatus = ['em_preparo', 'pronto_para_retirada', 'a_caminho'];
        }
        else {
            return;
        }
        yield prisma_1.prisma.order.update({
            where: { id: orderId },
            data: {
                cancellationScheduledAt: new Date(Date.now() + delay),
                expectedStatus: Array.isArray(expectedStatus) ? expectedStatus.join(',') : expectedStatus
            }
        });
        activeTimeouts[orderId] = setTimeout(() => cancelOrderIfNotUpdated(orderId, expectedStatus), delay);
    });
}
function restoreScheduledCancellations() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const pendingOrders = yield prisma_1.prisma.order.findMany({
            where: {
                cancellationScheduledAt: { not: null },
                status: { not: 'cancelado_automaticamente' }
            }
        });
        for (const order of pendingOrders) {
            const remainingTime = order.cancellationScheduledAt.getTime() - Date.now();
            if (remainingTime > 0) {
                yield scheduleOrderCancellation(order.id, ((_a = order.expectedStatus) === null || _a === void 0 ? void 0 : _a.includes(','))
                    ? order.expectedStatus.split(',')
                    : order.expectedStatus);
            }
            else {
                yield cancelOrderIfNotUpdated(order.id, ((_b = order.expectedStatus) === null || _b === void 0 ? void 0 : _b.includes(','))
                    ? order.expectedStatus.split(',')
                    : order.expectedStatus);
            }
        }
    });
}
node_cron_1.default.schedule('*/10 * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    try {
        const waitingApprovalResult = yield prisma_1.prisma.order.updateMany({
            where: {
                status: 'aguardando_aprovacao',
                createdAt: { lt: new Date(now.getTime() - 15 * 60 * 1000) }
            },
            data: { status: 'cancelado_automaticamente' }
        });
        const inProgressResult = yield prisma_1.prisma.order.updateMany({
            where: {
                status: { in: ['em_preparo', 'pronto_para_retirada', 'a_caminho'] },
                createdAt: { lt: new Date(now.getTime() - 24 * 60 * 60 * 1000 - 10 * 60 * 1000) }
            },
            data: { status: 'cancelado_automaticamente' }
        });
        console.log(`[CRON-FALLBACK] Cancelados: ${waitingApprovalResult.count} (aguardando) + ${inProgressResult.count} (24h+)`);
    }
    catch (error) {
        console.error('[CRON-FALLBACK] Erro ao cancelar pedidos:', error);
    }
}));
process.on('SIGTERM', cleanup);
process.on('SIGINT', cleanup);
function cleanup() {
    Object.values(activeTimeouts).forEach(timeout => clearTimeout(timeout));
    prisma_1.prisma.$disconnect().catch(console.error);
    process.exit(0);
}
