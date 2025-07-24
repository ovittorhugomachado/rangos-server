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
exports.createOrder = void 0;
const client_1 = require("@prisma/client");
const order_service_1 = require("./order.service");
const errors_1 = require("../../../../utils/errors");
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.params.storeId);
        const { customerName, customerPhone, address, typeOfDelivery, paymentMethod, items } = req.body;
        if (!customerName || typeof customerName !== 'string' || customerName.trim() === '') {
            throw new errors_1.ValidationError('Insira o nome do cliente corretamente');
        }
        ;
        if (!customerPhone || typeof customerPhone !== 'string') {
            throw new errors_1.ValidationError('Insira o celular do cliente corretamente');
        }
        ;
        if (!typeOfDelivery ||
            !(Object.values(client_1.DeliveryType).includes(typeOfDelivery))) {
            throw new errors_1.ValidationError('Insira um tipo de entrega válido (delivery ou pickup)');
        }
        ;
        if (typeOfDelivery === 'delivery' && !address) {
            throw new errors_1.ValidationError('Quando o tipo de entrega é delivery, o endereço do cliente é obrigatório');
        }
        if (!paymentMethod || !(paymentMethod in client_1.PaymentMethod)) {
            throw new errors_1.ValidationError('Insira um método de pagamento válido (dinheiro, cartao ou pix)');
        }
        ;
        if (!items ||
            !Array.isArray(items) ||
            items.length === 0 ||
            items.some(item => !item ||
                typeof item.menuItemId !== 'number' ||
                (item.optionIds && (!Array.isArray(item.optionIds) ||
                    item.optionIds.some((id) => typeof id !== 'number'))))) {
            throw new errors_1.ValidationError('O campo "items" deve ser um array não vazio contendo objetos com menuItemId (número de item existente)');
        }
        ;
        const order = yield (0, order_service_1.createOrderService)({
            storeId: userId,
            customerName,
            customerPhone,
            address,
            typeOfDelivery,
            paymentMethod,
            items,
            userId
        });
        res.status(201).json({ message: 'Pedido criado com sucesso', data: order });
    }
    catch (error) {
        (0, errors_1.handleControllerError)(res, error);
    }
});
exports.createOrder = createOrder;
