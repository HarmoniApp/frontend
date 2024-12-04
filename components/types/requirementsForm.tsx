export default interface IRequirementsForm {
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