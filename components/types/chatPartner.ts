export interface ChatPartner {
    id: number;
    name: string;
    photo?: string;
    lastMessage?: string;
    type?: 'user' | 'group';
};