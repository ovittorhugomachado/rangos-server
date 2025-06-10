import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export const ProfileLogoUpdateService = async (id: number, imageName: string) => {

    const imageExtension = imageName.split('.').pop();

    if (!imageExtension) throw new Error('Extensão da imagem não encontrada');

    if (!process.env.AWS_BUCKET_NAME || !process.env.AWS_DEFAULT_REGION) {
        throw new Error('Variáveis AWS não configuradas');
    }
    return await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
            where: { id }
        });

        if (!user) throw new Error('Usuário não encontrado');

        const baseUrl = `https://s3.${process.env.AWS_DEFAULT_REGION}.amazonaws.com/${process.env.AWS_BUCKET_NAME}`;

        return await prisma.store.update({
            where: { id },
            data: {
                logoUrl: `${baseUrl}/${id}-logo.${imageExtension}`,
            },
        });
    });
};

export const ProfileBannerUpdateService = async (id: number, imageName: string) => {

    const imageExtension = imageName.split('.').pop();

    if (!imageExtension) throw new Error('Extensão da imagem não encontrada');

    if (!process.env.AWS_BUCKET_NAME || !process.env.AWS_DEFAULT_REGION) {
        throw new Error('Variáveis AWS não configuradas');
    }
    return await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
            where: { id }
        });

        if (!user) throw new Error('Usuário não encontrado');

        const baseUrl = `https://s3.${process.env.AWS_DEFAULT_REGION}.amazonaws.com/${process.env.AWS_BUCKET_NAME}`;

        return await prisma.store.update({
            where: { id },
            data: {
                bannerUrl: `${baseUrl}/${id}-banner.${imageExtension}`,
            },
        });
    });
};