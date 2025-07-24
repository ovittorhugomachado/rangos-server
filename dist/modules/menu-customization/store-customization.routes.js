"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticate_token_middleware_1 = require("../../middlewares/authenticate-token.middleware");
const store_customization_controller_1 = require("./store-customization.controller");
const router = express_1.default.Router();
router.get('/:userId/store-customization', authenticate_token_middleware_1.authenticateToken, store_customization_controller_1.getStoreCustomization);
exports.default = router;
