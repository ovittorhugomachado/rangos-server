import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';
import { Request } from 'express';
import { FileFilterCallback } from 'multer';

type StorageType = 'local' | 's3';
type StorageConfig = {
    local: multer.StorageEngine;
    s3: multer.StorageEngine;
};

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

const storageTypes: StorageConfig = {
    local: multer.diskStorage({
        destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
            cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'));
        },
        filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) return cb(err, "");

                const ext = path.extname(file.originalname);

                const { userId, profileImage } = req.params

                file.filename = `${userId}-${profileImage}${ext}`;
                cb(null, file.filename);
            });
        }
    }),
    s3: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME || '',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req: Request, file: Express.Multer.File, cb: (error: Error | null, key: string) => void) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) return cb(err, "");

                const { userId, imageType } = req.params

                console.log(imageType)

                const ext = path.extname(file.originalname);

                const fileNameInS3 = `${userId}-${imageType}${ext}`;
                cb(null, fileNameInS3);
            });
        }
    })
};

const multerConfig = {
    dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    storage: storageTypes[process.env.STORAGE_TYPE as StorageType] || storageTypes.local,
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

const upload = multer(multerConfig);

export { upload, s3, multerConfig };