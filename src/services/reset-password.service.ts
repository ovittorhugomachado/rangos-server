import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { PrismaClient } from '../../node_modules/.prisma/client/index';
import { transporter } from '../utils/email';

const prisma = new PrismaClient()

export const generateResetTokenService = async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('USER_NOT_FOUND');

    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 3600000); // 1h

    await prisma.passwordResetToken.create({
        data: { token, userId: user.id, expiresAt }
    });

    return { token, userId: user.id };
};

export const sendResetEmailService = async (email: string, token: string, restaurantName?: string) => {
    
    const resetLink = `http://localhost:5173/create-new-password/${token}`;

    await transporter.sendMail({
        from: '"Rangos" <' + process.env.EMAIL_USER + '>',
        to: email,
        subject: 'Recuperação de senha',
        html: `
            <p>Olá <strong>${restaurantName}</strong>,</p>
            <p>Recebemos uma solicitação de redefinição de senha, clique no link abaixo para criar uma nova senha</p>
            <a href="${resetLink}">Redefinir senha</a>
            <br>
            <p>Se você não solicitou uma nova senha desconsidere o email.</p>
            <p>Caso precise de ajuda é só entrar em contato conosco respondendo esse email</p>
            <br>
            <p>Atenciosamente,</p>
            <p><strong>Equipe Rangos</strong></p>
            `
    });
};

export const validateTokenService = async (token: string) => {
    const tokenData = await prisma.passwordResetToken.findFirst({ where: { token } });
    if (!tokenData || tokenData.expiresAt < new Date()) throw new Error('INVALID_OR_EXPIRED_TOKEN');
};

export const resetPasswordService = async (token: string, newPassword: string) => {
    const tokenRecord = await prisma.passwordResetToken.findUnique({
        where: { token },
        include: { user: true }
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) throw new Error('INVALID_OR_EXPIRED_TOKEN');

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { id: tokenRecord.userId },
        data: { password: hashedPassword }
    });

    await prisma.passwordResetToken.delete({ where: { token } });
};

export const cleanExpiredTokens = async (prisma: PrismaClient) => {
    try {
        const result = await prisma.passwordResetToken.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date()
                }
            }
        });

        console.log(`[CRON] Tokens expirados removidos: ${result.count}`);
    } catch (error) {
        console.error('[CRON] Erro ao limpar tokens expirados:', error);
    }
};