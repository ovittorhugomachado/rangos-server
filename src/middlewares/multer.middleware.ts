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
                const fileName = `${userId}-${imageCategory}${ext}`;
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
                const fileNameInS3 = `${userId}-${imageCategory}${ext}`;
                cb(null, fileNameInS3);
            }
        })
    };
};

const createProductStorage = () => {
    return {
        local: multer.diskStorage({
            destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
                cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads', 'products'));
            },
            filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
                const ext = path.extname(file.originalname);
                const { storeId, categoryId } = req.params;
                const productName = req.body.name || 'product'; 

                const sanitizedProductName = productName
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^\w-]+/g, '');

                const fileName = `${storeId}/${categoryId}/${sanitizedProductName}${ext}`;
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
                const storeId = userId;
                const { categoryId } = req.params;
                const productName = req.body.name || 'product';

                const sanitizedProductName = productName
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^\w-]+/g, '');

                const fileNameInS3 = `${storeId}/${categoryId}/${sanitizedProductName}${ext}`;
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
const productStorage = createProductStorage();

const uploadLogo = multer({
    ...multerConfig,
    storage: logoStorage[process.env.STORAGE_TYPE as StorageType] || logoStorage.local
});

const uploadBanner = multer({
    ...multerConfig,
    storage: bannerStorage[process.env.STORAGE_TYPE as StorageType] || bannerStorage.local
});

const uploadProductImage = multer({
    ...multerConfig,
    storage: productStorage[process.env.STORAGE_TYPE as StorageType] || productStorage.local
});

export { uploadLogo, uploadBanner, uploadProductImage, s3 };

