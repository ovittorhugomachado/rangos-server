import { Prisma, PrismaClient, WeekDay } from "@prisma/client";

const prisma = new PrismaClient();

interface TimeRange {
    start: string;
    end: string;
}

interface ScheduleItem {
    day: WeekDay;
    timeRanges: TimeRange[];
}

export const updateSchedule = async (userId: number, schedule: ScheduleItem[]) => {

    const user = await prisma.user.findFirst({ where: {id: userId}})

    if(!user) throw new Error('Usuário não encontrado')

    await prisma.$transaction(async (tx) => {

        await tx.openingHour.updateMany({
            where: {userId},
            data: {
                timeRanges: [],
                isOpen: false
            }
        })
        for (const item of schedule) {
            await tx.openingHour.upsert({
                where: {
                    userId_day: {
                        userId,
                        day: item.day
                    }
                },
                update: {
                    timeRanges: item.timeRanges as unknown as Prisma.JsonArray,
                    isOpen: item.timeRanges.length > 0
                },
                create: {
                    userId,
                    day: item.day,
                    timeRanges: item.timeRanges as unknown as Prisma.JsonArray,
                    isOpen: item.timeRanges.length > 0
                }
            });
        }
    });
};