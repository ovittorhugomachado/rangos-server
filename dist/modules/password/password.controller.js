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
exports.resetPassword = exports.validateToken = exports.requestPasswordReset = void 0;
const errors_1 = require("../../utils/errors");
const prisma_1 = require("../../lib/prisma");
const password_service_1 = require("./password.service");
const requestPasswordReset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const restaurant = yield prisma_1.prisma.user.findFirst({
            where: { email },
            select: { restaurantName: true }
        });
        const { token } = yield (0, password_service_1.generateResetTokenService)(email);
        yield (0, password_service_1.passwordResetEmailService)(email, token, restaurant === null || restaurant === void 0 ? void 0 : restaurant.restaurantName);
        res.status(200).json({ message: 'Um link de redefinição de senha foi enviado para seu email' });
        return;
    }
    catch (error) {
        (0, errors_1.handleControllerError)(res, error);
    }
});
exports.requestPasswordReset = requestPasswordReset;
const validateToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    try {
        yield (0, password_service_1.validateTokenService)(token);
        res.status(200).json({ message: 'Token válido' });
        return;
    }
    catch (error) {
        (0, errors_1.handleControllerError)(res, error);
    }
});
exports.validateToken = validateToken;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { newPassword } = req.body;
    const { token } = req.params;
    try {
        yield (0, password_service_1.resetPasswordService)(token, newPassword);
        res.status(200).json({ message: 'Senha redefinida com sucesso' });
        return;
    }
    catch (error) {
        (0, errors_1.handleControllerError)(res, error);
    }
});
exports.resetPassword = resetPassword;
