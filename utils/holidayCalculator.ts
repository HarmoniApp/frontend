const calculateHolidaysForYear = (year: number): string[] => {
    const holidays: string[] = [
        `${year}-01-01`, // New Year's Day
        `${year}-01-06`, // Epiphany
        `${year}-05-01`, // Labor Day
        `${year}-05-03`, // Constitution Day
        `${year}-08-15`, // Assumption of Mary
        `${year}-11-01`, // All Saints' Day
        `${year}-11-11`, // Independence Day
        `${year}-12-25`, // Christmas Day
        `${year}-12-26`, // Second Day of Christmas
    ];

    const calculateEaster = (year: number): string => {
        const G = year % 19;
        const C = Math.floor(year / 100);
        const H = (C - Math.floor(C / 4) - Math.floor((8 * C + 13) / 25) + 19 * G + 15) % 30;
        const I = H - Math.floor(H / 28) * (1 - Math.floor(H / 29) * Math.floor((21 - G) / 11));
        const J = (year + Math.floor(year / 4) + I + 2 - C + Math.floor(C / 4)) % 7;
        const L = I - J;
        const month = 3 + Math.floor((L + 40) / 44);
        const day = L + 28 - 31 * Math.floor(month / 4);
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    };

    const easter = calculateEaster(year);
    const easterDate = new Date(easter);
    holidays.push(easter); // Easter Sunday
    holidays.push(new Date(easterDate.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]); // Easter Monday
    holidays.push(new Date(easterDate.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]); // Corpus Christi

    return holidays;
};

export const calculateWorikngDays = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (endDate < startDate) return 0;

    const holidays = calculateHolidaysForYear(startDate.getFullYear());
    if (startDate.getFullYear() !== endDate.getFullYear()) {
        holidays.push(...calculateHolidaysForYear(endDate.getFullYear()));
    }

    let currentDate = new Date(startDate);
    let workdaysCount = 0;

    while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
        const formattedDate = currentDate.toISOString().split('T')[0];
        if (dayOfWeek !== 0 && dayOfWeek !== 6 && !holidays.includes(formattedDate)) {
            workdaysCount++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return workdaysCount;
};