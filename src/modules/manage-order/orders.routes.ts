import { Router } from "express";
import { authenticateToken } from "../../middlewares/authenticate-token.middleware";
import { acceptOrder, cancelOrder, orderDelivered, orderReady } from "./orders.controller";

const router = Router();

router.patch('/order/:orderId/accept', authenticateToken, acceptOrder);

router.patch('/order/:orderId/cancel', authenticateToken, cancelOrder);

router.patch('/order/:orderId/ready', authenticateToken, orderReady);

router.patch('/order/:orderId/delivered', authenticateToken, orderDelivered) //pedido entregue

export default router
