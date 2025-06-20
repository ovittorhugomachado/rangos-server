import { Request, Response } from "express";
import { serviceGetStoreData, storeDataUpdateService } from "./store.service";
import { AppError, handleControllerError } from "../../utils/errors";

export const getStoreData = async (req: Request, res: Response): Promise<void> => {

    const userId = Number(req.user?.userId);

    try {

        const store = await serviceGetStoreData(userId);

        res.status(200).json(store);
        return 

    } catch (error: any) {

        handleControllerError(res, error);

    }
};

export const updateStoreData = async (req: Request, res: Response): Promise<void> => {

    try {

        const userId = Number(req.user?.userId);

        const updateData = req.body;

        const allowedFields = ['restaurantName', 'phoneNumber', 'address', 'logoUrl', 'delivery', 'pickup'];

        const isValidUpdate = Object.keys(updateData).every(key => allowedFields.includes(key));
        if (!isValidUpdate) {
            throw new AppError('Dados inválidos');
        };



        await storeDataUpdateService(userId, updateData);

        res.status(200).json({ message: 'Dados atualizados com sucesso' });
        return 

    } catch (error: any) {

        handleControllerError(res, error);

    }
};