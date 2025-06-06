import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createMenuCategoryService = async (userId: number, name: string) => {
    const category = await prisma.menuCategory.create({
        data: {
            name,
            store: {
                connect: { id: userId }
            },
        }
    });

    return category
}