"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginFieldsErrorChecker = exports.signUpFieldsErrorChecker = void 0;
;
const signUpFieldsErrorChecker = (body) => {
    const requiredFields = ['restaurantName', 'ownersName', 'cpf', 'phoneNumber', 'email', 'password'];
    for (const field of requiredFields) {
        if (!body[field]) {
            return 'Campos obrigatórios';
        }
    }
    return null;
};
exports.signUpFieldsErrorChecker = signUpFieldsErrorChecker;
const loginFieldsErrorChecker = (body) => {
    const { email, password } = body;
    if (!email || !password) {
        return 'Campos obrigatórios';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Email inválido';
    }
    if (password.length < 6) {
        return 'Senha muito curta';
    }
    return null;
};
exports.loginFieldsErrorChecker = loginFieldsErrorChecker;
