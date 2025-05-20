import { PrismaClient } from '../../node_modules/.prisma/client/index';

const prisma = new PrismaClient();

export const createCategoryService = async (name: string) => {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        throw new Error('NOME_OBRIGATORIO');
    }

    const existingCategory = await prisma.menuCategory.findFirst({
        where: {
            name: { equals: name.trim(), mode: 'insensitive' }
        }
    });

    if (existingCategory) {
        throw new Error('CATEGORIA_EXISTE');
    }

    await prisma.menuCategory.create({
        data: { name: name.trim() }
    });
};

export const deleteCategoryService = async (id: number) => {
    if (isNaN(id)) {
        throw new Error('ID_INVALIDO');
    }

    const category = await prisma.menuCategory.findUnique({ where: { id } });
    if (!category) {
        throw new Error('CATEGORIA_NAO_ENCONTRADA');
    }

    await prisma.menuCategory.delete({ where: { id } });
};

export const getCategoriesService = async () => {
    return await prisma.menuCategory.findMany();
};