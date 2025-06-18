import { Router } from 'express';
import { requestPasswordReset, resetPassword, validateToken } from './password.controller';

const router = Router();

router.post('/recover-password', requestPasswordReset);

router.patch('/create-new-password/:token', resetPassword);

router.get('/validate-token/:token', validateToken);

export default router ;