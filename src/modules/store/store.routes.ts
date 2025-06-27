import { Router } from "express";
import { authenticateToken } from "../../middlewares/authenticate-token.middleware";
import { getStoreData, updateStoreData, getStoreStyleData, updateStoreStyleData } from "./store.controller";

const router = Router();

router.get('/store', authenticateToken, getStoreData);

router.patch('/store', authenticateToken, updateStoreData);

router.get('/store/style', authenticateToken, getStoreStyleData);

router.patch('/store/style', authenticateToken, updateStoreStyleData);

export default router;