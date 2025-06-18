import { Request, Response } from 'express';
import { handleControllerError } from '../../utils/errors';
import {
    profileBannerUpdateService,
    profileLogoUpdateService,
    menuItemImageUpdateService
} from './uploads.service';

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

        handleControllerError(res, error);
        
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

    } catch (error: any) {

        handleControllerError(res, error);
        
    }
};

export const updateMenuItemImage = async (req: Request, res: Response): Promise<void> => {

    try {

        if (!req.file || !(req.file as any).location) {
            res.status(400).json({ error: 'Erro no processamento do arquivo' });
            return;
        }

        const userId = Number(req.user?.userId);
        const categoryId = Number(req.params.categoryId);
        const itemId = Number(req.params.menuItemId);

        if (isNaN(userId) || isNaN(categoryId) || isNaN(itemId)) {
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

    } catch (error: any) {

        handleControllerError(res, error);

    }
};