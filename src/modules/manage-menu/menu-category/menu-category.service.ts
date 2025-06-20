import { prisma } from "../../../lib/prisma";
import { NotFoundError } from "../../../utils/errors";

export const serviceGetMenuCategories = async (userId: number) => {

    const store = await prisma.store.findUnique({
        where: { userId },
        include: {
            MenuCategory: {
                orderBy: { id: 'asc' }
            }
        }
    });

    if (!store) throw new NotFoundError('Loja não encontrada');

    return store.MenuCategory
};

export const createCategoryMenuService = async (userId: number, name: string) => {

    const store = await prisma.store.findUnique({ where: { userId } });

    if (!store) throw new NotFoundError('Loja não encontrada');

    const category = await prisma.menuCategory.create({
        data: {
            name,
            store: {
                connect: { id: store?.id }
            },
        }
    });

    return category
};

export const menuCategoryRenameService = async (userId: number, categoryId: number, newName: string) => {

    const store = await prisma.store.findUnique({ where: { userId } });

    if (!store) throw new NotFoundError('Loja não encontrada');

    const category = await prisma.menuCategory.findUnique({ where: { id: categoryId } });

    if (!category || category.storeId !== store.id) {
        throw new NotFoundError('Categoria não encontrada')
    };

    return await prisma.menuCategory.update({
        where: { id: categoryId },
        data: { name: newName }
    });
};

export const toggleMenuCategoryService = async (userId: number, categoryId: number) => {

    const store = await prisma.store.findUnique({ where: { userId } });

    if (!store) throw new NotFoundError('Loja não encontrada');

    const category = await prisma.menuCategory.findFirst({
        where: {
            id: categoryId,
            storeId: store.id
        }
    });

    if (!category) { throw new NotFoundError('Categoria não encontrada') };

    return await prisma.menuCategory.update({
        where: { id: categoryId },
        data: {
            isActive: !category.isActive
        }
    });
};

export const serviceDeleteMenuCategory = async (userId: number, categoryId: number) => {

    const store = await prisma.store.findUnique({ where: { userId } });

    if (!store) throw new NotFoundError('Loja não encontrada');

    const category = await prisma.menuCategory.findFirst({
        where: {
            id: categoryId,
            storeId: store.id
        }
    });

    if (!category) throw new NotFoundError('Categoria não encontrada');

    await prisma.menuCategory.delete({ where: { id: categoryId } });
    return { success: true, message: "Categoria deletada", deletedId: categoryId }
};