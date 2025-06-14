import { Prisma, WeekDay } from "@prisma/client";
import { prisma } from "../../lib/prisma";

interface TimeRange {
    start: string;
    end: string;
}

interface ScheduleItem {
    day: WeekDay;
    timeRanges: TimeRange[];
}

export const updateSchedule = async (userId: number, schedule: ScheduleItem[]) => {
    const store = await prisma.store.findFirst({
        where: { userId },
        select: { id: true },
    });

    if (!store) throw new Error('Loja não encontrada');

    const storeId = store.id;

    await prisma.$transaction(async (tx) => {
        await tx.openingHour.updateMany({
            where: { storeId },
            data: {
                timeRanges: [],
                isOpen: false
            }
        });

        for (const item of schedule) {
            await tx.openingHour.upsert({
                where: {
                    storeId_day: {
                        storeId,
                        day: item.day
                    }
                },
                update: {
                    timeRanges: item.timeRanges as unknown as Prisma.JsonArray,
                    isOpen: item.timeRanges.length > 0
                },
                create: {
                    storeId,
                    day: item.day,
                    timeRanges: item.timeRanges as unknown as Prisma.JsonArray,
                    isOpen: item.timeRanges.length > 0
                }
            });
        }
    });
};