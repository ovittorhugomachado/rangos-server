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
exports.deleteMenuItem = exports.toggleMenuItemStatus = exports.updateMenuItem = exports.createMenuItem = exports.getMenuItemsByCategory = void 0;
const menu_item_service_1 = require("./menu-item.service");
const errors_1 = require("../../../utils/errors");
const getMenuItemsByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const storeId = Number(req.params.storeId);
    const categoryId = Number(req.params.categoryId);
    if (!storeId) {
        res.status(401).json({ success: false, message: 'Loja não encontrada' });
        return;
    }
    if (!categoryId || isNaN(categoryId)) {
        res.status(400).json({ success: false, message: 'ID da categoria inválido' });
        return;
    }
    try {
        const items = yield (0, menu_item_service_1.getMenuItemsByCategoryService)(storeId, categoryId);
        res.status(200).json({ success: true, data: items });
    }
    catch (error) {
        (0, errors_1.handleControllerError)(res, error);
    }
});
exports.getMenuItemsByCategory = getMenuItemsByCategory;
const createMenuItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
    const categoryId = Number(req.params.categoryId);
    const { name, description, price, optionGroups } = req.body;
    if (!userId) {
        res.status(401).json({ message: 'Erro na validação do usuário' });
        return;
    }
    ;
    if (!name || !description || !price || !categoryId) {
        res.status(400).json({ message: 'Dados obrigatórios ausentes' });
        return;
    }
    ;
    try {
        const newItem = yield (0, menu_item_service_1.createMenuItemService)(userId, name, description, price, categoryId, optionGroups);
        res.status(201).json({ success: true, data: newItem });
    }
    catch (error) {
        (0, errors_1.handleControllerError)(res, error);
    }
});
exports.createMenuItem = createMenuItem;
const updateMenuItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
    const categoryId = Number(req.params.categoryId);
    const itemId = Number(req.params.itemId);
    const { name, description, price } = req.body;
    if (!userId) {
        res.status(401).json({ success: false, message: 'Usuário não autenticado' });
        return;
    }
    ;
    if (!itemId || isNaN(itemId)) {
        res.status(400).json({ success: false, message: 'ID do item inválido' });
        return;
    }
    ;
    if (name && typeof name !== 'string') {
        res.status(400).json({ success: false, message: 'Nome deve ser uma string' });
        return;
    }
    ;
    if (description && typeof description !== 'string') {
        res.status(400).json({ success: false, message: 'Descrição deve ser uma string' });
        return;
    }
    ;
    if (price && (typeof price !== 'number' || price <= 0)) {
        res.status(400).json({ success: false, message: 'Preço deve ser um número positivo' });
        return;
    }
    ;
    if (categoryId && (typeof categoryId !== 'number' || categoryId <= 0)) {
        res.status(400).json({ success: false, message: 'ID da categoria inválido' });
        return;
    }
    ;
    try {
        const updatedItem = yield (0, menu_item_service_1.menuItemUpdateService)(userId, categoryId, itemId, { name, description, price });
        if (!updatedItem) {
            res.status(404).json({ success: false, message: 'Item não encontrado' });
            return;
        }
        ;
        res.status(200).json({ success: true, data: updatedItem });
        return;
    }
    catch (error) {
        (0, errors_1.handleControllerError)(res, error);
    }
});
exports.updateMenuItem = updateMenuItem;
const toggleMenuItemStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
    const categoryId = Number(req.params.categoryId);
    const itemId = Number(req.params.itemId);
    if (!userId) {
        res.status(401).json({ success: false, message: 'Usuário não autenticado' });
        return;
    }
    ;
    if (!categoryId || isNaN(categoryId)) {
        res.status(400).json({ success: false, message: 'ID da categoria inválido' });
        return;
    }
    ;
    if (!itemId || isNaN(itemId)) {
        res.status(400).json({ success: false, message: 'ID do item inválido' });
        return;
    }
    ;
    try {
        yield (0, menu_item_service_1.menuItemStatusToggleService)(userId, itemId);
        res.status(200).json({ success: true, message: 'Status atualizado com sucesso' });
    }
    catch (error) {
        (0, errors_1.handleControllerError)(res, error);
    }
});
exports.toggleMenuItemStatus = toggleMenuItemStatus;
const deleteMenuItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
    const itemId = Number(req.params.itemId);
    if (!userId) {
        res.status(401).json({ success: false, message: 'Usuário não autenticado' });
        return;
    }
    ;
    if (!itemId || isNaN(itemId)) {
        res.status(400).json({ success: false, message: 'ID do item inválido' });
        return;
    }
    ;
    try {
        yield (0, menu_item_service_1.deleteMenuItemService)(userId, itemId);
        res.status(200).json({ success: true, message: 'ítem deletado com sucesso' });
    }
    catch (error) {
        (0, errors_1.handleControllerError)(res, error);
    }
});
exports.deleteMenuItem = deleteMenuItem;
