import { Router } from 'express';
import { signUp, login } from '../controllers/auth.controller';

const router = Router();

router.post('/signup', (req, res, next) => {
    signUp(req, res).catch(next);
});

router.post('/login', (req, res, next) => {
    login(req, res).catch(next);
});

export default router;


// router.post('/login', login);
// router.post('/recover-password', ...);
// router.patch('/create-new-password', ...);
// router.get('/validate-token/:token', ...);
// router.post('/categories/:token', ...);
// router.delete('/categories/:id', ...);
// router.get('/categories', ...);
// router.get('/me', ...);

