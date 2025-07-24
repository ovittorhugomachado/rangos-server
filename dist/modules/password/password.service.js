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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordService = exports.validateTokenService = exports.passwordResetEmailService = exports.generateResetTokenService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../../lib/prisma");
const crypto_1 = require("crypto");
const email_1 = require("../../utils/email");
const errors_1 = require("../../utils/errors");
const generateResetTokenService = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user)
        throw new errors_1.NotFoundError('Usuário não encontrado');
    yield prisma_1.prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
    const token = (0, crypto_1.randomUUID)();
    const expiresAt = new Date(Date.now() + 3600000); // 1h
    yield prisma_1.prisma.passwordResetToken.create({
        data: {
            token,
            userId: user.id,
            expiresAt,
            createdAt: new Date(Date.now())
        }
    });
    return { token, userId: user.id };
});
exports.generateResetTokenService = generateResetTokenService;
const passwordResetEmailService = (email, token, restaurantName) => __awaiter(void 0, void 0, void 0, function* () {
    const resetLink = `http://localhost:5173/create-new-password/${token}`;
    yield email_1.transporter.sendMail({
        from: '"Rangos" <' + process.env.EMAIL_USER + '>',
        to: email,
        subject: 'Recuperação de senha',
        html: `
            <p>Olá <strong>${restaurantName}</strong>,</p>
            <p>Recebemos uma solicitação de redefinição de senha, clique no link abaixo para criar uma nova senha</p>
            <a href="${resetLink}">Redefinir senha</a>
            <br>
            <p>Se você não solicitou uma nova senha desconsidere o email.</p>
            <p>Caso precise de ajuda é só entrar em contato conosco respondendo esse email</p>
            <br>
            <p>Atenciosamente,</p>
            <p><strong>Equipe Rangos</strong></p>
            `
    });
});
exports.passwordResetEmailService = passwordResetEmailService;
const validateTokenService = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenData = yield prisma_1.prisma.passwordResetToken.findFirst({ where: { token } });
    if (!tokenData || tokenData.expiresAt < new Date())
        throw new errors_1.NotFoundError('Token inválido');
});
exports.validateTokenService = validateTokenService;
const resetPasswordService = (token, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenRecord = yield prisma_1.prisma.passwordResetToken.findUnique({
        where: { token },
        include: { user: true }
    });
    if (newPassword.length < 8)
        throw new errors_1.ValidationError('Senha fraca');
    if (newPassword.length > 72)
        throw new errors_1.ValidationError('Senha muito longa');
    if (!/[A-Z]/.test(newPassword))
        throw new errors_1.ValidationError('Senha sem letra maiúscula');
    if (!/[0-9]/.test(newPassword))
        throw new errors_1.ValidationError('Senha sem número');
    if (!tokenRecord || tokenRecord.expiresAt < new Date())
        throw new errors_1.NotFoundError('Token inválido ou expirado');
    console.log(tokenRecord.expiresAt);
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
    yield prisma_1.prisma.user.update({
        where: { id: tokenRecord.userId },
        data: { password: hashedPassword }
    });
    yield prisma_1.prisma.passwordResetToken.delete({ where: { token } });
});
exports.resetPasswordService = resetPasswordService;
