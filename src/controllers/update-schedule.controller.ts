import { Request, Response } from "express";
import { updateSchedule } from "../services/update-schedule.service";

export const updateScheduleController = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params
        const { schedule } = req.body

        await updateSchedule(Number(userId), schedule)
        console.log(schedule)

        res.status(200).json({ success: true, message: "Horários atualizados com sucesso" })
    } catch (error) {
        console.error('Erro ao buscar configurações da loja:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Erro desconhecido"
        });
    }
}