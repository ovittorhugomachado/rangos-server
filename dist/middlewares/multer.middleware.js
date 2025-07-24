"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3 = exports.uploadMenuItemImage = exports.uploadBanner = exports.uploadLogo = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const client_s3_1 = require("@aws-sdk/client-s3");
if (!process.env.AWS_BUCKET_NAME) {
    throw new Error('AWS_BUCKET_NAME não definido');
}
const s3Config = {
    region: process.env.AWS_DEFAULT_REGION,
    forcePathStyle: true,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
};
const s3 = new client_s3_1.S3Client(s3Config);
exports.s3 = s3;
const createStorage = (imageCategory) => {
    return {
        local: multer_1.default.diskStorage({
            destination: (req, file, cb) => {
                cb(null, path_1.default.resolve(__dirname, '..', '..', 'tmp', 'uploads'));
            },
            filename: (req, file, cb) => {
                var _a;
                const ext = path_1.default.extname(file.originalname);
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const fileName = `store${userId}/${imageCategory}${ext}`;
                cb(null, fileName);
            }
        }),
        s3: (0, multer_s3_1.default)({
            s3: s3,
            bucket: process.env.AWS_BUCKET_NAME || '',
            contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
            key: (req, file, cb) => {
                var _a;
                const ext = path_1.default.extname(file.originalname);
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const fileNameInS3 = `store${userId}/${imageCategory}${ext}`;
                cb(null, fileNameInS3);
            }
        })
    };
};
const createMenuItemStorage = () => {
    return {
        local: multer_1.default.diskStorage({
            destination: (req, file, cb) => {
                cb(null, path_1.default.resolve(__dirname, '..', '..', 'tmp', 'uploads', 'products'));
            },
            filename: (req, file, cb) => {
                var _a;
                const ext = path_1.default.extname(file.originalname);
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const { categoryId, menuItemId } = req.params;
                const fileName = `store${userId}/category${categoryId}/product${menuItemId}${ext}`;
                cb(null, fileName);
            }
        }),
        s3: (0, multer_s3_1.default)({
            s3: s3,
            bucket: process.env.AWS_BUCKET_NAME || '',
            contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
            key: (req, file, cb) => {
                var _a;
                const ext = path_1.default.extname(file.originalname);
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const { categoryId, menuItemId } = req.params;
                const fileNameInS3 = `store${userId}/category${categoryId}/product${menuItemId}${ext}`;
                cb(null, fileNameInS3);
            }
        })
    };
};
const multerConfig = {
    dest: path_1.default.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpeg',
            'image/pjpeg',
            'image/png',
            'image/gif',
            'image/webp',
        ];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Tipo de arquivo inválido.'));
        }
    }
};
const logoStorage = createStorage('logo');
const bannerStorage = createStorage('banner');
const menuItemStorage = createMenuItemStorage();
const uploadLogo = (0, multer_1.default)(Object.assign(Object.assign({}, multerConfig), { storage: logoStorage[process.env.STORAGE_TYPE] || logoStorage.local }));
exports.uploadLogo = uploadLogo;
const uploadBanner = (0, multer_1.default)(Object.assign(Object.assign({}, multerConfig), { storage: bannerStorage[process.env.STORAGE_TYPE] || bannerStorage.local }));
exports.uploadBanner = uploadBanner;
const uploadMenuItemImage = (0, multer_1.default)(Object.assign(Object.assign({}, multerConfig), { storage: menuItemStorage[process.env.STORAGE_TYPE] || menuItemStorage.local }));
exports.uploadMenuItemImage = uploadMenuItemImage;
