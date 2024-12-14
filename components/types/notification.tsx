export default interface Notification {
    id: number;
    title: string;
    message: string;
    read: boolean;
    user_id: number;
    created_at: string;
}