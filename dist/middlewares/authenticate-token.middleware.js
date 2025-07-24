"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET)
    throw new Error('JWT_SECRET não definido');
function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).json({ message: 'Token não fornecido' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (typeof decoded.userId !== 'number') {
            throw new jsonwebtoken_1.default.JsonWebTokenError('Payload inválido: userId deve ser um número');
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error('Erro no middleware JWT:', error);
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            res.status(401).json({ message: 'Token expirado' });
            return;
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(403).json({ message: 'Token inválido' });
            return;
        }
        res.status(500).json({ message: 'Erro interno durante a autenticação' });
        return;
    }
}
