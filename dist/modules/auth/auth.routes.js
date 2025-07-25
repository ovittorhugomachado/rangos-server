"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_limiter_middleware_1 = require("./auth-limiter.middleware");
const authenticate_token_middleware_1 = require("../../middlewares/authenticate-token.middleware");
const auth_controller_1 = require("./auth.controller");
const router = (0, express_1.Router)();
router.post('/signup', auth_controller_1.signUp);
router.post('/login', auth_limiter_middleware_1.authLimiter, auth_controller_1.login);
router.post('/refresh-token', auth_controller_1.refreshAccessToken);
router.post('/logout', authenticate_token_middleware_1.authenticateToken, auth_controller_1.logout);
exports.default = router;
