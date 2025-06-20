import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError, NotFoundError } from "../../utils/errors";

interface UserProfileData {
    restaurantName: string | null;
    phoneNumber: string | null;
    email: string;
    cnpj: string | null;
    ownersName: string | null;
    cpf: string | null;
};

export const serviceGetUserData = async (userId: number): Promise<UserProfileData> => {

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            restaurantName: true,
            phoneNumber: true,
            email: true,
            cnpj: true,
            ownersName: true,
            cpf: true,
        }
    });

    if (!user) {
        throw new NotFoundError('Usuário não encontrado');
    }

    return user;
};

export const userDataUpdateService = async (userId: number, updateData: UserProfileData): Promise<UserProfileData> => {

    if (!userId || isNaN(userId)) {
        throw new NotFoundError('Usuário não encontrado');
    };

    if (Object.keys(updateData).length === 0) {
        throw new AppError('Dados de atualização vazios');
    };

    const cleanData: Partial<Prisma.UserUpdateInput> = {};
    for (const key in updateData) {
        const value = updateData[key as keyof UserProfileData];
        if (value !== null && value !== undefined) {
            cleanData[key as keyof Prisma.UserUpdateInput] = value;
        }
    };

    return await prisma.user.update({
        where: { id: userId },
        data: cleanData,
        select: {
            restaurantName: true,
            phoneNumber: true,
            email: true,
            cnpj: true,
            ownersName: true,
            cpf: true,
        }
    });
};

export const serviceDeleteUser = async (userId: number) => {

    if (!userId || isNaN(userId)) {
        throw new NotFoundError('Usuário não encontrado');
    };

    const user = await prisma.user.delete({
        where: { id: userId },
    })

    if (!user) {
        throw new NotFoundError('Usuário não encontrado');
    }
};