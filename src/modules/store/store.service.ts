import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

interface StoreData {
    restaurantName?: string | null;
    phoneNumber?: string | null;
    address?: string | null;
    logoUrl?: string | null;
    bannerUrl?: string | null;
    delivery?: boolean;
    pickup?: boolean;
    openingHours?: object | null;
}

export const serviceGetStoreData = async (userId: number): Promise<StoreData> => {

    const store = await prisma.store.findUnique({
        where: { userId },
        select: {
            restaurantName: true,
            phoneNumber: true,
            address: true,
            logoUrl: true,
            bannerUrl: true,
            delivery: true,
            pickup: true,
            openingHours: true,
        }
    })

    if (!store) {
        throw new Error("STORE_NOT_FOUND");
    }

    return store
}