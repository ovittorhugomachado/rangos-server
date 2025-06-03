import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

interface AccountData {
    id: number;
    imageType: string,
    imageName: string;
}

export const updateProfileLogoService = async (data: AccountData) => {
    const { id, imageType, imageName } = data;

    const imageExtension = imageName.split('.').pop();

    if (!imageExtension) throw new Error('Extensão da imagem não encontrada');

    try {

        if (!process.env.AWS_BUCKET_NAME || !process.env.AWS_DEFAULT_REGION) {
            throw new Error('Variáveis AWS não configuradas');
        }
        return await prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({
                where: { id }
            });

            if (!user) throw new Error('USER_NOT_FOUND');

            const baseUrl = `https://S3.${process.env.AWS_DEFAULT_REGION}.amazonaws.com/${process.env.AWS_BUCKET_NAME}`;

            return await prisma.store.update({
                where: { id },
                data: {
                    logoUrl: `${baseUrl}/${id}-${imageType}.${imageExtension}`,
                },
            });
        });
    } catch (error) {
        console.error('Service error:', error);
        throw error;
    }
};