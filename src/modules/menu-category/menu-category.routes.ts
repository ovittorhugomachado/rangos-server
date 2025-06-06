import { Router } from "express";
import { authenticateToken } from "../../middlewares/authenticate-token.middleware";
import { controllerCreateMenuCategory, controllerUpdateMenuCategory } from "./menu-category.controller";

const router = Router();

router.post('/categories', authenticateToken, (req, res, next) => {
    controllerCreateMenuCategory(req, res).catch(next);
});

router.put('/categories/:id', authenticateToken, (req, res, next) => {
    controllerUpdateMenuCategory(req, res).catch(next);
});

export default router;