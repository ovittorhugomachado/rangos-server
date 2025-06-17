import { Router } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { requestPasswordReset, resetPassword, validateToken } from './password.controller';

const router = Router();

router.post('/recover-password', asyncHandler(requestPasswordReset));

router.patch('/create-new-password/:token', asyncHandler(resetPassword));

router.get('/validate-token/:token', asyncHandler(validateToken));

export default router ;