import express from 'express';
import { updateProfileLogo } from '../controllers/upload-files.controller';
import { upload } from '../config/multer.config';
import { authenticateToken } from '../middlewares/authenticate-token.middleware';

const router = express.Router();

router.patch(
    '/users/:userId/:profileImage',
    authenticateToken,
    upload.single('logo'),
    updateProfileLogo);

export default router