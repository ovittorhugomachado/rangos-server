import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export const getUserDataService = async (userId: number) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            restaurantName: true,
            createdAt: true,
        }
    });

    if (!user) {
        throw new Error('USER_NOT_FOUND');
    }

    return user;
};
