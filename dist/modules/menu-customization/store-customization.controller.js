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
exports.getStoreCustomization = void 0;
const store_customization_service_1 = require("./store-customization.service");
const getStoreCustomization = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const storeCustomization = yield (0, store_customization_service_1.getStoreCustomizationByUserId)(Number(userId));
        if (!storeCustomization) {
            res.status(404).json({ error: 'Configurações da loja não encontradas' });
            return;
        }
        res.status(200).json(storeCustomization);
    }
    catch (error) {
        console.error('Erro ao buscar configurações da loja:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.getStoreCustomization = getStoreCustomization;
