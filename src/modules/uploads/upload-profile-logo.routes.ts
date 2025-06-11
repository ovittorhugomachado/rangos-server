import express from 'express';
import { updateMenuItemImage, updateProfileBanner, updateProfileLogo } from './upload-profile-logo.controller';
import { uploadBanner, uploadLogo, uploadMenuItemImage } from '../../middlewares/multer.middleware';
import { authenticateToken } from '../../middlewares/authenticate-token.middleware';

const router = express.Router();

router.patch(
    '/logo',
    authenticateToken,
    uploadLogo.single('logo'),
    updateProfileLogo
);

router.patch(
    '/banner',
    authenticateToken,
    uploadBanner.single('banner'),
    updateProfileBanner
);

router.patch(
    '/:categoryId/:menuItemId',
    authenticateToken,
    uploadMenuItemImage.single('menu-item'),
    updateMenuItemImage
);

export default router