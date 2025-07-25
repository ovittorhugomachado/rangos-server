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

//Services do lado do cliente
export const serviceGetStoresList = async () => {

    const stores = await prisma.store.findMany();

    return stores;
};

export const serviceGetStoreData = async (storeId: number): Promise<StoreData> => {

    const store = await prisma.store.findUnique({
        where: { id: storeId },
        select: {
            id: true,
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

export const serviceGetStoreStyleData = async (storeId: number): Promise<StoreStyleData> => {

    const storeStyle = await prisma.storeStyle.findUnique({
        where: { id: storeId },
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

//Services do lado da loja
export const serviceGetMyStoreData = async (userId: number): Promise<StoreData> => {

    const store = await prisma.store.findUnique({
        where: { userId },
        select: {
            id: true,
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

export const myStoreDataUpdateService = async (userId: number, updateData: UpdateStoreData) => {


    if (!userId || isNaN(userId)) {
        throw new NotFoundError('Usuário não encontrado');
    };

    if (Object.keys(updateData).length === 0) {
        throw new AppError('Dados de atualização vazios');
    };

    const updatedStore = await prisma.store.update({
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

    const userUpdateData: any = {};
    if (updateData.restaurantName !== undefined && updateData.restaurantName !== null) {
        userUpdateData.restaurantName = updateData.restaurantName;
    }
    if (updateData.phoneNumber !== undefined && updateData.phoneNumber !== null) {
        userUpdateData.phoneNumber = updateData.phoneNumber;
    }

    if (Object.keys(userUpdateData).length > 0) {
        await prisma.user.update({
            where: { id: userId },
            data: userUpdateData,
            select: {
                restaurantName: true,
                phoneNumber: true,
            }
        });
    };

    return updatedStore;

};

export const serviceGetMyStoreStyleData = async (userId: number): Promise<StoreStyleData> => {

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

export const myStoreStyleDataUpdateService = async (userId: number, updateData: StoreStyleData) => {

    if (!userId || isNaN(userId)) {
        throw new NotFoundError('Usuário não encontrado');
    };

    if (Object.keys(updateData).length === 0) {
        throw new AppError('Dados de atualização vazios');
    };

    const prismaUpdateData: any = {
        ...(updateData.primaryColor !== undefined && { primaryColor: { set: updateData.primaryColor } }),
        ...(updateData.backgroundColor !== undefined && { backgroundColor: { set: updateData.backgroundColor } }),
        ...(updateData.textButtonColor !== undefined && { textButtonColor: { set: updateData.textButtonColor } }),
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