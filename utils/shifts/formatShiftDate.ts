import { Shift } from "@/components/types/shift";

export const newDayFormat = (shift: Shift) => {
    return shift.start.split('T')[0].replace(/-/g, '.').split('.').reverse().join('.');
};