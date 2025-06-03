import express from 'express';
import { updateProfileLogo } from './upload-profile-logo.controller';
import { upload } from '../../config/multer.config';
import { authenticateToken } from '../../middlewares/authenticate-token.middleware';

const router = express.Router();

router.patch(
    '/:userId/:imageType',
    authenticateToken,
    upload.single('logo'),
    updateProfileLogo
);

export default router