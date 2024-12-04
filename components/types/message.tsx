export default interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  group_id: number;
  content: string;
  sent_at: string;
  is_read: boolean;
  groupSenderName?: string;
  groupSenderPhoto?: string;
};