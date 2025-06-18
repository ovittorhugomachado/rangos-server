import { prisma } from "../../lib/prisma";
import { NotFoundError } from "../../utils/errors";

export const profileLogoUpdateService = async (id: number, imageName: string) => {

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundError('Usuário não encontrado');

    return await prisma.store.update({
        where: { id },
        data: { logoUrl: imageName }
    });

};

export const profileBannerUpdateService = async (id: number, imageName: string) => {

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundError('Usuário não encontrado');

    return await prisma.store.update({
        where: { id },
        data: { bannerUrl: imageName }
    });
};

export const menuItemImageUpdateService = async (id: number, categoryId: number, productId: number, imageName: string) => {

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundError('Usuário não encontrado');

    const category = await prisma.menuCategory.findUnique({ where: { id: categoryId } });
    if (!category) throw new NotFoundError('Categoria não encontrada');

    const item = await prisma.menuItem.findUnique({ where: { id: productId } });
    if (!item) throw new NotFoundError('Item não encontrado');

    return await prisma.menuItem.update({
        where: { id: productId },
        data: { photoUrl: imageName }
    });
};