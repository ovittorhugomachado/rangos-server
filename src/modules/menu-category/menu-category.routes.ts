import { Router } from "express";
import { authenticateToken } from "../../middlewares/authenticate-token.middleware";
import { CreateMenuCategory, renameMenuCategory, toggleMenuCategoryStatus } from "./menu-category.controller";

const router = Router();

router.post('/categories', authenticateToken, (req, res, next) => {
    CreateMenuCategory(req, res).catch(next);
});

router.put('/categories/:id', authenticateToken, (req, res, next) => {
    renameMenuCategory(req, res).catch(next);
});

router.patch('/categories/:id/toggle-status', authenticateToken, (req, res, next) => {
    toggleMenuCategoryStatus(req, res).catch(next);
});

export default router;