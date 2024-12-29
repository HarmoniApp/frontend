export const calculateShiftDuration = (startTime: string, endTime: string) => {
    const convertTimeToDecimal = (time: string) => {
        const [hours, minutes] = time.split(':');
        return parseInt(hours) + parseInt(minutes) / 60;
    };

    const start = convertTimeToDecimal(startTime);
    const end = convertTimeToDecimal(endTime);
    const duration = start <= end ? end - start : 24 - start + end;

    return isNaN(duration) ? 0 : duration;
};