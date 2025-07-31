import { Router } from "express";
import { authenticateToken } from "../../../../middlewares/authenticate-token.middleware";
import {
    acceptOrder,
    cancelOrder,
    listDetailsOrder,
    listOrders,
    orderDelivered,
    orderReady
} from "./orders.controller";

const router = Router();

router.get('/order/list', authenticateToken, listOrders);

router.get('/order/:orderId/details', authenticateToken, listDetailsOrder);

router.patch('/order/:orderId/accept', authenticateToken, acceptOrder);

router.patch('/order/:orderId/cancel', authenticateToken, cancelOrder);

router.patch('/order/:orderId/ready', authenticateToken, orderReady);

router.patch('/order/:orderId/delivered', authenticateToken, orderDelivered)

export default router
