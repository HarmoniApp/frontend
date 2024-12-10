export default interface Supervisor {
    id: number;
    firstname: string;
    surname: string;
    role?: {
        id: number;
        name: string;
    }[];
}