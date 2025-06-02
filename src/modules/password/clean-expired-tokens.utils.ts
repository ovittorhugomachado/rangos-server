import { PrismaClient } from '.prisma/client';

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