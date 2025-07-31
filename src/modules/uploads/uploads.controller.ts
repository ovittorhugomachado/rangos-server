import { Request, Response } from 'express';
import { handleControllerError } from '../../utils/errors';
import {
    profileBannerUpdateService,
    profileLogoUpdateService,
    menuItemImageUpdateService
} from './uploads.service';

export const updateProfileLogo = async (req: Request, res: Response): Promise<void> => {

    try {

        const fileUrl = (req.file as any).location || req.file?.path;
        if (!req.file || !fileUrl) {
            console.log('Arquivo recebido (logo):', req.file);
            res.status(400).json({ error: 'Erro no processamento do arquivo' });
            return;
        }

        const userId = Number(req.user?.userId);

        await profileLogoUpdateService(userId, fileUrl);

        res.status(200).json({ message: 'Logo atualizada com sucesso' });

    } catch (error: any) {

        handleControllerError(res, error);

    }
};

export const updateProfileBanner = async (req: Request, res: Response): Promise<void> => {
    try {
        const fileUrl = (req.file as any).location || req.file?.path;
        if (!req.file || !fileUrl) {
            console.log('Arquivo recebido (banner):', req.file);
            res.status(400).json({ error: 'Erro no processamento do arquivo' });
            return;
        }

        const userId = Number(req.user?.userId);

        await profileBannerUpdateService(userId, fileUrl);

        res.status(200).json({ message: 'Banner atualizado com sucesso' });
    } catch (error: any) {
        handleControllerError(res, error);
    }
};

export const updateMenuItemImage = async (req: Request, res: Response): Promise<void> => {
    try {
        const fileUrl = (req.file as any).location || req.file?.path;
        if (!req.file || !fileUrl) {
            console.log('Arquivo recebido (menu item):', req.file);
            res.status(400).json({ error: 'Erro no processamento do arquivo' });
            return;
        }

        const userId = Number(req.user?.userId);
        const categoryId = Number(req.params.categoryId);
        const itemId = Number(req.params.menuItemId);

        if (isNaN(userId) || isNaN(categoryId) || isNaN(itemId)) {
            res.status(404).json({
                error: 'Parâmetros inválidos',
                details: {
                    userId: userId,
                    isValid: !isNaN(userId) && userId > 0,
                }
            });
            return
        }

        await menuItemImageUpdateService(userId, categoryId, itemId, fileUrl);

        res.status(200).json({ message: 'imagem do produto atualizada com sucesso' });
    } catch (error: any) {
        handleControllerError(res, error);
    }
};