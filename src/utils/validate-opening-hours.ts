export const validateOpeningHours = (hours: any[]) => {
    const isValidHour = (time: string): boolean =>
        /^(0\d|1\d|2[0-3]):[0-5]\d$/.test(time);

    for (const [index, range] of hours.entries()) {

        if (!range.day || !range.timeRanges || !Array.isArray(range.timeRanges)) {
            return `Estrutura inválida no índice ${index}. Verifique os campos 'day' e 'timeRanges'.`;
        }

        for (const timeRange of range.timeRanges) {

            if (
                !timeRange.start ||
                !timeRange.end ||
                !isValidHour(timeRange.start) ||
                !isValidHour(timeRange.end)
            ) {
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