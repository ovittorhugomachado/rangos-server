import { Router } from "express";
import { authenticateToken } from "../../middlewares/authenticate-token.middleware";
import { getStoreData, updateStoreData } from "./store.controller";

const router = Router();

router.get('/store', authenticateToken, (req, res, next) => {
    getStoreData(req, res).catch(next);
});

router.patch('/store', authenticateToken, (req, res, next) => {
    updateStoreData(req, res).catch(next);
});

export default router