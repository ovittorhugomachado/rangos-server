import { Request, Response } from "express"
import { createMenuCategoryService } from "./menu-category.service";

export const createMenuCategory = async (req: Request, res: Response) => {

    const userId = Number(req.user?.userId);
    const { name } = req.body;

    if (!userId) {
        return res.status(401).json({ message: 'Erro na validação do usuário' })
    };

    try {
        await createMenuCategoryService(userId, name)
    } catch (error) {
        console.error('Erro ao criar nova categoria:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Erro desconhecido"
        });
    };

}