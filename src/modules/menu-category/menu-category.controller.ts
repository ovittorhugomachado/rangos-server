import { Request, Response } from "express"
import { createCategoryMenuService, menuCategoryUpdateService } from "./menu-category.service";

export const controllerCreateMenuCategory = async (req: Request, res: Response) => {

    const userId = Number(req.user?.userId);
    const { name } = req.body;

    if (!userId) {
        return res.status(401).json({ message: 'Erro na validação do usuário' })
    };

    if (!name || typeof name !== 'string') {
        return res.status(400).json({ message: 'Nome da categoria é obrigatório' })
    };

    try {

        const newCategory = await createCategoryMenuService(userId, name);
        res.status(201).json(newCategory);

    } catch (error) {
        console.error('Erro ao criar nova categoria:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Erro desconhecido"
        });
    };
};

export const controllerUpdateMenuCategory = async (req: Request, res: Response) => {

    const userId = Number(req.user?.userId);
    const categoryId = Number(req.params.id);
    const { newName } = req.body;

    if (!userId) {
        return res.status(401).json({ message: 'Erro na validação do usuário' });
    };

    if (!newName || typeof newName !== 'string') {
        return res.status(400).json({ message: 'Nome da categoria é obrigatório' });
    };

    try {

        const updatedCategory = await menuCategoryUpdateService(userId, categoryId, newName)
        res.status(200).json(updatedCategory)

    } catch (error) {
        console.error('Erro ao atualizar categoria:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Erro desconhecido"
        });
    };
}