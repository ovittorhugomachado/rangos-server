import { Router } from "express";
import { authenticateToken } from "../../../middlewares/authenticate-token.middleware";
import { createOrder } from "./order.controller";

const router = Router();

router.post('/order', authenticateToken, createOrder);

export default router;