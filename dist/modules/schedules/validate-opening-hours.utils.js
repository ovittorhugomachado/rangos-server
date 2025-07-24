"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOverlappingRanges = exports.validateOpeningHours = void 0;
const validateOpeningHours = (hours) => {
    const isValidHour = (time) => /^(0\d|1\d|2[0-3]):[0-5]\d$/.test(time);
    for (const [index, range] of hours.entries()) {
        if (!range.day || !range.timeRanges || !Array.isArray(range.timeRanges)) {
            return `Estrutura inválida no índice ${index}. Verifique os campos 'day' e 'timeRanges'.`;
        }
        for (const timeRange of range.timeRanges) {
            if (!timeRange.start ||
                !timeRange.end ||
                !isValidHour(timeRange.start) ||
                !isValidHour(timeRange.end)) {
                console.log('Intervalo inválido:', timeRange);
                return `Horário inválido no índice ${index}. Verifique os campos 'start' e 'end'.`;
            }
            if (timeRange.start >= timeRange.end) {
                return `Erro no índice ${index}: O horário de término (${timeRange.end}) deve ser maior que o de início (${timeRange.start}).`;
            }
        }
    }
    return null;
};
exports.validateOpeningHours = validateOpeningHours;
const checkOverlappingRanges = (schedule) => {
    const grouped = {};
    for (const entry of schedule) {
        if (!grouped[entry.day])
            grouped[entry.day] = [];
        grouped[entry.day].push(...entry.timeRanges);
    }
    for (const day in grouped) {
        const ranges = grouped[day]
            .map(({ start, end }) => ({
            start: parseInt(start.replace(":", "")),
            end: parseInt(end.replace(":", "")),
        }))
            .sort((a, b) => a.start - b.start);
        for (let i = 1; i < ranges.length; i++) {
            const prev = ranges[i - 1];
            const curr = ranges[i];
            if (curr.start < prev.end) {
                return `Horários sobrepostos no dia: ${day}`;
            }
        }
    }
    return null;
};
exports.checkOverlappingRanges = checkOverlappingRanges;
