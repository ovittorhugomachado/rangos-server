import { Router } from 'express';
import {
    createCategory,
    deleteCategory,
    getCategories
} from '../controllers/manage-menu.controller';

const router = Router();

router.post('/categories', (req, res, next) => {
    createCategory(req, res).catch(next);
});

router.delete('/categories/:id', (req, res, next) => {
    deleteCategory(req, res).catch(next);
});

router.get('/categories', (req, res, next) => {
    getCategories(req, res).catch(next);
});

export { router as manageMenuRouter };
