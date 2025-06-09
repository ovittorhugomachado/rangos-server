import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

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

    if (!store) throw new Error('Loja não encontrada');

    if (!category || category.storeId !== store.id) throw new Error('Categoria inválida');

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