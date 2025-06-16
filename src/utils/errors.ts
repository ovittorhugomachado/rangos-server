export class AppError extends Error {
    constructor(
        public readonly message: string,
        public readonly statusCode: number = 400
    ) {
        super(message);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = "Não autenticado") {
        super(message, 401);
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = "Acesso negado") {
        super(message, 403);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(message, 404);
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 422);
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, 409);
    }
}

export class TooManyRequestsError extends AppError {
    constructor(message: string = "Muitas requisições") {
        super(message, 429);
    }
}

export class InternalServerError extends AppError {
    constructor(message: string = 'Erro interno no servidor') {
        super(message, 500);
    }
}