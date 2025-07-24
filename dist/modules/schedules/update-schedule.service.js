"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSchedule = void 0;
const prisma_1 = require("../../lib/prisma");
;
;
const updateSchedule = (userId, schedule) => __awaiter(void 0, void 0, void 0, function* () {
    const store = yield prisma_1.prisma.store.findFirst({
        where: { userId },
        select: { id: true },
    });
    if (!store)
        throw new Error('Loja não encontrada');
    const storeId = store.id;
    yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.openingHour.updateMany({
            where: { storeId },
            data: {
                timeRanges: [],
                isOpen: false
            }
        });
        for (const item of schedule) {
            yield tx.openingHour.upsert({
                where: {
                    storeId_day: {
                        storeId,
                        day: item.day
                    }
                },
                update: {
                    timeRanges: item.timeRanges,
                    isOpen: item.timeRanges.length > 0
                },
                create: {
                    storeId,
                    day: item.day,
                    timeRanges: item.timeRanges,
                    isOpen: item.timeRanges.length > 0
                }
            });
        }
    }));
});
exports.updateSchedule = updateSchedule;
