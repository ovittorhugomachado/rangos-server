import express from 'express';
import { authenticateToken } from '../middlewares/authenticate-token.middleware';
import { getStoreCustomization } from '../controllers/store-customization.controller';

const router = express.Router();

router.get(
    '/:userId/store-customization',
    authenticateToken,
    getStoreCustomization
);

export default router;