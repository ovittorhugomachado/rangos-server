import { prisma } from "../../lib/prisma";

export const getStoreCustomizationByUserId = async (userId: number) => {
    return await prisma.storeStyle.findUnique({
        where: { id: userId },
        select: {
            primaryColor: true,
            backgroundColor: true,
            textButtonColor: true,
        },
    });
};