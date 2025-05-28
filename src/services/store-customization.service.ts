import { PrismaClient } from '../../node_modules/.prisma/client/index';

const prisma = new PrismaClient()

export const getStoreCustomizationByUserId = async (userId: number) => {
    return await prisma.storeCustomization.findUnique({
        where: { userId },
        select: {
            primaryColor: true,
            backgroundColor: true,
            textColor: true,
            textButtonColor: true,
            logoUrl: true,
            bannerUrl: true,
        },
    });
};