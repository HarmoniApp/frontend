export default interface Notification {
    id: number;
    title: string;
    message: string;
    read: boolean;
    user_id: number;
    type_name: string;
    created_at: string;
}