import { Router } from "express";
import { authenticateToken } from "../../../middlewares/authenticate-token.middleware";
import { createMenuItem, deleteMenuItem, toggleMenuItemStatus, updateMenuItem } from "./menu-item.controller";

const router = Router();

router.post('/menu-items', authenticateToken, (req, res, next) => {
    createMenuItem(req, res).catch(next);
});

router.put('/menu-items/:id', authenticateToken, (req, res, next) => {
    updateMenuItem(req, res).catch(next);
});

router.patch('/menu-items/:id/toggle-status', authenticateToken, (req, res, next) => {
    toggleMenuItemStatus(req, res).catch(next);
});

router.delete('/menu-items/:id', authenticateToken, (req, res, next) => {
    deleteMenuItem(req, res).catch(next);
});

export default router