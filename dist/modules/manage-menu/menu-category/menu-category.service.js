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
exports.serviceDeleteMenuCategory = exports.toggleMenuCategoryService = exports.menuCategoryRenameService = exports.createCategoryMenuService = exports.serviceGetMyMenuCategories = exports.serviceGetMenuCategories = void 0;
const prisma_1 = require("../../../lib/prisma");
const errors_1 = require("../../../utils/errors");
const serviceGetMenuCategories = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const store = yield prisma_1.prisma.store.findUnique({
        where: { userId },
        include: {
            MenuCategory: {
                orderBy: { id: 'asc' }
            }
        }
    });
    if (!store)
        throw new errors_1.NotFoundError('Loja não encontrada');
    return store.MenuCategory;
});
exports.serviceGetMenuCategories = serviceGetMenuCategories;
const serviceGetMyMenuCategories = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const store = yield prisma_1.prisma.store.findUnique({
        where: { userId },
        include: {
            MenuCategory: {
                orderBy: { id: 'asc' }
            }
        }
    });
    if (!store)
        throw new errors_1.NotFoundError('Loja não encontrada');
    return store.MenuCategory;
});
exports.serviceGetMyMenuCategories = serviceGetMyMenuCategories;
const createCategoryMenuService = (userId, name) => __awaiter(void 0, void 0, void 0, function* () {
    const store = yield prisma_1.prisma.store.findUnique({ where: { userId } });
    if (!store)
        throw new errors_1.NotFoundError('Loja não encontrada');
    const category = yield prisma_1.prisma.menuCategory.create({
        data: {
            name,
            store: {
                connect: { id: store === null || store === void 0 ? void 0 : store.id }
            },
        }
    });
    return category;
});
exports.createCategoryMenuService = createCategoryMenuService;
const menuCategoryRenameService = (userId, categoryId, newName) => __awaiter(void 0, void 0, void 0, function* () {
    const store = yield prisma_1.prisma.store.findUnique({ where: { userId } });
    if (!store)
        throw new errors_1.NotFoundError('Loja não encontrada');
    const category = yield prisma_1.prisma.menuCategory.findUnique({ where: { id: categoryId } });
    if (!category || category.storeId !== store.id) {
        throw new errors_1.NotFoundError('Categoria não encontrada');
    }
    ;
    return yield prisma_1.prisma.menuCategory.update({
        where: { id: categoryId },
        data: { name: newName }
    });
});
exports.menuCategoryRenameService = menuCategoryRenameService;
const toggleMenuCategoryService = (userId, categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const store = yield prisma_1.prisma.store.findUnique({ where: { userId } });
    if (!store)
        throw new errors_1.NotFoundError('Loja não encontrada');
    const category = yield prisma_1.prisma.menuCategory.findFirst({
        where: {
            id: categoryId,
            storeId: store.id
        }
    });
    if (!category) {
        throw new errors_1.NotFoundError('Categoria não encontrada');
    }
    ;
    return yield prisma_1.prisma.menuCategory.update({
        where: { id: categoryId },
        data: {
            isActive: !category.isActive
        }
    });
});
exports.toggleMenuCategoryService = toggleMenuCategoryService;
const serviceDeleteMenuCategory = (userId, categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const store = yield prisma_1.prisma.store.findUnique({ where: { userId } });
    if (!store)
        throw new errors_1.NotFoundError('Loja não encontrada');
    const category = yield prisma_1.prisma.menuCategory.findFirst({
        where: {
            id: categoryId,
            storeId: store.id
        }
    });
    if (!category)
        throw new errors_1.NotFoundError('Categoria não encontrada');
    yield prisma_1.prisma.menuCategory.delete({ where: { id: categoryId } });
    return { success: true, message: "Categoria deletada", deletedId: categoryId };
});
exports.serviceDeleteMenuCategory = serviceDeleteMenuCategory;
