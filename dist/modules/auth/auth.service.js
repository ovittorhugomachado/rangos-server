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
exports.logoutService = exports.refreshTokenService = exports.loginService = exports.signUpService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../../lib/prisma");
const stripFormating_1 = require("../../utils/stripFormating");
const generate_tokens_1 = require("./generate-tokens");
const errors_1 = require("../../utils/errors");
const JWT_SECRET = process.env.JWT_SECRET || 'secreto';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh_secreto';
;
const signUpService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { restaurantName, cnpj, ownersName, cpf, phoneNumber, email, password } = data;
    const rawCpf = (0, stripFormating_1.stripNonDigits)(cpf);
    const rawCnpj = cnpj ? (0, stripFormating_1.stripNonDigits)(cnpj) : null;
    const rawPhoneNumber = (0, stripFormating_1.stripNonDigits)(phoneNumber);
    if (!email.includes('@'))
        throw new errors_1.ValidationError('Email inválido');
    if (rawCpf.length !== 11)
        throw new errors_1.ValidationError('CPF inválido');
    if (cnpj && rawCnpj && rawCnpj.length !== 14)
        throw new errors_1.ValidationError('CNPJ inválido');
    if (password.length < 8)
        throw new errors_1.ValidationError('Senha fraca');
    if (password.length > 72)
        throw new errors_1.ValidationError('Senha muito longa');
    if (!/[A-Z]/.test(password))
        throw new errors_1.ValidationError('Senha sem letra maiúscula');
    if (!/[0-9]/.test(password))
        throw new errors_1.ValidationError('Senha sem número');
    const existingUser = yield prisma_1.prisma.user.findUnique({ where: { email } });
    if (existingUser)
        throw new errors_1.ConflictError('Email já cadastrado');
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    yield prisma_1.prisma.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield prisma.user.create({
            data: {
                restaurantName,
                cnpj: rawCnpj,
                ownersName,
                cpf: rawCpf,
                phoneNumber: rawPhoneNumber,
                email,
                password: hashedPassword,
            },
        });
        const store = yield prisma.store.create({
            data: {
                userId: user.id,
                restaurantName,
                phoneNumber,
                style: {
                    create: {}
                }
            },
        });
        yield prisma.menuCategory.createMany({
            data: [
                { name: 'Pratos', storeId: store.id },
                { name: 'Bebidas', storeId: store.id }
            ]
        });
        const daysOfWeek = [
            'segunda',
            'terca',
            'quarta',
            'quinta',
            'sexta',
            'sabado',
            'domingo'
        ];
        yield prisma.openingHour.createMany({
            data: daysOfWeek.map(day => ({
                storeId: store.id,
                day,
                isOpen: false,
                timeRanges: []
            }))
        });
        return user;
    }));
});
exports.signUpService = signUpService;
const loginService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = data;
    const user = yield prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new errors_1.UnauthorizedError('Email ou senha inválidos');
    }
    const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!passwordMatch) {
        throw new errors_1.UnauthorizedError('Email ou senha inválidos');
    }
    const payload = {
        userId: user.id,
    };
    const { accessToken, refreshToken } = (0, generate_tokens_1.generateTokens)(payload);
    yield prisma_1.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
    });
    return { accessToken, refreshToken };
});
exports.loginService = loginService;
const refreshTokenService = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = jsonwebtoken_1.default.verify(refreshToken, REFRESH_SECRET);
    const user = yield prisma_1.prisma.user.findUnique({
        where: { id: payload.userId },
    });
    if (!user || user.refreshToken !== refreshToken) {
        throw new errors_1.UnauthorizedError('Registro não encontrado através do token fornecido');
    }
    ;
    const newAccessToken = jsonwebtoken_1.default.sign({
        userId: user.id,
    }, JWT_SECRET, { expiresIn: '1d' });
    return newAccessToken;
});
exports.refreshTokenService = refreshTokenService;
const logoutService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null },
    });
});
exports.logoutService = logoutService;
