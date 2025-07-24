"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const update_schedule_controller_1 = require("./update-schedule.controller");
const authenticate_token_middleware_1 = require("../../middlewares/authenticate-token.middleware");
const router = (0, express_1.Router)();
router.put('/schedules', authenticate_token_middleware_1.authenticateToken, (req, res, next) => {
    (0, update_schedule_controller_1.updateScheduleController)(req, res).catch(next);
});
exports.default = router;
