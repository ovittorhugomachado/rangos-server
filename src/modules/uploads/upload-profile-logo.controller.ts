import { Request, Response } from 'express';
import { updateProfileLogoService } from './upload-profile-logo.service';
import { Prisma } from '@prisma/client';

export const updateProfileLogo = async (req: Request, res: Response): Promise<void> => {

    try {

        if (!req.file || !(req.file as any).location) {
            res.status(400).json({ error: 'File processing failed' });
            return;
        }

        const { userId, imageType } = req.params;
        const id = Number(userId);
        const imageName = req.file.originalname;

        if (!userId || isNaN(id)) {
            res.status(400).json({
                error: 'Invalid parameters',
                details: {
                    userId: userId,
                    isValid: !isNaN(id) && id > 0,
                    profileImage: imageType
                }
            });
            return
        }

        const updatedPreference = await updateProfileLogoService({
            id,
            imageType: imageType,
            imageName
        });

        res.status(200).json(updatedPreference);
    } catch (error: any) {
        console.error('Error updating profile logo:', error);

        if (error.message === 'USER_NOT_FOUND') {
            res.status(404).json({ error: 'User not found' });
        } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
            res.status(400).json({
                error: 'Database error',
                code: error.code,
                meta: error.meta
            });
        } else {
            res.status(500).json({ error: 'Failed to update profile logo' });
        }
    }
};