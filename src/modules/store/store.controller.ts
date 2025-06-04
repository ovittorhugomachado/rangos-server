import { Request, Response } from "express";
import { serviceGetStoreData } from "./store.service";

interface StoreRequest extends Request {
    user?: { userId: number };
    body: {
        restaurantName?: string | null;
        phoneNumber?: string | null;
        address?: string | null;
        logoUrl?: string | null;
        bannerUrl?: string | null;
        delivery?: boolean | null;
        pickup?: boolean | null;
        openingHours?: object | null;
    };
}

export const getStoreData = async (req: StoreRequest, res: Response) => {

    const userId = Number(req.user?.userId);

    try {

        const store = await serviceGetStoreData(userId);
        return res.status(200).json(store);

    } catch (error: any) {

        if (error.message === 'STORE_NOT_FOUND') {
            return res.status(404).json({ message: 'Loja não encontrada' });
        }

        console.error('[ERRO /me]', error);
        return res.status(500).json({ message: 'Erro ao buscar dados da loja' });
    }
}