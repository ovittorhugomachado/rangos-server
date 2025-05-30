import { PrismaClient } from '../../node_modules/.prisma/client/index';

const prisma = new PrismaClient()

export const getUserDataService = async (userId: number) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            restaurantName: true,
            plan: true,
            accountStatus: true,
            createdAt: true,
            openingHours: {
                select: {
                    day: true,
                    open: true,
                    close: true
                },
                orderBy: {
                    day: 'asc'
                }
            }
        }
    });

    if (!user) {
        throw new Error('USER_NOT_FOUND');
    }

    return user;
};
