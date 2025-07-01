import multer from 'multer';
import path from 'path';
import multerS3 from 'multer-s3';
import { Request } from 'express';
import { FileFilterCallback } from 'multer';
import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';

type StorageType = 'local' | 's3';

if (!process.env.AWS_BUCKET_NAME) {
    throw new Error('AWS_BUCKET_NAME não definido');
}

const s3Config: S3ClientConfig = {
    region: process.env.AWS_DEFAULT_REGION as string,
    forcePathStyle: true,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
};

const s3 = new S3Client(s3Config);

const createStorage = (imageCategory: 'logo' | 'banner') => {
    return {
        local: multer.diskStorage({
            destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
                cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'));
            },
            filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
                const ext = path.extname(file.originalname);
                const userId = (req.user as any)?.userId;
                const fileName = `store${userId}/${imageCategory}${ext}`;
                cb(null, fileName);
            }
        }),
        s3: multerS3({
            s3: s3,
            bucket: process.env.AWS_BUCKET_NAME || '',
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: (req: Request, file: Express.Multer.File, cb: (error: Error | null, key: string) => void) => {
                const ext = path.extname(file.originalname);
                const userId = (req.user as any)?.userId;
                const fileNameInS3 = `store${userId}/${imageCategory}${ext}`;
                cb(null, fileNameInS3);
            }
        })
    };
};

const createMenuItemStorage = () => {
    return {
        local: multer.diskStorage({
            destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
                cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads', 'products'));
            },
            filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
                const ext = path.extname(file.originalname);
                const userId = (req.user as any)?.userId;
                const { categoryId, menuItemId } = req.params;
                const fileName = `store${userId}/category${categoryId}/product${menuItemId}${ext}`;
                cb(null, fileName);
            }
        }),
        s3: multerS3({
            s3: s3,
            bucket: process.env.AWS_BUCKET_NAME || '',
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: (req: Request, file: Express.Multer.File, cb: (error: Error | null, key: string) => void) => {
                const ext = path.extname(file.originalname);
                const userId = (req.user as any)?.userId;
                const { categoryId, menuItemId } = req.params;

                const fileNameInS3 = `store${userId}/category${categoryId}/product${menuItemId}${ext}`;
                cb(null, fileNameInS3);
            }
        })
    };
};

const multerConfig = {
    dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
    fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        const allowedMimes = [
            'image/jpeg',
            'image/pjpeg',
            'image/png',
            'image/gif',
            'image/webp',
        ];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Tipo de arquivo inválido.'));
        }
    }
};

const logoStorage = createStorage('logo');
const bannerStorage = createStorage('banner');
const menuItemStorage = createMenuItemStorage();

const uploadLogo = multer({
    ...multerConfig,
    storage: logoStorage[process.env.STORAGE_TYPE as StorageType] || logoStorage.local
});

const uploadBanner = multer({
    ...multerConfig,
    storage: bannerStorage[process.env.STORAGE_TYPE as StorageType] || bannerStorage.local
});

const uploadMenuItemImage = multer({
    ...multerConfig,
    storage: menuItemStorage[process.env.STORAGE_TYPE as StorageType] || menuItemStorage.local
});

export { uploadLogo, uploadBanner, uploadMenuItemImage, s3 };

