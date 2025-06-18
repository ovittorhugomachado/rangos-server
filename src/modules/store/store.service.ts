import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError, NotFoundError } from "../../utils/errors";

interface StoreData {
    restaurantName?: string | null;
    phoneNumber?: string | null;
    address?: string | null;
    logoUrl?: string | null;
    bannerUrl?: string | null;
    delivery?: boolean | null;
    pickup?: boolean | null;
    openingHours?: object | null;
}

interface UpdateStoreData {
    restaurantName?: string | null;
    phoneNumber?: string | null;
    address?: string | null;
    logoUrl?: string | null;
    bannerUrl?: string | null;
    delivery?: boolean;
    pickup?: boolean;
    openingHours?: Prisma.OpeningHourUpdateManyWithoutStoreNestedInput;
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
        throw new NotFoundError("Loja não encontrada");
    }

    return store
};

export const storeDataUpdateService = async (userId: number, updateData: UpdateStoreData) => {


    if (!userId || isNaN(userId)) {
        throw new NotFoundError('Usuário não encontrado');
    };

    if (Object.keys(updateData).length === 0) {
        throw new AppError('Dados de atualização vazios');
    };

    return await prisma.store.update({
        where: { userId },
        data: updateData,
        select: {
            restaurantName: true,
            phoneNumber: true,
            address: true,
            delivery: true,
            pickup: true,
        }
    });
};