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
exports.updateScheduleController = void 0;
const update_schedule_service_1 = require("./update-schedule.service");
const validate_opening_hours_utils_1 = require("./validate-opening-hours.utils");
const updateScheduleController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
        const { schedule } = req.body;
        const validationError = (0, validate_opening_hours_utils_1.validateOpeningHours)(schedule);
        if (validationError) {
            res.status(400).json({ error: validationError });
            return;
        }
        const overlapError = (0, validate_opening_hours_utils_1.checkOverlappingRanges)(schedule);
        if (overlapError) {
            res.status(400).json({ error: overlapError });
            return;
        }
        yield (0, update_schedule_service_1.updateSchedule)(Number(userId), schedule);
        res.status(200).json({ success: true, message: "Horários atualizados com sucesso" });
    }
    catch (error) {
        console.error('Erro ao buscar configurações da loja:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Erro desconhecido"
        });
    }
});
exports.updateScheduleController = updateScheduleController;
