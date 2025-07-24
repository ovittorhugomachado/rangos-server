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
exports.updateMyStoreStyleData = exports.getMyStoreStyleData = exports.updateMyStoreData = exports.getMyStoreData = exports.getStoreStyleData = exports.getStoreData = exports.getStoreList = void 0;
const store_service_1 = require("./store.service");
const errors_1 = require("../../utils/errors");
//Controller do lado do cliente
const getStoreList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stores = yield (0, store_service_1.serviceGetStoresList)();
        ;
        res.status(200).json(stores);
        return;
    }
    catch (error) {
        (0, errors_1.handleControllerError)(res, error);
    }
});
exports.getStoreList = getStoreList;
const getStoreData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const storeId = Number(req.params.id);
    if (isNaN(storeId)) {
        res.status(400).json({ message: 'ID da loja inválido' });
        return;
    }
    try {
        const store = yield (0, store_service_1.serviceGetStoreData)(storeId);
        res.status(200).json(store);
        return;
    }
    catch (error) {
        (0, errors_1.handleControllerError)(res, error);
    }
});
exports.getStoreData = getStoreData;
const getStoreStyleData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const storeId = Number(req.params.id);
    try {
        const store = yield (0, store_service_1.serviceGetStoreStyleData)(storeId);
        res.status(200).json(store);
        return;
    }
    catch (error) {
        (0, errors_1.handleControllerError)(res, error);
    }
});
exports.getStoreStyleData = getStoreStyleData;
//Controller do lado da loja
const getMyStoreData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
    try {
        const store = yield (0, store_service_1.serviceGetMyStoreData)(userId);
        res.status(200).json(store);
        return;
    }
    catch (error) {
        (0, errors_1.handleControllerError)(res, error);
    }
});
exports.getMyStoreData = getMyStoreData;
const updateMyStoreData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
        const updateData = req.body;
        const allowedFields = ['restaurantName', 'phoneNumber', 'address', 'logoUrl', 'delivery', 'pickup'];
        const isValidUpdate = Object.keys(updateData).every(key => allowedFields.includes(key));
        if (!isValidUpdate) {
            throw new errors_1.AppError('Dados inválidos');
        }
        ;
        yield (0, store_service_1.myStoreDataUpdateService)(userId, updateData);
        res.status(200).json({ message: 'Dados atualizados com sucesso' });
        return;
    }
    catch (error) {
        (0, errors_1.handleControllerError)(res, error);
    }
});
exports.updateMyStoreData = updateMyStoreData;
const getMyStoreStyleData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
    try {
        const store = yield (0, store_service_1.serviceGetMyStoreStyleData)(userId);
        res.status(200).json(store);
        return;
    }
    catch (error) {
        (0, errors_1.handleControllerError)(res, error);
    }
});
exports.getMyStoreStyleData = getMyStoreStyleData;
const updateMyStoreStyleData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
        const updateData = req.body;
        const allowedFields = ['primaryColor', 'backgroundColor', 'textButtonColor'];
        const isValidUpdate = Object.keys(updateData).every(key => allowedFields.includes(key));
        if (!isValidUpdate) {
            throw new errors_1.AppError('Dados inválidos');
        }
        ;
        yield (0, store_service_1.myStoreStyleDataUpdateService)(userId, updateData);
        res.status(200).json({ message: 'Dados atualizados com sucesso' });
        return;
    }
    catch (error) {
        (0, errors_1.handleControllerError)(res, error);
    }
});
exports.updateMyStoreStyleData = updateMyStoreStyleData;
