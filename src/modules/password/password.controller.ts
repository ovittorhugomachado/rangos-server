import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { NotFoundError } from '../../utils/errors';
import {
    generateResetTokenService,
    validateTokenService,
    resetPasswordService,
    passwordResetEmailService
} from './password.service';


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
            return res.status(error.statusCode).json({ success: false, message: error.message });
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

    } catch (error: any) {

        console.error('Erro na criação da nova senha:', error);
                
        if (error instanceof NotFoundError) {
            return res.status(error.statusCode).json({ success: false, message: error.message });
        }

        return res.status(500).json({
            success: false,
            message: error.message || "Erro interno no servidor"
        });
    }
};

export const validateToken = async (req: Request, res: Response) => {

    const { token } = req.params;

    try {

        await validateTokenService(token);

        return res.status(200).json({ message: 'Token válido' });

    } catch (error: any) {

        console.error('Erro na validação do token:', error);
                
        if (error instanceof NotFoundError) {
            return res.status(error.statusCode).json({ success: false, message: error.message });
        }

        return res.status(500).json({
            success: false,
            message: error.message || "Erro interno no servidor"
        });
    }
};