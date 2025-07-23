import { Router } from "express";
import { authenticateToken } from "../../middlewares/authenticate-token.middleware";
import { getStoreData, updateMyStoreData, getMyStoreStyleData, updateMyStoreStyleData, getStoreList, getMyStoreData, getStoreStyleData } from "./store.controller";

const router = Router();

//Rotas do lado do cliente
router.get('/stores/list', getStoreList);

router.get('/store/:id', getStoreData);

router.get('/store/style/:id', getStoreStyleData);

//Rotas do lado do proprietário da loja
router.get('/my-store', authenticateToken, getMyStoreData);

router.patch('/my-store', authenticateToken, updateMyStoreData);

router.get('/my-store/style', authenticateToken, getMyStoreStyleData);

router.patch('/my-store/style', authenticateToken, updateMyStoreStyleData);

export default router;