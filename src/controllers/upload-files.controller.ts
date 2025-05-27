import { Request, Response } from 'express';
import { updateProfileLogoService } from '../services/upload-files.service';
import { Prisma } from '@prisma/client';

export const updateProfileLogo = async (req: Request, res: Response): Promise<void> => {

    try {

        if (!req.file || !(req.file as any).location) { 
            res.status(400).json({ error: 'File processing failed' });
            return;
        }

        const { userId, profileImage } = req.params;
    
        const id = Number(userId);

        if (!userId || isNaN(id)) {
            res.status(400).json({ error: 'Invalid user ID' });
            return;
        }

        const updatedPreference = await updateProfileLogoService({
            id,
            imageType: profileImage
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
            res.status(500).json({
                error: 'Failed to update profile logo',
                details: error.message
            });
        }
    }
};