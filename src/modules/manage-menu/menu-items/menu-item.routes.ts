import { Router } from "express";
import { authenticateToken } from "../../../middlewares/authenticate-token.middleware";
import { createMenuItem } from "./menu-item.controller";

const router = Router();

router.post('/menu-item', authenticateToken, (req, res, next) => {
    createMenuItem(req, res).catch(next);
});

export default router