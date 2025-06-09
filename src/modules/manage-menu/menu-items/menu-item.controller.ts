import { Request, Response } from "express";
import { createMenuItemService } from "./menu-item.service";

export const createMenuItem = async (req: Request, res: Response) => {

    const userId = Number(req.user?.userId);
    const { name, description, price, categoryId, optionGroups } = req.body;

    if (!userId) {
        return res.status(401).json({ message: 'Erro na validação do usuário' });
    };

    if (!name || !description || !price || !categoryId) {
        return res.status(400).json({ message: 'Dados obrigatórios ausentes' });
    };

    try {
        
        const newItem = await createMenuItemService(
            userId,
            name, 
            description,
            price,
            categoryId,
            optionGroups
        );

        res.status(201).json(newItem)


    } catch (error) {
        console.error('Erro ao criar novo ítem no menu:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Erro desconhecido"
        });
    }

}