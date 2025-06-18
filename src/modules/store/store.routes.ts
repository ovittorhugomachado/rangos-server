import { Router } from "express";
import { authenticateToken } from "../../middlewares/authenticate-token.middleware";
import { getStoreData, updateStoreData } from "./store.controller";

const router = Router();

router.get('/store', authenticateToken, getStoreData);

router.patch('/store', authenticateToken, updateStoreData);

export default router;