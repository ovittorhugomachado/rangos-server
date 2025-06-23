import { Router } from "express";
import { authenticateToken } from "../../../middlewares/authenticate-token.middleware";
import {
    createMenuCategory,
    deleteMenuCategory,
    getMenuCategories,
    renameMenuCategory,
    toggleMenuCategoryStatus
} from "./menu-category.controller";

const router = Router();

router.get('/categories', authenticateToken, getMenuCategories);

router.post('/categories', authenticateToken, createMenuCategory);

router.put('/categories/:id', authenticateToken, renameMenuCategory);

router.delete('/categories/:id', authenticateToken, deleteMenuCategory);

router.patch('/categories/:id/toggle-status', authenticateToken, toggleMenuCategoryStatus);

export default router;