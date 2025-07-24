"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_token_middleware_1 = require("../../middlewares/authenticate-token.middleware");
const store_controller_1 = require("./store.controller");
const router = (0, express_1.Router)();
//Rotas do lado do cliente
router.get('/stores/list', store_controller_1.getStoreList);
router.get('/store/:id', store_controller_1.getStoreData);
router.get('/store/style/:id', store_controller_1.getStoreStyleData);
//Rotas do lado do proprietário da loja
router.get('/my-store', authenticate_token_middleware_1.authenticateToken, store_controller_1.getMyStoreData);
router.patch('/my-store', authenticate_token_middleware_1.authenticateToken, store_controller_1.updateMyStoreData);
router.get('/my-store/style', authenticate_token_middleware_1.authenticateToken, store_controller_1.getMyStoreStyleData);
router.patch('/my-store/style', authenticate_token_middleware_1.authenticateToken, store_controller_1.updateMyStoreStyleData);
exports.default = router;
