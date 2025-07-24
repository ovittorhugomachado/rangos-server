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
exports.myStoreStyleDataUpdateService = exports.serviceGetMyStoreStyleData = exports.myStoreDataUpdateService = exports.serviceGetMyStoreData = exports.serviceGetStoreStyleData = exports.serviceGetStoreData = exports.serviceGetStoresList = void 0;
const prisma_1 = require("../../lib/prisma");
const errors_1 = require("../../utils/errors");
;
;
;
//Services do lado do cliente
const serviceGetStoresList = () => __awaiter(void 0, void 0, void 0, function* () {
    const stores = yield prisma_1.prisma.store.findMany();
    return stores;
});
exports.serviceGetStoresList = serviceGetStoresList;
const serviceGetStoreData = (storeId) => __awaiter(void 0, void 0, void 0, function* () {
    const store = yield prisma_1.prisma.store.findUnique({
        where: { id: storeId },
        select: {
            id: true,
            restaurantName: true,
            phoneNumber: true,
            address: true,
            logoUrl: true,
            bannerUrl: true,
            delivery: true,
            pickup: true,
            openingHours: true,
        }
    });
    if (!store) {
        throw new errors_1.NotFoundError("Loja não encontrada");
    }
    return store;
});
exports.serviceGetStoreData = serviceGetStoreData;
const serviceGetStoreStyleData = (storeId) => __awaiter(void 0, void 0, void 0, function* () {
    const storeStyle = yield prisma_1.prisma.storeStyle.findUnique({
        where: { id: storeId },
        select: {
            primaryColor: true,
            backgroundColor: true,
            textButtonColor: true,
        }
    });
    if (!storeStyle) {
        throw new errors_1.NotFoundError("Loja não encontrada");
    }
    return storeStyle;
});
exports.serviceGetStoreStyleData = serviceGetStoreStyleData;
//Services do lado da loja
const serviceGetMyStoreData = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const store = yield prisma_1.prisma.store.findUnique({
        where: { userId },
        select: {
            id: true,
            restaurantName: true,
            phoneNumber: true,
            address: true,
            logoUrl: true,
            bannerUrl: true,
            delivery: true,
            pickup: true,
            openingHours: true,
        }
    });
    if (!store) {
        throw new errors_1.NotFoundError("Loja não encontrada");
    }
    return store;
});
exports.serviceGetMyStoreData = serviceGetMyStoreData;
const myStoreDataUpdateService = (userId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId || isNaN(userId)) {
        throw new errors_1.NotFoundError('Usuário não encontrado');
    }
    ;
    if (Object.keys(updateData).length === 0) {
        throw new errors_1.AppError('Dados de atualização vazios');
    }
    ;
    const updatedStore = yield prisma_1.prisma.store.update({
        where: { userId },
        data: updateData,
        select: {
            restaurantName: true,
            phoneNumber: true,
            address: true,
            delivery: true,
            pickup: true,
        }
    });
    const userUpdateData = {};
    if (updateData.restaurantName !== undefined && updateData.restaurantName !== null) {
        userUpdateData.restaurantName = updateData.restaurantName;
    }
    if (updateData.phoneNumber !== undefined && updateData.phoneNumber !== null) {
        userUpdateData.phoneNumber = updateData.phoneNumber;
    }
    if (Object.keys(userUpdateData).length > 0) {
        yield prisma_1.prisma.user.update({
            where: { id: userId },
            data: userUpdateData,
            select: {
                restaurantName: true,
                phoneNumber: true,
            }
        });
    }
    ;
    return updatedStore;
});
exports.myStoreDataUpdateService = myStoreDataUpdateService;
const serviceGetMyStoreStyleData = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const storeStyle = yield prisma_1.prisma.storeStyle.findUnique({
        where: { id: userId },
        select: {
            primaryColor: true,
            backgroundColor: true,
            textButtonColor: true,
        }
    });
    if (!storeStyle) {
        throw new errors_1.NotFoundError("Loja não encontrada");
    }
    return storeStyle;
});
exports.serviceGetMyStoreStyleData = serviceGetMyStoreStyleData;
const myStoreStyleDataUpdateService = (userId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId || isNaN(userId)) {
        throw new errors_1.NotFoundError('Usuário não encontrado');
    }
    ;
    if (Object.keys(updateData).length === 0) {
        throw new errors_1.AppError('Dados de atualização vazios');
    }
    ;
    const prismaUpdateData = Object.assign(Object.assign(Object.assign({}, (updateData.primaryColor !== undefined && { primaryColor: { set: updateData.primaryColor } })), (updateData.backgroundColor !== undefined && { backgroundColor: { set: updateData.backgroundColor } })), (updateData.textButtonColor !== undefined && { textButtonColor: { set: updateData.textButtonColor } }));
    return yield prisma_1.prisma.storeStyle.update({
        where: { id: userId },
        data: prismaUpdateData,
        select: {
            primaryColor: true,
            backgroundColor: true,
            textButtonColor: true,
        }
    });
});
exports.myStoreStyleDataUpdateService = myStoreStyleDataUpdateService;
