export interface RequirementsForm {
    id: number;
    date: string;
    shifts: {
        shiftId: number;
        roles: {
            roleId: number;
            quantity: number;
        }[];
    }[];
}