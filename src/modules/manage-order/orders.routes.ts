import { Router } from "express";
import { authenticateToken } from "../../middlewares/authenticate-token.middleware";
import { acceptOrder, cancelOrder } from "./orders.controller";

const router = Router();

router.patch('/order/:orderId/accept', authenticateToken, acceptOrder);

router.patch('/order/:orderId/cancel', authenticateToken, cancelOrder);

///+router.patch('/order/:orderId/ready', authenticateToken) //se for pickup = pronto para retirada, se for delivery = a caminho
//router.patch('/order/:orderId/delivered', authenticateToken) //pedido entregue

export default router
