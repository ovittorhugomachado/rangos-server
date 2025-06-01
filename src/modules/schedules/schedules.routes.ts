import { Router } from "express";
import { updateScheduleController } from "./update-schedule.controller";

const router = Router()

router.put('/:userId/update-schedules', updateScheduleController)

export default router;