import cron from "node-cron";
import { prisma } from "../../lib/prisma";

const activeTimeouts: Record<string, NodeJS.Timeout> = {};

async function cancelOrderIfNotUpdated(orderId: number, expectedStatus: string | string[]) {
    try {
        const order = await prisma.order.findUnique({ where: { id: orderId } });

        if (!order) return;

        const shouldCancel = Array.isArray(expectedStatus)
            ? expectedStatus.includes(order.status)
            : order.status === expectedStatus;

        if (shouldCancel) {
            await prisma.order.update({
                where: { id: orderId },
                data: {
                    status: 'cancelado_automaticamente',
                    expectedStatus: 'cancelado_automaticamente'
                }
            });
            console.log(`[AUTO-CANCEL] Pedido ${orderId} cancelado automaticamente.`);
        }

        delete activeTimeouts[orderId];
    } catch (error) {
        console.error(`[AUTO-CANCEL] Erro ao cancelar pedido ${orderId}:`, error);
    }
}

export async function scheduleOrderCancellation(orderId: number, status: string | string[]) {

    if (activeTimeouts[orderId]) {
        clearTimeout(activeTimeouts[orderId]);
        delete activeTimeouts[orderId];
    }

    const statusArray = Array.isArray(status) ? status : [status];

    let delay: number;
    let expectedStatus: string | string[];

    if (statusArray.includes('aguardando_aprovacao')) {
        delay = 1 * 60 * 1000; // 10 minutos
        expectedStatus = 'aguardando_aprovacao';
    } else if (statusArray.some(s => ['em_preparo', 'pronto_para_retirada', 'a_caminho'].includes(s))) {
        delay = 24 * 60 * 60 * 1000; // 24 horas
        expectedStatus = ['em_preparo', 'pronto_para_retirada', 'a_caminho'];
    } else {
        return;
    }

    await prisma.order.update({
        where: { id: orderId },
        data: {
            cancellationScheduledAt: new Date(Date.now() + delay),
            expectedStatus: Array.isArray(expectedStatus) ? expectedStatus.join(',') : expectedStatus
        }
    });

    activeTimeouts[orderId] = setTimeout(
        () => cancelOrderIfNotUpdated(orderId, expectedStatus),
        delay
    );
}

export async function restoreScheduledCancellations() {
    const pendingOrders = await prisma.order.findMany({
        where: {
            cancellationScheduledAt: { not: null },
            status: { not: 'cancelado_automaticamente' }
        }
    });

    for (const order of pendingOrders) {
        const remainingTime = order.cancellationScheduledAt!.getTime() - Date.now();
        if (remainingTime > 0) {
            await scheduleOrderCancellation(
                order.id,
                order.expectedStatus?.includes(',')
                    ? order.expectedStatus.split(',')
                    : order.expectedStatus!
            );
        } else {
            await cancelOrderIfNotUpdated(
                order.id,
                order.expectedStatus?.includes(',')
                    ? order.expectedStatus.split(',')
                    : order.expectedStatus!
            );
        }
    }
}

cron.schedule('*/10 * * * *', async () => {
    const now = new Date();

    try {

        const waitingApprovalResult = await prisma.order.updateMany({
            where: {
                status: 'aguardando_aprovacao',
                createdAt: { lt: new Date(now.getTime() - 15 * 60 * 1000) }
            },
            data: { status: 'cancelado_automaticamente' }
        });

        const inProgressResult = await prisma.order.updateMany({
            where: {
                status: { in: ['em_preparo', 'pronto_para_retirada', 'a_caminho'] },
                createdAt: { lt: new Date(now.getTime() - 24 * 60 * 60 * 1000 - 10 * 60 * 1000) }
            },
            data: { status: 'cancelado_automaticamente' }
        });

        console.log(`[CRON-FALLBACK] Cancelados: ${waitingApprovalResult.count} (aguardando) + ${inProgressResult.count} (24h+)`);
    } catch (error) {
        console.error('[CRON-FALLBACK] Erro ao cancelar pedidos:', error);
    }
});

process.on('SIGTERM', cleanup);
process.on('SIGINT', cleanup);

function cleanup() {

    Object.values(activeTimeouts).forEach(timeout => clearTimeout(timeout));

    prisma.$disconnect().catch(console.error);
    process.exit(0);
}