import { Request, Response } from "express";
import { NotFoundError } from "../../utils/errors";
import { orderAcceptanceService, orderCancellationService, orderReadyService } from "./orders.service";

export const acceptOrder = async (req: Request, res: Response): Promise<void> => {
    try {

        const userId = Number(req.user?.userId);
        if (!userId) {
            res.status(401).json({ message: 'Erro na validação do usuário' });
            return
        };

        const orderId = Number(req.params.orderId);
        if (isNaN(orderId)) {
            res.status(400).json({ message: 'ID do pedido inválido' });
            return;
        };

        await orderAcceptanceService(userId, orderId);

        res.status(200).json({ message: 'Pedido aceito com sucesso' });

    } catch (error) {

        console.error('Erro ao aceitar pedido:', error);

        if (error instanceof NotFoundError) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: "Erro interno no servidor"
            });
        }
    }
};

export const cancelOrder = async (req: Request, res: Response) => {

    try {
        const userId = Number(req.user?.userId);
        if (!userId) {
            res.status(401).json({ message: 'Erro na validação do usuário' });
            return
        };

        const orderId = Number(req.params.orderId);
        if (isNaN(orderId)) {
            res.status(400).json({ message: 'ID do pedido inválido' });
            return;
        };

        await orderCancellationService(userId, orderId);

        res.status(200).json({ message: 'Pedido cancelado com sucesso' });

    } catch (error) {

        console.error('Erro ao cancelar pedido:', error);

        if (error instanceof NotFoundError) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: "Erro interno no servidor"
            });
        }
    }
};

export const orderReady = async (req: Request, res: Response) => {

    try {
        const userId = Number(req.user?.userId);
        if (!userId) {
            res.status(401).json({ message: 'Erro na validação do usuário' });
            return
        };

        const orderId = Number(req.params.orderId);
        if (isNaN(orderId)) {
            res.status(400).json({ message: 'ID do pedido inválido' });
            return;
        };

        await orderReadyService(userId, orderId);

        res.status(200).json({ message: 'Pedido atualizado com sucesso' });

    } catch (error) {

        console.error('Erro ao atualizar status do pedido:', error);

        if (error instanceof NotFoundError) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: "Erro interno no servidor"
            });
        }
    }
};