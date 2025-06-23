import { Request, Response } from "express";
import { createMenuItemService, deleteMenuItemService, menuItemStatusToggleService, menuItemUpdateService } from "./menu-item.service";
import { handleControllerError } from "../../../utils/errors";

export const createMenuItem = async (req: Request, res: Response): Promise<void> => {

    const userId = Number(req.user?.userId);
    const categoryId = Number(req.params.categoryId);
    const { name, description, price, optionGroups } = req.body;

    if (!userId) {
        res.status(401).json({ message: 'Erro na validação do usuário' });
        return
    };

    if (!name || !description || !price || !categoryId) {
        res.status(400).json({ message: 'Dados obrigatórios ausentes' });
        return
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

        res.status(201).json({ success: true, data: newItem })


    } catch (error: any) {

        handleControllerError(res, error);

    }
};

export const updateMenuItem = async (req: Request, res: Response): Promise<void> => {

    const userId = Number(req.user?.userId);
    const categoryId = Number(req.params.categoryId);
    const itemId = Number(req.params.itemId);
    const { name, description, price } = req.body;

    if (!userId) {
        res.status(401).json({ success: false, message: 'Usuário não autenticado' });
        return
    };

    if (!itemId || isNaN(itemId)) {
        res.status(400).json({ success: false, message: 'ID do item inválido' });
        return
    };

    if (name && typeof name !== 'string') {
        res.status(400).json({ success: false, message: 'Nome deve ser uma string' });
        return
    };

    if (description && typeof description !== 'string') {
        res.status(400).json({ success: false, message: 'Descrição deve ser uma string' });
        return
    };

    if (price && (typeof price !== 'number' || price <= 0)) {
        res.status(400).json({ success: false, message: 'Preço deve ser um número positivo' });
        return
    };

    if (categoryId && (typeof categoryId !== 'number' || categoryId <= 0)) {
        res.status(400).json({ success: false, message: 'ID da categoria inválido' });
        return
    };

    try {
        const updatedItem = await menuItemUpdateService(
            userId,
            categoryId,
            itemId,
            { name, description, price }
        );

        if (!updatedItem) {
            res.status(404).json({ success: false, message: 'Item não encontrado' });
            return
        };

        res.status(200).json({ success: true, data: updatedItem });
        return

    } catch (error: any) {

        handleControllerError(res, error);

    }
};

export const toggleMenuItemStatus = async (req: Request, res: Response): Promise<void> => {

    const userId = Number(req.user?.userId);
    const categoryId = Number(req.params.categoryId);
    const itemId = Number(req.params.itemId);

    if (!userId) {
        res.status(401).json({ success: false, message: 'Usuário não autenticado' });
        return
    };

    if (!categoryId || isNaN(categoryId)) {
        res.status(400).json({ success: false, message: 'ID da categoria inválido' });
        return
    };

    if (!itemId || isNaN(itemId)) {
        res.status(400).json({ success: false, message: 'ID do item inválido' });
        return
    };

    try {

        await menuItemStatusToggleService(userId, itemId);

        res.status(200).json({ success: true, message: 'Status atualizado com sucesso' })

    } catch (error: any) {

        handleControllerError(res, error);

    }
};

export const deleteMenuItem = async (req: Request, res: Response): Promise<void> => {

    const userId = Number(req.user?.userId);
    const itemId = Number(req.params.itemId);

    if (!userId) {
        res.status(401).json({ success: false, message: 'Usuário não autenticado' });
        return
    };

    if (!itemId || isNaN(itemId)) {
        res.status(400).json({ success: false, message: 'ID do item inválido' });
        return
    };

    try {
        await deleteMenuItemService(userId, itemId);

        res.status(200).json({ success: true, message: 'ítem deletado com sucesso' })

    } catch (error: any) {

        handleControllerError(res, error);

    }
};