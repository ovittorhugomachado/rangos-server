import { Router } from "express";
import { authenticateToken } from "../../middlewares/authenticate-token.middleware";
import { createMenuCategory } from "./menu-category.controller";

const router = Router();

router.post('/categories', authenticateToken, (req, res, next) => {
    createMenuCategory(req, res).catch(next);
});

export default router;