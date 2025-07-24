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
exports.logout = exports.refreshAccessToken = exports.login = exports.signUp = void 0;
const field_error_checker_1 = require("./field-error-checker");
const errors_1 = require("../../utils/errors");
const auth_service_1 = require("./auth.service");
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validationError = (0, field_error_checker_1.signUpFieldsErrorChecker)(req.body);
        if (validationError) {
            res.status(422).json({ error: validationError });
            return;
        }
        yield (0, auth_service_1.signUpService)(req.body);
        res.status(201).json({ message: 'Usuário criado com sucesso' });
        return;
    }
    catch (error) {
        (0, errors_1.handleControllerError)(res, error);
    }
});
exports.signUp = signUp;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validationError = (0, field_error_checker_1.loginFieldsErrorChecker)(req.body);
        if (validationError) {
            res.status(400).json({ message: validationError });
            return;
        }
        const { accessToken, refreshToken } = yield (0, auth_service_1.loginService)(req.body);
        res.cookie('token', accessToken, {
            httpOnly: true,
            secure: false, //EM PRODUÇÃOO MUDAR PARA TRUE
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000, //1 DIA
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false, //EM PRODUÇÃOO MUDAR PARA TRUE
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias
        });
        res.status(200).json({ message: 'Login realizado com sucesso' });
        return;
    }
    catch (error) {
        (0, errors_1.handleControllerError)(res, error);
    }
});
exports.login = login;
const refreshAccessToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.status(401).json({ message: 'Refresh token não fornecido' });
        return;
    }
    try {
        const newAccessToken = yield (0, auth_service_1.refreshTokenService)(refreshToken);
        res.cookie('token', newAccessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000,
        });
        res.status(200).json({ message: 'Token renovado com sucesso' });
        return;
    }
    catch (error) {
        (0, errors_1.handleControllerError)(res, error);
    }
});
exports.refreshAccessToken = refreshAccessToken;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            res.status(401).json({ message: 'Usuário não autenticado' });
            return;
        }
        yield (0, auth_service_1.logoutService)(userId);
        res.clearCookie('token');
        res.clearCookie('refreshToken');
        res.status(200).json({ message: 'Logout efetuado com sucesso' });
        return;
    }
    catch (error) {
        (0, errors_1.handleControllerError)(res, error);
    }
});
exports.logout = logout;
