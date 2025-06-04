import { Router } from "express";
import { authenticateToken } from "../../middlewares/authenticate-token.middleware";
import { getStoreData } from "./store.controller";

const router = Router();

router.get('/store', authenticateToken, (req, res, next) => {
    getStoreData(req, res).catch(next);
});

export default router