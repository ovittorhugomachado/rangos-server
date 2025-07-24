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
exports.menuItemImageUpdateService = exports.profileBannerUpdateService = exports.profileLogoUpdateService = void 0;
const prisma_1 = require("../../lib/prisma");
const errors_1 = require("../../utils/errors");
const profileLogoUpdateService = (id, imageName) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.prisma.user.findUnique({ where: { id } });
    if (!user)
        throw new errors_1.NotFoundError('Usuário não encontrado');
    return yield prisma_1.prisma.store.update({
        where: { id },
        data: { logoUrl: imageName }
    });
});
exports.profileLogoUpdateService = profileLogoUpdateService;
const profileBannerUpdateService = (id, imageName) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.prisma.user.findUnique({ where: { id } });
    if (!user)
        throw new errors_1.NotFoundError('Usuário não encontrado');
    return yield prisma_1.prisma.store.update({
        where: { id },
        data: { bannerUrl: imageName }
    });
});
exports.profileBannerUpdateService = profileBannerUpdateService;
const menuItemImageUpdateService = (id, categoryId, productId, imageName) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.prisma.user.findUnique({ where: { id } });
    if (!user)
        throw new errors_1.NotFoundError('Usuário não encontrado');
    const category = yield prisma_1.prisma.menuCategory.findUnique({ where: { id: categoryId } });
    if (!category)
        throw new errors_1.NotFoundError('Categoria não encontrada');
    const item = yield prisma_1.prisma.menuItem.findUnique({ where: { id: productId } });
    if (!item)
        throw new errors_1.NotFoundError('Item não encontrado');
    return yield prisma_1.prisma.menuItem.update({
        where: { id: productId },
        data: { photoUrl: imageName }
    });
});
exports.menuItemImageUpdateService = menuItemImageUpdateService;
