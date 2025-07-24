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
exports.serviceDeleteUser = exports.userDataUpdateService = exports.serviceGetUserData = void 0;
const prisma_1 = require("../../lib/prisma");
const errors_1 = require("../../utils/errors");
;
const serviceGetUserData = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            restaurantName: true,
            phoneNumber: true,
            email: true,
            cnpj: true,
            ownersName: true,
            cpf: true,
        }
    });
    if (!user) {
        throw new errors_1.NotFoundError('Usuário não encontrado');
    }
    return user;
});
exports.serviceGetUserData = serviceGetUserData;
const userDataUpdateService = (userId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId || isNaN(userId)) {
        throw new errors_1.NotFoundError('Usuário não encontrado');
    }
    ;
    if (Object.keys(updateData).length === 0) {
        throw new errors_1.AppError('Dados de atualização vazios');
    }
    ;
    const cleanData = {};
    for (const key in updateData) {
        const value = updateData[key];
        if (value !== null && value !== undefined) {
            cleanData[key] = value;
        }
    }
    ;
    return yield prisma_1.prisma.user.update({
        where: { id: userId },
        data: cleanData,
        select: {
            restaurantName: true,
            phoneNumber: true,
            email: true,
            cnpj: true,
            ownersName: true,
            cpf: true,
        }
    });
});
exports.userDataUpdateService = userDataUpdateService;
const serviceDeleteUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId || isNaN(userId)) {
        throw new errors_1.NotFoundError('Usuário não encontrado');
    }
    ;
    const user = yield prisma_1.prisma.user.delete({
        where: { id: userId },
    });
    if (!user) {
        throw new errors_1.NotFoundError('Usuário não encontrado');
    }
});
exports.serviceDeleteUser = serviceDeleteUser;
