import { Request, Response } from "express"
import {
    createCategoryMenuService,
    menuCategoryRenameService,
    serviceDeleteMenuCategory,
    serviceGetMenuCategories,
    serviceGetMyMenuCategories,
    toggleMenuCategoryService
} from "./menu-category.service";
import { handleControllerError } from "../../../utils/errors";

export const getMenuCategories = async (req: Request, res: Response): Promise<void> => {

    const storeId = Number(req.params.id);

    if (!storeId) {
        res.status(401).json({ message: 'Erro na validação da loja' });
        return
    };

    try {

        const categories = await serviceGetMenuCategories(storeId);
        res.status(200).json(categories);

    } catch (error: any) {

        handleControllerError(res, error);

    };
};

export const getMyMenuCategories = async (req: Request, res: Response): Promise<void> => {

    const userId = Number(req.user?.userId);

    if (!userId) {
        res.status(401).json({ message: 'Erro na validação do usuário' });
        return
    };

    try {

        const categories = await serviceGetMyMenuCategories(userId);
        res.status(200).json(categories);

    } catch (error: any) {

        handleControllerError(res, error);

    };
};

export const createMenuCategory = async (req: Request, res: Response): Promise<void> => {

    const userId = Number(req.user?.userId);
    const { name } = req.body;

    if (!userId) {
        res.status(401).json({ message: 'Erro na validação do usuário' });
        return
    };

    if (!name || typeof name !== 'string') {
        res.status(400).json({ message: 'Nome da categoria é obrigatório' });
        return
    };

    try {

        const newCategory = await createCategoryMenuService(userId, name);
        res.status(201).json(newCategory);

    } catch (error: any) {

        handleControllerError(res, error);

    };
};

export const renameMenuCategory = async (req: Request, res: Response): Promise<void> => {

    const userId = Number(req.user?.userId);
    const categoryId = Number(req.params.id);
    const { newName } = req.body;

    if (!userId) {
        res.status(401).json({ message: 'Erro na validação do usuário' });
        return
    };

    if (!newName || typeof newName !== 'string') {
        res.status(400).json({ message: 'Nome da categoria é obrigatório' });
        return
    };

    try {

        const updatedCategory = await menuCategoryRenameService(userId, categoryId, newName)
        res.status(200).json(updatedCategory)

    } catch (error: any) {

        handleControllerError(res, error);

    };
};

export const toggleMenuCategoryStatus = async (req: Request, res: Response): Promise<void> => {

    const userId = Number(req.user?.userId);
    const categoryId = Number(req.params.id);

    if (!userId) {
        res.status(401).json({ message: 'Erro na validação do usuário' });
        return
    };

    try {

        const updatedStatus = await toggleMenuCategoryService(userId, categoryId)
        res.status(200).json({
            success: true,
            isActive: updatedStatus.isActive
        });

    } catch (error: any) {

        handleControllerError(res, error);

    };
};

export const deleteMenuCategory = async (req: Request, res: Response): Promise<void> => {

    const userId = Number(req.user?.userId);
    const categoryId = Number(req.params.id);

    if (!userId) {
        res.status(401).json({ message: 'Erro na validação do usuário' });
        return
    };

    try {

        await serviceDeleteMenuCategory(userId, categoryId);
        res.status(200).json({ message: 'Categoria deletada com sucesso' });
        return

    } catch (error: any) {

        handleControllerError(res, error);

    };
};