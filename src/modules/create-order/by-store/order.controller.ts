import { Request, Response } from "express";
import { DeliveryType, PaymentMethod } from "@prisma/client";
import { createOrderService } from "./order-service";
import { NotFoundError, ValidationError } from "../../../utils/errors";

export const createOrder = async (req: Request, res: Response): Promise<void> => {
    try {

        const userId = Number(req.user?.userId);

        const { customerName, customerPhone, address, typeOfDelivery, paymentMethod, items } = req.body;

        if (!customerName || typeof customerName !== 'string' || customerName.trim() === '') {
            throw new ValidationError('Insira o nome do cliente corretamente');
        };

        if (!customerPhone || typeof customerPhone !== 'string') {
            throw new ValidationError('Insira o celular do cliente corretamente');
        };

        if (
            !typeOfDelivery ||
            !(Object.values(DeliveryType).includes(typeOfDelivery))
        ) {
            throw new ValidationError('Insira um tipo de entrega válido (delivery ou pickup)');
        };

        if (typeOfDelivery === 'delivery' && !address) {
            throw new ValidationError('Quando o tipo de entrega é delivery, o endereço do cliente é obrigatório');
        }

        if (!paymentMethod || !(paymentMethod in PaymentMethod)) {
            throw new ValidationError('Insira um método de pagamento válido (dinheiro, cartao ou pix)');
        };

        if (
            !items ||
            !Array.isArray(items) ||
            items.length === 0 ||
            items.some(item =>
                !item ||
                typeof item.menuItemId !== 'number' ||
                (item.optionIds && (
                    !Array.isArray(item.optionIds) ||
                    item.optionIds.some((id: number) => typeof id !== 'number')
                ))
            )
        ) {
            throw new ValidationError('O campo "items" deve ser um array não vazio contendo objetos com menuItemId (número de item existente)');
        };

        const order = await createOrderService({
            userId,
            customerName,
            customerPhone,
            address,
            typeOfDelivery,
            paymentMethod,
            items
        });

        res.status(201).json({ message: 'Pedido criado com sucesso', data: order });

    } catch (error) {

        console.error('Erro ao criar pedido:', error);

        if (error instanceof ValidationError) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
        else if (error instanceof NotFoundError) {
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
