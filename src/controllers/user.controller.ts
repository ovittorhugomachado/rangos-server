import { Request, Response } from 'express';
import { getUserDataService } from '../services/user.service';

export const getUserProfile = async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;

    try {
        const user = await getUserDataService(userId);
        return res.status(200).json(user);
    } catch (error: any) {
        if (error.message === 'USER_NOT_FOUND') {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        console.error('[ERRO /me]', error);
        return res.status(500).json({ message: 'Erro ao buscar dados do usuário' });
    }
};