import { Router } from 'express';
import { signUp, login } from '../controllers/login-and-signup.controller';

const router = Router();

router.post('/signup', (req, res, next) => {
    signUp(req, res).catch(next);
});

router.post('/login', (req, res, next) => {
    login(req, res).catch(next);
});

export default router;