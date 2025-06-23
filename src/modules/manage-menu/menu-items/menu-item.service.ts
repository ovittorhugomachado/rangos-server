import { prisma } from "../../../lib/prisma";
import { ForbiddenError, NotFoundError } from "../../../utils/errors";

export const createMenuItemService = async (
    userId: number,
    name: string,
    description: string,
    price: number,
    categoryId: number,
    optionGroups?: {
        title: string;
        required: boolean;
        options: {
            name: string;
            additionalPrice: number;
        }[];
    }[]
) => {

    const store = await prisma.store.findUnique({ where: { userId } });
    const category = await prisma.menuCategory.findUnique({ where: { id: categoryId } });

    if (!store) throw new NotFoundError('Loja não encontrada');

    if (!category || category.storeId !== store.id) throw new NotFoundError('Categoria inválida');

    const menuItem = await prisma.menuItem.create({
        data: {
            name,
            description,
            price,
            categoryId,
            optionsGroups: optionGroups ? {
                create: optionGroups.map(group => ({
                    title: group.title,
                    required: group.required,
                    options: {
                        create: group.options.map(option => ({
                            name: option.name,
                            additionalPrice: option.additionalPrice
                        }))
                    }
                }))
            } : undefined
        },
        include: {
            optionsGroups: {
                include: { options: true }
            }
        }
    });

    return menuItem
};

export const menuItemUpdateService = async (
    userId: number,
    categoryId: number,
    itemId: number,
    updateData: {
        name?: string;
        description?: string;
        price?: number;
    }
) => {

    const store = await prisma.store.findUnique({
        where: { userId },
        include: {
            MenuCategory: {
                where: { id: categoryId },
                select: { id: true }
            }
        }
    });

    if (!store) throw new NotFoundError('Loja não encontrada');

    if (categoryId && !store.MenuCategory.some(c => c.id === categoryId)) {
        throw new ForbiddenError('Categoria não pertence à loja');
    };

    const existingItem = await prisma.menuItem.findFirst({
        where: {
            id: itemId,
            menuCategory: {
                storeId: store.id
            }
        }
    });

    if (!existingItem) {
        throw new NotFoundError('Item não encontrado ou não pertence à sua loja');
    }

    return await prisma.menuItem.update({
        where: {
            id: itemId,
        },
        data: {
            name: updateData.name,
            description: updateData.description,
            price: updateData.price,
            ...(categoryId && { categoryId: categoryId })
        }
    });
};

export const menuItemStatusToggleService = async (userId: number, itemId: number) => {

    const store = await prisma.store.findUnique({
        where: { userId },
        include: {
            MenuCategory: {
                select: { id: true },
            },
        },
    });

    if (!store) throw new NotFoundError('Loja não encontrada');

    const item = await prisma.menuItem.findUnique({ where: { id: itemId } });

    if (!item || !store.MenuCategory.some(c => c.id === item.categoryId)) {
        throw new ForbiddenError("Item não encontrado ou não pertence à loja");
    };

    return await prisma.menuItem.update({
        where: { id: itemId },
        data: {
            isAvailable: !item.isAvailable
        },
    });
};

export const deleteMenuItemService = async (userId: number, itemId: number) => {

    const store = await prisma.store.findUnique({
        where: { userId },
        include: {
            MenuCategory: {
                select: { id: true },
            },
        },
    });

    if (!store) throw new NotFoundError('Loja não encontrada');

    const item = await prisma.menuItem.findUnique({ where: { id: itemId } });

    if (!item || !store.MenuCategory.some(c => c.id === item.categoryId)) {
        throw new ForbiddenError("Item não encontrado ou não pertence à loja");
    };

    return await prisma.menuItem.delete({
        where: { id: itemId }
    });
};