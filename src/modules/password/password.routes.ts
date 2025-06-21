import { Router } from 'express';
import { requestPasswordReset, resetPassword } from './password.controller';

const router = Router();

router.post('/recover-password', requestPasswordReset);

router.patch('/create-new-password/:token', resetPassword);


export default router ;