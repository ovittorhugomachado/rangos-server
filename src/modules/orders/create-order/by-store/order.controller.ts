import { Request, Response } from "express";
import { DeliveryType, PaymentMethod } from "@prisma/client";
import { createOrderService } from "./order.service";
import { handleControllerError,  ValidationError } from "../../../../utils/errors";

export const createOrder = async (req: Request, res: Response): Promise<void> => {
    try {

        const userId = Number(req.params.storeId);

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
            storeId: userId,
            customerName,
            customerPhone,
            address,
            typeOfDelivery,
            paymentMethod,
            items,
            userId
        });

        res.status(201).json({ message: 'Pedido criado com sucesso', data: order });

    } catch (error: any) {

        handleControllerError(res, error);

    }
};
