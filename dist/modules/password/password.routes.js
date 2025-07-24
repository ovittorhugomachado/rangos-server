"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const password_controller_1 = require("./password.controller");
const router = (0, express_1.Router)();
router.post('/recover-password', password_controller_1.requestPasswordReset);
router.patch('/create-new-password/:token', password_controller_1.resetPassword);
router.get('/validate-token/:token', password_controller_1.validateToken);
exports.default = router;
