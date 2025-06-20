import { Router } from "express";
import { authenticateToken } from "../../../middlewares/authenticate-token.middleware";
import { createMenuItem, deleteMenuItem, toggleMenuItemStatus, updateMenuItem } from "./menu-item.controller";

const router = Router();

router.post('/menu-items', authenticateToken, createMenuItem);

router.put('/menu-items/:id', authenticateToken, updateMenuItem);

router.patch('/menu-items/:id/toggle-status', authenticateToken, toggleMenuItemStatus);

router.delete('/menu-items/:id', authenticateToken, deleteMenuItem);

export default router