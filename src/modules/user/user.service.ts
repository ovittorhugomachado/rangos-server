import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface UserProfileData {
    restaurantName: string | null;
    phoneNumber: string | null;
    email: string;
    cnpj: string | null;
    ownersName: string | null;
    cpf: string | null;
};

interface UpdateUserData {
    restaurantName?: string;
    phoneNumber?: string;
    email?: string;
    cnpj?: string;
    ownersName?: string;
    cpf?: string;
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
        throw new Error('USER_NOT_FOUND');
    }

    return user;
};

export const userDataUpdateService = async (userId: number, updateData: UpdateUserData): Promise<UserProfileData> => {

    if (!userId || isNaN(userId)) {
        throw new Error('ID_INVALIDO');
    };

    if (Object.keys(updateData).length === 0) {
        throw new Error('DADOS_ATUALIZACAO_VAZIOS');
    };

    return await prisma.user.update({
        where: { id: userId },
        data: updateData,
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
        throw new Error('ID_INVALIDO');
    }

    const user = await prisma.user.delete({
        where: { id: userId },
    })

    if (!user) {
        throw new Error('USER_NOT_FOUND');
    }
};