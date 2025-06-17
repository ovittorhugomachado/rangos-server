import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import {
    generateResetTokenService,
    validateTokenService,
    resetPasswordService,
    passwordResetEmailService
} from './password.service';
import { NotFoundError } from '../../utils/errors';

export const requestPasswordReset = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {

        const restaurant = await prisma.user.findFirst({
            where: { email },
            select: { restaurantName: true }
        });

        const { token } = await generateResetTokenService(email);
        await passwordResetEmailService(email, token, restaurant?.restaurantName);

        return res.status(200).json({ message: 'Um link de redefinição de senha foi enviado para seu email' });

    } catch (error: any) {

        console.error('Erro na redefinição de senha:', error);
                
        if (error instanceof NotFoundError) {
            return res.status(409).json({ success: false, message: error.message });
        }

        return res.status(500).json({
            success: false,
            message: error.message || "Erro interno no servidor"
        });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    const { newPassword } = req.body;
    const { token } = req.params;

    try {
        await resetPasswordService(token, newPassword);
        return res.status(200).json({ message: 'Senha redefinida com sucesso' });
    } catch (error) {
        if (error instanceof Error && error.message === 'INVALID_OR_EXPIRED_TOKEN') {
            return res.status(400).json({ message: 'Link inválido ou expirado' });
        }
        console.error('[ERRO]', error);
        return res.status(500).json({ message: 'Erro ao criar nova senha' });
    }
};

export const validateToken = async (req: Request, res: Response) => {
    const { token } = req.params;

    try {
        await validateTokenService(token);
        return res.status(200).json({ message: 'Token válido' });
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido ou expirado' });
    }
};