import { Request, Response } from "express";
import { updateSchedule } from "./update-schedule.service";
import { checkOverlappingRanges, validateOpeningHours } from "./validate-opening-hours.utils";

export const updateScheduleController = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.user?.userId);
        const { schedule } = req.body

        const validationError = validateOpeningHours(schedule)

        if (validationError) {
            res.status(400).json({ error: validationError });
            return;
        }

        const overlapError = checkOverlappingRanges(schedule)

        if (overlapError) {
            res.status(400).json({ error: overlapError });
            return;
        }

        await updateSchedule(Number(userId), schedule)

        res.status(200).json({ success: true, message: "Horários atualizados com sucesso" })
    
    } catch (error) {

        console.error('Erro ao buscar configurações da loja:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Erro desconhecido"
        });

    }
};