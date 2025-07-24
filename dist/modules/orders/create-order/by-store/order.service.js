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
exports.createOrderService = void 0;
const client_1 = require("@prisma/client");
const errors_1 = require("../../../../utils/errors");
const prisma_1 = require("../../../../lib/prisma");
const expired_order_utils_1 = require("../expired-order.utils");
const createOrderService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { storeId, customerName, customerPhone, address, typeOfDelivery, paymentMethod, items } = data;
    const store = yield prisma_1.prisma.store.findUnique({ where: { id: storeId } });
    if (!store)
        throw new errors_1.NotFoundError('Loja não encontrada');
    const order = yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const menuItems = yield tx.menuItem.findMany({
            where: {
                id: { in: items.map(item => item.menuItemId) }
            }
        });
        const allOptionIds = items.flatMap(item => { var _a; return (_a = item.optionIds) !== null && _a !== void 0 ? _a : []; });
        const options = yield tx.menuItemOption.findMany({
            where: { id: { in: allOptionIds } }
        });
        const optionGroupIds = options.map(opt => opt.optionGroupId);
        const optionGroups = yield tx.menuItemOptionGroup.findMany({
            where: { id: { in: optionGroupIds } },
            select: { id: true, menuItemId: true }
        });
        const optionGroupMap = new Map(optionGroups.map(og => [og.id, og.menuItemId]));
        for (const item of items) {
            const itemOptions = options.filter(opt => { var _a; return (_a = item.optionIds) === null || _a === void 0 ? void 0 : _a.includes(opt.id); });
            for (const option of itemOptions) {
                const menuItemIdFromGroup = optionGroupMap.get(option.optionGroupId);
                if (!menuItemIdFromGroup || menuItemIdFromGroup !== item.menuItemId) {
                    throw new errors_1.ValidationError(`A opção ${option.name} não pertence ao item do menu ${item.menuItemId}`);
                }
            }
        }
        ;
        const total = items.reduce((sum, item) => {
            const menuItem = menuItems.find(mi => mi.id === item.menuItemId);
            if (!menuItem || !menuItem.price) {
                throw new errors_1.NotFoundError(`Item do menu não encontrado ou sem preço: ${item.menuItemId}`);
            }
            const itemOptions = options.filter(opt => { var _a; return (_a = item.optionIds) === null || _a === void 0 ? void 0 : _a.includes(opt.id); });
            const additionalTotal = itemOptions.reduce((optSum, opt) => { var _a, _b; return optSum + ((_b = (_a = opt.additionalPrice) === null || _a === void 0 ? void 0 : _a.toNumber()) !== null && _b !== void 0 ? _b : 0); }, 0);
            return sum + menuItem.price.toNumber() + additionalTotal;
        }, 0);
        const totalAmount = new client_1.Prisma.Decimal(total);
        return yield tx.order.create({
            data: {
                store: { connect: { id: storeId } },
                customerName,
                customerPhone,
                deliveryType: typeOfDelivery,
                paymentMethod,
                address,
                totalAmount,
                orderItems: {
                    create: items.map(item => ({
                        menuItem: { connect: { id: item.menuItemId } },
                        note: item.note || undefined,
                        options: {
                            create: (item.optionIds || []).map(optionId => ({
                                option: { connect: { id: optionId } }
                            }))
                        }
                    }))
                }
            },
            include: {
                orderItems: {
                    include: {
                        options: {
                            include: { option: true }
                        }
                    }
                }
            }
        });
    }));
    yield (0, expired_order_utils_1.scheduleOrderCancellation)(order.id, order.status);
    return order;
});
exports.createOrderService = createOrderService;
