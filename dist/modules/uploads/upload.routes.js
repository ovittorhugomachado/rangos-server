"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uploads_controller_1 = require("./uploads.controller");
const multer_middleware_1 = require("../../middlewares/multer.middleware");
const authenticate_token_middleware_1 = require("../../middlewares/authenticate-token.middleware");
const multer_error_middleware_1 = require("../../middlewares/multer-error.middleware");
const router = express_1.default.Router();
router.patch('/logo', authenticate_token_middleware_1.authenticateToken, (req, res, next) => multer_middleware_1.uploadLogo.single('logo')(req, res, (err) => (0, multer_error_middleware_1.multerErrorHandler)(err, req, res, next)), uploads_controller_1.updateProfileLogo);
router.patch('/banner', authenticate_token_middleware_1.authenticateToken, (req, res, next) => multer_middleware_1.uploadBanner.single('banner')(req, res, (err) => (0, multer_error_middleware_1.multerErrorHandler)(err, req, res, next)), uploads_controller_1.updateProfileBanner);
router.patch('/:categoryId/:menuItemId', authenticate_token_middleware_1.authenticateToken, (req, res, next) => multer_middleware_1.uploadMenuItemImage.single('menu-item')(req, res, (err) => (0, multer_error_middleware_1.multerErrorHandler)(err, req, res, next)), uploads_controller_1.updateMenuItemImage);
exports.default = router;
