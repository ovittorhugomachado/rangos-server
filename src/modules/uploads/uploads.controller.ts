import { Request, Response } from 'express';
import {
    profileBannerUpdateService,
    profileLogoUpdateService,
    menuItemImageUpdateService
} from './uploads.service';
import { AppError, NotFoundError } from '../../utils/errors';

export const updateProfileLogo = async (req: Request, res: Response): Promise<void> => {

    try {

        if (!req.file || !(req.file as any).location) {
            res.status(400).json({ error: 'Erro no processamento do arquivo' });
            return;
        }

        const userId = Number(req.user?.userId);

        await profileLogoUpdateService(userId, (req.file as any).location);

        res.status(200).json({ message: 'Logo atualizado com sucesso' });

    } catch (error: any) {

        console.error('Erro no cadastro:', error);
                
        if (error instanceof NotFoundError) {
            res.status(error.statusCode).json({ success: false, message: error.message });
            return 
        }

        if (error instanceof AppError) {
            res.status(error.statusCode).json({ success: false, message: error.message });
            return 
        }

        res.status(500).json({
            success: false,
            message: error.message || "Erro interno no servidor"
        });
        return 
    }
};

export const updateProfileBanner = async (req: Request, res: Response): Promise<void> => {

    try {

        if (!req.file || !(req.file as any).location) {
            res.status(400).json({ error: 'Erro no processamento do arquivo' });
            return;
        }

        const userId = Number(req.user?.userId);

        await profileBannerUpdateService(userId, (req.file as any).location);

        res.status(200).json({ message: 'Banner atualizada com sucesso' });

    } catch (error) {
        console.error('Erro atualizar imagem:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Erro desconhecido"
        });
    }
};

export const updateMenuItemImage = async (req: Request, res: Response): Promise<void> => {

    try {

        if (!req.file || !(req.file as any).location) {
            res.status(400).json({ error: 'Erro no processamento do arquivo' });
            return;
        }

        const userId = Number(req.user?.userId);
        const itemId = Number(req.params.menuItemId);
        const categoryId = Number(req.params.categoryId);

        if (!userId || isNaN(userId)) {
            res.status(400).json({
                error: 'Parâmetros inválidos',
                details: {
                    userId: userId,
                    isValid: !isNaN(userId) && userId > 0,
                }
            });
            return
        }

        await menuItemImageUpdateService(userId, categoryId, itemId, (req.file as any).location);

        res.status(200).json({ message: 'imagem do produto atualizada com sucesso' });

    } catch (error) {
        console.error('Erro atualizar imagem:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Erro desconhecido"
        });
    }
};