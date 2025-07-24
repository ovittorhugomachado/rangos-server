"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMenuItemImage = exports.updateProfileBanner = exports.updateProfileLogo = void 0;
const errors_1 = require("../../utils/errors");
const uploads_service_1 = require("./uploads.service");
const updateProfileLogo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!req.file || !req.file.location) {
            res.status(400).json({ error: 'Erro no processamento do arquivo' });
            return;
        }
        const userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
        yield (0, uploads_service_1.profileLogoUpdateService)(userId, req.file.location);
        res.status(200).json({ message: 'Logo atualizada com sucesso' });
    }
    catch (error) {
        (0, errors_1.handleControllerError)(res, error);
    }
});
exports.updateProfileLogo = updateProfileLogo;
const updateProfileBanner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!req.file || !req.file.location) {
            res.status(400).json({ error: 'Erro no processamento do arquivo' });
            return;
        }
        const userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
        yield (0, uploads_service_1.profileBannerUpdateService)(userId, req.file.location);
        res.status(200).json({ message: 'Banner atualizado com sucesso' });
    }
    catch (error) {
        (0, errors_1.handleControllerError)(res, error);
    }
});
exports.updateProfileBanner = updateProfileBanner;
const updateMenuItemImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!req.file || !req.file.location) {
            res.status(400).json({ error: 'Erro no processamento do arquivo' });
            return;
        }
        const userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
        const categoryId = Number(req.params.categoryId);
        const itemId = Number(req.params.menuItemId);
        if (isNaN(userId) || isNaN(categoryId) || isNaN(itemId)) {
            res.status(404).json({
                error: 'Parâmetros inválidos',
                details: {
                    userId: userId,
                    isValid: !isNaN(userId) && userId > 0,
                }
            });
            return;
        }
        yield (0, uploads_service_1.menuItemImageUpdateService)(userId, categoryId, itemId, req.file.location);
        res.status(200).json({ message: 'imagem do produto atualizada com sucesso' });
    }
    catch (error) {
        (0, errors_1.handleControllerError)(res, error);
    }
});
exports.updateMenuItemImage = updateMenuItemImage;
