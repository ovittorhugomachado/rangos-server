import { Request, Response } from 'express';
import { serviceDeleteUser, serviceGetUserData, userDataUpdateService } from './user.service';
import { AppError, handleControllerError } from '../../utils/errors';

export const getUserData = async (req: Request, res: Response): Promise<void> => {

    const userId = Number(req.user?.userId);

    try {

        const user = await serviceGetUserData(userId);

        res.status(200).json(user);
        return

    } catch (error: any) {

        handleControllerError(res, error);

    }
};

export const updateUserData = async (req: Request, res: Response): Promise<void> => {
    
    try {

        const userId = Number(req.user?.userId);

        const updateData = req.body;

        const allowedFields = ['restaurantName', 'phoneNumber', 'email', 'cnpj', 'ownersName', 'cpf'];
        
        const isValidUpdate = Object.keys(updateData).every(key => allowedFields.includes(key));
        if (!isValidUpdate) {
            throw new AppError('Dados inválidos');
        }

        await userDataUpdateService(userId, updateData);

        res.status(200).json({ message: 'Dados atualizados com sucesso' });
        return

    } catch (error: any) {

        handleControllerError(res, error);

    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {

    const userId = Number(req.user?.userId);

    try {

        await serviceDeleteUser(userId);

        res.status(200).json({ message: 'Usuário deletado com sucesso' });
        return

    } catch (error: any) {

        handleControllerError(res, error);

    }
};