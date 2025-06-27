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
};

interface UpdateStoreData {
    restaurantName?: string | null;
    phoneNumber?: string | null;
    address?: string | null;
    delivery?: boolean;
    pickup?: boolean;
    openingHours?: Prisma.OpeningHourUpdateManyWithoutStoreNestedInput;
};

interface StoreStyleData {
    primaryColor?: string | null;
    backgroundColor?: string | null;
    textButtonColor?: string | null;
};

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

export const serviceGetStoreStyleData = async (userId: number): Promise<StoreStyleData> => {

    const storeStyle = await prisma.storeStyle.findUnique({
        where: { id: userId },
        select: {
            primaryColor: true,
            backgroundColor: true,
            textButtonColor: true,
        }
    })

    if (!storeStyle) {
        throw new NotFoundError("Loja não encontrada");
    }

    return storeStyle
};

export const storeStyleDataUpdateService = async (userId: number, updateData: StoreStyleData) => {

    if (!userId || isNaN(userId)) {
        throw new NotFoundError('Usuário não encontrado');
    };

    if (Object.keys(updateData).length === 0) {
        throw new AppError('Dados de atualização vazios');
    };

        const prismaUpdateData = {
        primaryColor: updateData.primaryColor ?? undefined,
        backgroundColor: updateData.backgroundColor ?? undefined,
        textButtonColor: updateData.textButtonColor ?? undefined,
    };

    return await prisma.storeStyle.update({
        where: { id: userId },
        data: prismaUpdateData,
        select: {
            primaryColor: true,
            backgroundColor: true,
            textButtonColor: true,
        }
    });
};