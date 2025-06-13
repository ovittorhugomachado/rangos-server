import { Prisma, PrismaClient, DeliveryType, PaymentMethod } from "@prisma/client";
import { ValidationError, NotFoundError } from '../../../utils/errors';

const prisma = new PrismaClient();

interface OrderItemInput {
    menuItemId: number;
    note?: string;
    optionIds?: number[]
}

interface CreateOrderInput {
    userId: number;
    customerName: string;
    customerPhone: string;
    address: string;
    typeOfDelivery: DeliveryType;
    paymentMethod: PaymentMethod;
    items: OrderItemInput[];
}

export const createOrderService = async (data: CreateOrderInput) => {

    const { userId, customerName, customerPhone, address, typeOfDelivery, paymentMethod, items } = data;

    const store = await prisma.store.findUnique({ where: { userId } });

    if (!store) throw new NotFoundError('Loja não encontrada');

    const storeId = store.id;

    return await prisma.$transaction(async (tx) => {

        const menuItems = await tx.menuItem.findMany({
            where: {
                id: { in: items.map(item => item.menuItemId) }
            }
        });

        const allOptionIds = items.flatMap(item => item.optionIds ?? []);

        const options = await tx.menuItemOption.findMany({
            where: { id: { in: allOptionIds } }
        });

        const optionGroupIds = options.map(opt => opt.optionGroupId);

        const optionGroups = await tx.menuItemOptionGroup.findMany({
            where: { id: { in: optionGroupIds } },
            select: { id: true, menuItemId: true }
        });

        const optionGroupMap = new Map(optionGroups.map(og => [og.id, og.menuItemId]));

        for (const item of items) {
            const itemOptions = options.filter(opt => item.optionIds?.includes(opt.id));

            for (const option of itemOptions) {
                const menuItemIdFromGroup = optionGroupMap.get(option.optionGroupId);

                if (!menuItemIdFromGroup || menuItemIdFromGroup !== item.menuItemId) {
                    throw new ValidationError(`A opção ${option.name} não pertence ao item do menu ${item.menuItemId}`);
                }
            }
        };

        const total = items.reduce((sum, item) => {

            const menuItem = menuItems.find(mi => mi.id === item.menuItemId);

            if (!menuItem || !menuItem.price) {
                throw new NotFoundError(`Item do menu não encontrado ou sem preço: ${item.menuItemId}`);
            }

            const itemOptions = options.filter(opt => item.optionIds?.includes(opt.id));
            const additionalTotal = itemOptions.reduce((optSum, opt) => optSum + (opt.additionalPrice?.toNumber() ?? 0), 0);

            return sum + menuItem.price.toNumber() + additionalTotal;
        }, 0);

        const totalAmount = new Prisma.Decimal(total);

        const order = await tx.order.create({
            data: {
                store: { connect: { id: storeId } },
                customerName,
                customerPhone,
                deliveryType: typeOfDelivery,
                paymentMethod,
                address,
                totalAmount,
                orderItems: {
                    create: items.map(item => ({
                        menuItem: { connect: { id: item.menuItemId } },
                        note: item.note || undefined,
                        options: {
                            create: (item.optionIds || []).map(optionId => ({
                                option: { connect: { id: optionId } }
                            }))
                        }
                    }))
                }
            },
            include: {
                orderItems: {
                    include: {
                        options: {
                            include: { option: true }
                        }
                    }
                }
            }
        });

        //AQUI EU PRECISO CHAMAR A FUNÇÃO DE CANCELAR AUTOMATICAMNTE OS PEDIDOS ESQUECISOS

        return order;
    });
};