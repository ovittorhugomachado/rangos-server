import { Request, Response } from 'express';
import { getStoreCustomizationByUserId } from './store-customization.service';

export const getStoreCustomization = async (req: Request, res: Response): Promise<void> =>  {
    try {
        const { userId } = req.params;
        const storeCustomization = await getStoreCustomizationByUserId(Number(userId));

        if (!storeCustomization) {
            res.status(404).json({ error: 'Configurações da loja não encontradas' });
            return 
        }

        res.status(200).json(storeCustomization);
    } catch (error) {
        console.error('Erro ao buscar configurações da loja:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};