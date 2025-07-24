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
exports.deleteMenuCategory = exports.toggleMenuCategoryStatus = exports.renameMenuCategory = exports.createMenuCategory = exports.getMyMenuCategories = exports.getMenuCategories = void 0;
const menu_category_service_1 = require("./menu-category.service");
const errors_1 = require("../../../utils/errors");
const getMenuCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const storeId = Number(req.params.id);
    if (!storeId) {
        res.status(401).json({ message: 'Erro na validação da loja' });
        return;
    }
    ;
    try {
        const categories = yield (0, menu_category_service_1.serviceGetMenuCategories)(storeId);
        res.status(200).json(categories);
    }
    catch (error) {
        (0, errors_1.handleControllerError)(res, error);
    }
    ;
});
exports.getMenuCategories = getMenuCategories;
const getMyMenuCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
    if (!userId) {
        res.status(401).json({ message: 'Erro na validação do usuário' });
        return;
    }
    ;
    try {
        const categories = yield (0, menu_category_service_1.serviceGetMyMenuCategories)(userId);
        res.status(200).json(categories);
    }
    catch (error) {
        (0, errors_1.handleControllerError)(res, error);
    }
    ;
});
exports.getMyMenuCategories = getMyMenuCategories;
const createMenuCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
    const { name } = req.body;
    if (!userId) {
        res.status(401).json({ message: 'Erro na validação do usuário' });
        return;
    }
    ;
    if (!name || typeof name !== 'string') {
        res.status(400).json({ message: 'Nome da categoria é obrigatório' });
        return;
    }
    ;
    try {
        const newCategory = yield (0, menu_category_service_1.createCategoryMenuService)(userId, name);
        res.status(201).json(newCategory);
    }
    catch (error) {
        (0, errors_1.handleControllerError)(res, error);
    }
    ;
});
exports.createMenuCategory = createMenuCategory;
const renameMenuCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
    const categoryId = Number(req.params.id);
    const { newName } = req.body;
    if (!userId) {
        res.status(401).json({ message: 'Erro na validação do usuário' });
        return;
    }
    ;
    if (!newName || typeof newName !== 'string') {
        res.status(400).json({ message: 'Nome da categoria é obrigatório' });
        return;
    }
    ;
    try {
        const updatedCategory = yield (0, menu_category_service_1.menuCategoryRenameService)(userId, categoryId, newName);
        res.status(200).json(updatedCategory);
    }
    catch (error) {
        (0, errors_1.handleControllerError)(res, error);
    }
    ;
});
exports.renameMenuCategory = renameMenuCategory;
const toggleMenuCategoryStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
    const categoryId = Number(req.params.id);
    if (!userId) {
        res.status(401).json({ message: 'Erro na validação do usuário' });
        return;
    }
    ;
    try {
        const updatedStatus = yield (0, menu_category_service_1.toggleMenuCategoryService)(userId, categoryId);
        res.status(200).json({
            success: true,
            isActive: updatedStatus.isActive
        });
    }
    catch (error) {
        (0, errors_1.handleControllerError)(res, error);
    }
    ;
});
exports.toggleMenuCategoryStatus = toggleMenuCategoryStatus;
const deleteMenuCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
    const categoryId = Number(req.params.id);
    if (!userId) {
        res.status(401).json({ message: 'Erro na validação do usuário' });
        return;
    }
    ;
    try {
        yield (0, menu_category_service_1.serviceDeleteMenuCategory)(userId, categoryId);
        res.status(200).json({ message: 'Categoria deletada com sucesso' });
        return;
    }
    catch (error) {
        (0, errors_1.handleControllerError)(res, error);
    }
    ;
});
exports.deleteMenuCategory = deleteMenuCategory;
