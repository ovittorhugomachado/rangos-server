import { Request, Response } from 'express';
import { serviceDeleteUser, serviceGetUserData, userDataUpdateService } from './user.service';
import { Prisma } from '@prisma/client';

interface UserRequest extends Request {
    user?: { userId: number };
    body: {
        restaurantName?: string;
        phoneNumber?: string;
        email?: string;
        cnpj?: string;
        ownersName?: string;
        cpf?: string;
    }
}

export const getUserData = async (req: UserRequest, res: Response) => {

    const userId = Number(req.user?.userId);

    try {

        const user = await serviceGetUserData(userId);
        return res.status(200).json(user);

    } catch (error: any) {

        if (error.message === 'USER_NOT_FOUND') {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        console.error('[ERRO /me]', error);
        return res.status(500).json({ message: 'Erro ao buscar dados do usuário' });
    }
};

export const updateUserData = async (req: UserRequest, res: Response) => {

    const userId = Number(req.user?.userId);
    const updateData = req.body;

    const allowedFields = ['restaurantName', 'phoneNumber', 'email', 'cnpj', 'ownersName', 'cpf'];
    const isValidUpdate = Object.keys(updateData).every(key => allowedFields.includes(key));

    if (!isValidUpdate) {
        throw new Error('DADOS_INVALIDOS');
    }

    try {

        await userDataUpdateService(userId, updateData)
        return res.status(200).json({ message: 'Dados atualizados com sucesso' })

    } catch (error: any) {

        switch (error.message) {
            case 'ID_INVALIDO':
                return res.status(400).json({ message: 'ID do usuário inválido' });
            case 'DADOS_ATUALIZACAO_VAZIOS':
                return res.status(400).json({ message: 'Nenhum dado fornecido para atualização' });
            case 'USUARIO_NAO_ENCONTRADO':
                return res.status(404).json({ message: 'Usuário não encontrado' });
            default:
                console.error('[ERRO] updateUserProfile:', error);
                return res.status(500).json({ message: 'Erro deletar usuário' });
        }
    }
}

export const deleteUser = async (req: UserRequest, res: Response) => {

    const userId = Number(req.user?.userId);

    try {

        await serviceDeleteUser(userId)
        return res.status(200).json({ message: 'Usuário deletado com sucesso' })

    } catch (error: any) {

        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new Error('USER_NOT_FOUND');
        }
        throw error;
    }
}