import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createCategoryMenuService = async (userId: number, name: string) => {

    const store = await prisma.store.findUnique({ where: { userId } });

    if (!store) throw new Error('Loja não encontrada');

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

    if (!store) throw new Error('Loja não encontrada');

    const category = await prisma.menuCategory.findUnique({ where: { id: categoryId } });

    if (!category || category.storeId !== store.id) {
        throw new Error('Categoria não encontrada')
    };

    return await prisma.menuCategory.update({
        where: { id: categoryId },
        data: { name: newName }
    });
};

export const toggleMenuCategoryService = async (userId: number, categoryId: number) => {

    const store = await prisma.store.findUnique({ where: { userId } });

    if (!store) throw new Error('Loja não encontrada');

    const category = await prisma.menuCategory.findFirst({ 
        where: { 
            id: categoryId,
            storeId: store.id
        }
    });

    if (!category || category.storeId !== store.id) {
        throw new Error('Categoria não encontrada')
    };

    return await prisma.menuCategory.update({
        where: { id: categoryId },
        data: {
            isActive: !category.isActive
        }
    });
};