import { Request, Response } from "express";
import { serviceGetMyStoreData, serviceGetStoresList, serviceGetMyStoreStyleData, myStoreDataUpdateService, myStoreStyleDataUpdateService, serviceGetStoreData, serviceGetStoreStyleData } from "./store.service";
import { AppError, handleControllerError } from "../../utils/errors";

//Controller do lado do cliente
export const getStoreList = async (req: Request, res: Response): Promise<void> => {
    try {

        const stores = await serviceGetStoresList();;

        res.status(200).json(stores);
        return;

    } catch (error: any) {

        handleControllerError(res, error);

    }
};

export const getStoreData = async (req: Request, res: Response): Promise<void> => {

    const storeId = Number(req.params.id);

    try {

        const store = await serviceGetStoreData(storeId);

        res.status(200).json(store);
        return 

    } catch (error: any) {

        handleControllerError(res, error);

    }
};

export const getStoreStyleData = async (req: Request, res: Response): Promise<void> => {

    const storeId = Number(req.params.id);

    try {

        const store = await serviceGetStoreStyleData(storeId);

        res.status(200).json(store);
        return 

    } catch (error: any) {

        handleControllerError(res, error);

    }
};

//Controller do lado da loja
export const getMyStoreData = async (req: Request, res: Response): Promise<void> => {

    const userId = Number(req.user?.userId);

    try {

        const store = await serviceGetMyStoreData(userId);

        res.status(200).json(store);
        return 

    } catch (error: any) {

        handleControllerError(res, error);

    }
};

export const updateMyStoreData = async (req: Request, res: Response): Promise<void> => {

    try {

        const userId = Number(req.user?.userId);

        const updateData = req.body;

        const allowedFields = ['restaurantName', 'phoneNumber', 'address', 'logoUrl', 'delivery', 'pickup'];

        const isValidUpdate = Object.keys(updateData).every(key => allowedFields.includes(key));
        if (!isValidUpdate) {
            throw new AppError('Dados inválidos');
        };



        await myStoreDataUpdateService(userId, updateData);

        res.status(200).json({ message: 'Dados atualizados com sucesso' });
        return 

    } catch (error: any) {

        handleControllerError(res, error);

    }
};

export const getMyStoreStyleData = async (req: Request, res: Response): Promise<void> => {

    const userId = Number(req.user?.userId);

    try {

        const store = await serviceGetMyStoreStyleData(userId);

        res.status(200).json(store);
        return 

    } catch (error: any) {

        handleControllerError(res, error);

    }
};

export const updateMyStoreStyleData = async (req: Request, res: Response): Promise<void> => {

    try {

        const userId = Number(req.user?.userId);

        const updateData = req.body;

        const allowedFields = ['primaryColor', 'backgroundColor', 'textButtonColor'];

        const isValidUpdate = Object.keys(updateData).every(key => allowedFields.includes(key));
        if (!isValidUpdate) {
            throw new AppError('Dados inválidos');
        };

        await myStoreStyleDataUpdateService(userId, updateData);

        res.status(200).json({ message: 'Dados atualizados com sucesso' });
        return 

    } catch (error: any) {

        handleControllerError(res, error);

    }
};