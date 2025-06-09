import { Request, Response } from "express";
import { createMenuItemService, deleteMenuItemService, menuItemStatusToggleService, menuItemUpdateService } from "./menu-item.service";

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

        res.status(201).json({ success: true, data: newItem})


    } catch (error) {
        console.error('Erro ao criar novo ítem no menu:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Erro desconhecido"
        });
    }
};

export const updateMenuItem = async (req: Request, res: Response) => {

    const userId = Number(req.user?.userId);
    const itemId = Number(req.params.id);
    const { name, description, price, categoryId } = req.body;

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Usuário não autenticado' });
    };

    if (!itemId || isNaN(itemId)) {
        return res.status(400).json({ success: false, message: 'ID do item inválido' });
    };

    if (name && typeof name !== 'string') {
        return res.status(400).json({ success: false, message: 'Nome deve ser uma string' });
    };

    if (description && typeof description !== 'string') {
        return res.status(400).json({ success: false, message: 'Descrição deve ser uma string' });
    };

    if (price && (typeof price !== 'number' || price <= 0)) {
        return res.status(400).json({ success: false, message: 'Preço deve ser um número positivo' });
    };

    if (categoryId && (typeof categoryId !== 'number' || categoryId <= 0)) {
        return res.status(400).json({ success: false, message: 'ID da categoria inválido' });
    };

    try {
        const updatedItem = await menuItemUpdateService(
            userId,
            itemId,
            { name, description, price, categoryId }
        );

        if (!updatedItem) {
            return res.status(404).json({ success: false, message: 'Item não encontrado' });
        };

        return res.status(200).json({ success: true, data: updatedItem });

    } catch (error) {
        console.error('Erro ao atualizar item:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Erro desconhecido"
        });
    }
};

export const toggleMenuItemStatus = async (req: Request, res: Response) => {

    const userId = Number(req.user?.userId);
    const itemId = Number(req.params.id);

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Usuário não autenticado' });
    };

    if (!itemId || isNaN(itemId)) {
        return res.status(400).json({ success: false, message: 'ID do item inválido' });
    };

    try {

        await menuItemStatusToggleService(userId, itemId);

        res.status(200).json({ success: true, message: 'Status atualizado com sucesso' })

    } catch (error) {
        console.error('Erro ao atualizar status do ítem:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Erro desconhecido"
        });
    }
};

export const deleteMenuItem = async (req: Request, res: Response) => {

    const userId = Number(req.user?.userId);
    const itemId = Number(req.params.id);

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Usuário não autenticado' });
    };

    if (!itemId || isNaN(itemId)) {
        return res.status(400).json({ success: false, message: 'ID do item inválido' });
    };

    try {
        await deleteMenuItemService(userId, itemId);

        res.status(200).json({ success: true, message: 'ítem deletado com sucesso'})

    } catch (error) {
        console.error('Erro ao excluir ítem:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Erro desconhecido"
        });
    }
};