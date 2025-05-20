import { Router } from 'express';
import {
    requestPasswordReset,
    resetPassword,
    validateToken
} from '../controllers/reset-password.controller';

const router = Router();

router.post('/recover-password', (req, res, next) => {
    requestPasswordReset(req, res).catch(next)
});

router.patch('/create-new-password/:token', (req, res, next) => {
    resetPassword(req, res).catch(next)
});

router.get('/validate-token/:token', (req, res, next) => {
    validateToken(req, res).catch(next)
});

export default router ;