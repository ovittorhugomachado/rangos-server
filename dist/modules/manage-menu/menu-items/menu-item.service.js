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
exports.deleteMenuItemService = exports.menuItemStatusToggleService = exports.menuItemUpdateService = exports.createMenuItemService = exports.getMenuItemsByCategoryService = void 0;
const prisma_1 = require("../../../lib/prisma");
const errors_1 = require("../../../utils/errors");
const getMenuItemsByCategoryService = (userId, categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const store = yield prisma_1.prisma.store.findUnique({
        where: { userId },
        include: {
            MenuCategory: {
                where: { id: categoryId },
                select: { id: true }
            }
        }
    });
    if (!store)
        throw new errors_1.NotFoundError('Loja não encontrada');
    if (!store.MenuCategory.some(c => c.id === categoryId)) {
        throw new errors_1.ForbiddenError('Categoria não pertence à loja');
    }
    return yield prisma_1.prisma.menuItem.findMany({
        where: { categoryId },
        include: {
            optionsGroups: {
                include: { options: true }
            }
        }
    });
});
exports.getMenuItemsByCategoryService = getMenuItemsByCategoryService;
const createMenuItemService = (userId, name, description, price, categoryId, optionGroups) => __awaiter(void 0, void 0, void 0, function* () {
    const store = yield prisma_1.prisma.store.findUnique({ where: { userId } });
    const category = yield prisma_1.prisma.menuCategory.findUnique({ where: { id: categoryId } });
    if (!store)
        throw new errors_1.NotFoundError('Loja não encontrada');
    if (!category || category.storeId !== store.id)
        throw new errors_1.NotFoundError('Categoria inválida');
    const menuItem = yield prisma_1.prisma.menuItem.create({
        data: {
            name,
            description,
            price,
            categoryId,
            optionsGroups: optionGroups ? {
                create: optionGroups.map(group => ({
                    title: group.title,
                    required: group.required,
                    options: {
                        create: group.options.map(option => ({
                            name: option.name,
                            additionalPrice: option.additionalPrice
                        }))
                    }
                }))
            } : undefined
        },
        include: {
            optionsGroups: {
                include: { options: true }
            }
        }
    });
    return menuItem;
});
exports.createMenuItemService = createMenuItemService;
const menuItemUpdateService = (userId, categoryId, itemId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const store = yield prisma_1.prisma.store.findUnique({
        where: { userId },
        include: {
            MenuCategory: {
                where: { id: categoryId },
                select: { id: true }
            }
        }
    });
    if (!store)
        throw new errors_1.NotFoundError('Loja não encontrada');
    if (categoryId && !store.MenuCategory.some(c => c.id === categoryId)) {
        throw new errors_1.ForbiddenError('Categoria não pertence à loja');
    }
    ;
    const existingItem = yield prisma_1.prisma.menuItem.findFirst({
        where: {
            id: itemId,
            menuCategory: {
                storeId: store.id
            }
        }
    });
    if (!existingItem) {
        throw new errors_1.NotFoundError('Item não encontrado ou não pertence à sua loja');
    }
    return yield prisma_1.prisma.menuItem.update({
        where: {
            id: itemId,
        },
        data: Object.assign({ name: updateData.name, description: updateData.description, price: updateData.price }, (categoryId && { categoryId: categoryId }))
    });
});
exports.menuItemUpdateService = menuItemUpdateService;
const menuItemStatusToggleService = (userId, itemId) => __awaiter(void 0, void 0, void 0, function* () {
    const store = yield prisma_1.prisma.store.findUnique({
        where: { userId },
        include: {
            MenuCategory: {
                select: { id: true },
            },
        },
    });
    if (!store)
        throw new errors_1.NotFoundError('Loja não encontrada');
    const item = yield prisma_1.prisma.menuItem.findUnique({ where: { id: itemId } });
    if (!item || !store.MenuCategory.some(c => c.id === item.categoryId)) {
        throw new errors_1.ForbiddenError("Item não encontrado ou não pertence à loja");
    }
    ;
    return yield prisma_1.prisma.menuItem.update({
        where: { id: itemId },
        data: {
            isAvailable: !item.isAvailable
        },
    });
});
exports.menuItemStatusToggleService = menuItemStatusToggleService;
const deleteMenuItemService = (userId, itemId) => __awaiter(void 0, void 0, void 0, function* () {
    const store = yield prisma_1.prisma.store.findUnique({
        where: { userId },
        include: {
            MenuCategory: {
                select: { id: true },
            },
        },
    });
    if (!store)
        throw new errors_1.NotFoundError('Loja não encontrada');
    const item = yield prisma_1.prisma.menuItem.findUnique({ where: { id: itemId } });
    if (!item || !store.MenuCategory.some(c => c.id === item.categoryId)) {
        throw new errors_1.ForbiddenError("Item não encontrado ou não pertence à loja");
    }
    ;
    return yield prisma_1.prisma.menuItem.delete({
        where: { id: itemId }
    });
});
exports.deleteMenuItemService = deleteMenuItemService;
