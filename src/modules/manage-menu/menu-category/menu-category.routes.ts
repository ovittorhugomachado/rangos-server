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

router.get('/categories', authenticateToken, (req, res, next) => {
    getMenuCategories(req, res).catch(next);
});

router.post('/categories', authenticateToken, (req, res, next) => {
    createMenuCategory(req, res).catch(next);
});

router.put('/categories/:id', authenticateToken, (req, res, next) => {
    renameMenuCategory(req, res).catch(next);
});

router.patch('/categories/:id/toggle-status', authenticateToken, (req, res, next) => {
    toggleMenuCategoryStatus(req, res).catch(next);
});

router.delete('/categories/:id', authenticateToken, (req, res, next) => {
    deleteMenuCategory(req, res).catch(next);
});

export default router;