import { Request, Response } from 'express';
import {
    createCategoryService,
    deleteCategoryService,
    getCategoriesService
} from '../services/manage-menu.service';

export const createCategory = async (req: Request, res: Response) => {
    const { name } = req.body;

    try {
        await createCategoryService(name);
        return res.status(201).json({ message: `Categoria ${name} criada com sucesso` });
    } catch (error: any) {
        const errorMap: Record<string, number> = {
            'NOME_OBRIGATORIO': 400,
            'CATEGORIA_EXISTE': 409
        };

        const status = errorMap[error.message] || 500;
        return res.status(status).json({ message: error.message });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    try {
        await deleteCategoryService(id);
        return res.status(204).send();
    } catch (error: any) {
        const errorMap: Record<string, number> = {
            'ID_INVALIDO': 400,
            'CATEGORIA_NAO_ENCONTRADA': 404
        };

        const status = errorMap[error.message] || 500;
        return res.status(status).json({ message: error.message });
    }
};

export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await getCategoriesService();
        return res.status(200).json(categories);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao buscar lista de categorias' });
    }
};