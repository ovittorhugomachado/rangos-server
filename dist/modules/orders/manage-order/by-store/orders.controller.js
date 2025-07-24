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
exports.orderDelivered = exports.orderReady = exports.cancelOrder = exports.acceptOrder = exports.listDetailsOrder = exports.listOrders = void 0;
const errors_1 = require("../../../../utils/errors");
const client_1 = require("@prisma/client");
const orders_service_1 = require("./orders.service");
const listOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { startDate, endDate, status, limit = '300', offset = '0' } = req.query;
        const userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
        if (!userId) {
            res.status(401).json({ message: 'Erro na validação do usuário' });
            return;
        }
        ;
        const parseDate = (dateStr) => {
            if (!dateStr)
                return undefined;
            const date = new Date(dateStr);
            return isNaN(date.getTime()) ? undefined : date;
        };
        const parsedParams = {
            startDate: parseDate(startDate),
            endDate: parseDate(endDate),
            status: (status && Object.values(client_1.OrderStatus).includes(status))
                ? status
                : undefined,
            limit: parseInt(limit),
            offset: parseInt(offset),
            storeId: userId
        };
        const { data, total } = yield (0, orders_service_1.listOrdersService)(parsedParams);
        res.status(200).json({ success: true, data, total });
    }
    catch (error) {
        (0, errors_1.handleControllerError)(res, error);
    }
});
exports.listOrders = listOrders;
const listDetailsOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
        if (!userId) {
            res.status(401).json({ message: 'Erro na validação do usuário' });
            return;
        }
        ;
        const orderId = Number(req.params.orderId);
        if (isNaN(orderId)) {
            res.status(400).json({ message: 'ID do pedido inválido' });
            return;
        }
        ;
        const order = yield (0, orders_service_1.orderDetailingService)(userId, orderId);
        res.status(200).json({ success: 'true', order });
    }
    catch (error) {
        (0, errors_1.handleControllerError)(res, error);
    }
});
exports.listDetailsOrder = listDetailsOrder;
const acceptOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
        if (!userId) {
            res.status(401).json({ message: 'Erro na validação do usuário' });
            return;
        }
        ;
        const orderId = Number(req.params.orderId);
        if (isNaN(orderId)) {
            res.status(400).json({ message: 'ID do pedido inválido' });
            return;
        }
        ;
        yield (0, orders_service_1.orderAcceptanceService)(userId, orderId);
        res.status(200).json({ message: 'Pedido aceito com sucesso' });
    }
    catch (error) {
        (0, errors_1.handleControllerError)(res, error);
    }
});
exports.acceptOrder = acceptOrder;
const cancelOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
        if (!userId) {
            res.status(401).json({ message: 'Erro na validação do usuário' });
            return;
        }
        ;
        const orderId = Number(req.params.orderId);
        if (isNaN(orderId)) {
            res.status(400).json({ message: 'ID do pedido inválido' });
            return;
        }
        ;
        yield (0, orders_service_1.orderCancellationService)(userId, orderId);
        res.status(200).json({ message: 'Pedido cancelado com sucesso' });
    }
    catch (error) {
        (0, errors_1.handleControllerError)(res, error);
    }
});
exports.cancelOrder = cancelOrder;
const orderReady = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
        if (!userId) {
            res.status(401).json({ message: 'Erro na validação do usuário' });
            return;
        }
        ;
        const orderId = Number(req.params.orderId);
        if (isNaN(orderId)) {
            res.status(400).json({ message: 'ID do pedido inválido' });
            return;
        }
        ;
        yield (0, orders_service_1.orderReadyService)(userId, orderId);
        res.status(200).json({ message: 'Pedido atualizado com sucesso' });
    }
    catch (error) {
        (0, errors_1.handleControllerError)(res, error);
    }
});
exports.orderReady = orderReady;
const orderDelivered = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
        if (!userId) {
            res.status(401).json({ message: 'Erro na validação do usuário' });
            return;
        }
        ;
        const orderId = Number(req.params.orderId);
        if (isNaN(orderId)) {
            res.status(400).json({ message: 'ID do pedido inválido' });
            return;
        }
        ;
        yield (0, orders_service_1.orderDeliveredService)(userId, orderId);
        res.status(200).json({ message: 'Pedido atualizado com sucesso' });
    }
    catch (error) {
        (0, errors_1.handleControllerError)(res, error);
    }
});
exports.orderDelivered = orderDelivered;
