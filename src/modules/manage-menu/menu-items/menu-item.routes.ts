import { Router } from "express";
import { authenticateToken } from "../../../middlewares/authenticate-token.middleware";
import { createMenuItem, deleteMenuItem, toggleMenuItemStatus, updateMenuItem } from "./menu-item.controller";

const router = Router();

router.post('/menu-items/:categoryId', authenticateToken, createMenuItem);

router.put('/menu-items/:categoryId/:itemId', authenticateToken, updateMenuItem);

router.patch('/menu-items/:categoryId/:itemId/toggle-status', authenticateToken, toggleMenuItemStatus);

router.delete('/menu-items/:itemId', authenticateToken, deleteMenuItem);

export default router