"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.TooManyRequestsError = exports.ValidationError = exports.ConflictError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.AppError = void 0;
exports.handleControllerError = handleControllerError;
class AppError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
    }
}
exports.AppError = AppError;
;
class UnauthorizedError extends AppError {
    constructor(message = "Não autenticado") {
        super(message, 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
;
class ForbiddenError extends AppError {
    constructor(message = "Acesso negado") {
        super(message, 403);
    }
}
exports.ForbiddenError = ForbiddenError;
;
class NotFoundError extends AppError {
    constructor(message) {
        super(message, 404);
    }
}
exports.NotFoundError = NotFoundError;
;
class ConflictError extends AppError {
    constructor(message) {
        super(message, 409);
    }
}
exports.ConflictError = ConflictError;
;
class ValidationError extends AppError {
    constructor(message) {
        super(message, 422);
    }
}
exports.ValidationError = ValidationError;
;
class TooManyRequestsError extends AppError {
    constructor(message = "Muitas requisições") {
        super(message, 429);
    }
}
exports.TooManyRequestsError = TooManyRequestsError;
;
class InternalServerError extends AppError {
    constructor(message = 'Erro interno no servidor') {
        super(message, 500);
    }
}
exports.InternalServerError = InternalServerError;
;
const handledErrors = [
    AppError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ValidationError,
    ConflictError,
    TooManyRequestsError,
    InternalServerError
];
function handleControllerError(res, error) {
    console.error('Erro no controller:', error);
    const matchedError = handledErrors.find(ErrorClass => error instanceof ErrorClass);
    const MAX_ERROR_MSG_LENGTH = 150;
    const defaultMsg = "Erro interno no servidor";
    let message = error.message || defaultMsg;
    if (typeof message === "string" && message.length > MAX_ERROR_MSG_LENGTH) {
        message = defaultMsg;
    }
    if (matchedError) {
        return res.status(error.statusCode).json({
            success: false,
            message
        });
    }
    return res.status(500).json({
        success: false,
        message
    });
}
;
