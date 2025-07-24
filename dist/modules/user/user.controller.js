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
exports.deleteUser = exports.updateUserData = exports.getUserData = void 0;
const user_service_1 = require("./user.service");
const errors_1 = require("../../utils/errors");
const getUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
    try {
        const user = yield (0, user_service_1.serviceGetUserData)(userId);
        res.status(200).json(user);
        return;
    }
    catch (error) {
        (0, errors_1.handleControllerError)(res, error);
    }
});
exports.getUserData = getUserData;
const updateUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
        const updateData = req.body;
        const allowedFields = ['restaurantName', 'phoneNumber', 'email', 'cnpj', 'ownersName', 'cpf'];
        const isValidUpdate = Object.keys(updateData).every(key => allowedFields.includes(key));
        if (!isValidUpdate) {
            throw new errors_1.AppError('Dados inválidos');
        }
        yield (0, user_service_1.userDataUpdateService)(userId, updateData);
        res.status(200).json({ message: 'Dados atualizados com sucesso' });
        return;
    }
    catch (error) {
        (0, errors_1.handleControllerError)(res, error);
    }
});
exports.updateUserData = updateUserData;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
    try {
        yield (0, user_service_1.serviceDeleteUser)(userId);
        res.status(200).json({ message: 'Usuário deletado com sucesso' });
        return;
    }
    catch (error) {
        (0, errors_1.handleControllerError)(res, error);
    }
});
exports.deleteUser = deleteUser;
