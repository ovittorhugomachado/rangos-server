import { Request, Response } from 'express';
import { ProfileBannerUpdateService, ProfileLogoUpdateService } from './upload-profile-logo.service';

export const updateProfileLogo = async (req: Request, res: Response): Promise<void> => {

    try {

        if (!req.file || !(req.file as any).location) {
            res.status(400).json({ error: 'Erro no processamento do arquivo' });
            return;
        }

        const userId = Number(req.user?.userId);

        await ProfileLogoUpdateService(userId, (req.file as any).location);

        res.status(200).json({ message: 'Logo atualizado com sucesso' });

    } catch (error) {
        console.error('Erro atualizar imagem:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Erro desconhecido"
        });
    }
};

export const updateProfileBanner = async (req: Request, res: Response): Promise<void> => {

    try {

        if (!req.file || !(req.file as any).location) {
            res.status(400).json({ error: 'Erro no processamento do arquivo' });
            return;
        }

        const userId = Number(req.user?.userId);

        await ProfileBannerUpdateService(userId, (req.file as any).location);

        res.status(200).json({ message: 'Banner atualizada com sucesso' });

    } catch (error) {
        console.error('Erro atualizar imagem:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Erro desconhecido"
        });
    }
};

export const updateProductImage = async (req: Request, res: Response): Promise<void> => {

    try {

        if (!req.file || !(req.file as any).location) {
            res.status(400).json({ error: 'Erro no processamento do arquivo' });
            return;
        }

        const userId = Number(req.user?.userId);
        const itemId = Number(req.params.id);
        const { categoryId } = req.params;
        const id = Number(userId);

        if (!userId || isNaN(id)) {
            res.status(400).json({
                error: 'Parâmetros inválidos',
                details: {
                    userId: userId,
                    isValid: !isNaN(id) && id > 0,
                }
            });
            return
        }

        await ProfileBannerUpdateService(id, (req.file as any).location);

        res.status(200).json({ message: 'Banner atualizada com sucesso' });

    } catch (error) {
        console.error('Erro atualizar imagem:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Erro desconhecido"
        });
    }
};