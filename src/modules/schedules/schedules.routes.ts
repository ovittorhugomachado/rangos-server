import { Router } from "express";
import { updateScheduleController } from "./update-schedule.controller";
import { authenticateToken } from "../../middlewares/authenticate-token.middleware";

const router = Router()

router.put('/schedules', authenticateToken, (req, res, next) => {
    updateScheduleController(req, res).catch(next);
})

export default router;