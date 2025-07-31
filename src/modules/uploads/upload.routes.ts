import express from 'express';
import { updateMenuItemImage, updateProfileBanner, updateProfileLogo } from './uploads.controller';
import { uploadBanner, uploadLogo, uploadMenuItemImage } from '../../middlewares/multer.middleware';
import { authenticateToken } from '../../middlewares/authenticate-token.middleware';
import { multerErrorHandler } from '../../middlewares/multer-error.middleware';

const router = express.Router();

router.patch(
    '/logo',
    authenticateToken,
    (req, res, next) => uploadLogo.single('logo')(req, res, (err) => multerErrorHandler(err, req, res, next)),
    updateProfileLogo
);

router.patch(
    '/banner',
    authenticateToken,
    (req, res, next) => uploadBanner.single('banner')(req, res, (err) => multerErrorHandler(err, req, res, next)),
    updateProfileBanner
);

router.patch(
    '/:categoryId/:menuItemId',
    authenticateToken,
    (req, res, next) => uploadMenuItemImage.single('menu-item')(req, res, (err) => multerErrorHandler(err, req, res, next)),
    updateMenuItemImage
);

export default router