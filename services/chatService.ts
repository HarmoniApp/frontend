import Message from "@/components/types/message";
import { fetchCsrfToken } from "./csrfService";

export const posChattMessage = async (
    messageData: any,
    setMessages: (messages: Message[]) => void,
    messages: Message[]): Promise<void> => {

    try {
        const tokenXSRF = await fetchCsrfToken();

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/message/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                'X-XSRF-TOKEN': tokenXSRF,
            },
            credentials: 'include',
            body: JSON.stringify(messageData),
        });
        if (!response.ok) {
            console.error('Failed to send message:', response.statusText);
            throw new Error('Failed to send message');
        }
        const data = await response.json();
        setMessages([...messages, data]);
    } catch (error) {
        console.error(`Error sending message`, error);
    }
};

export const patchMarkMessagesAsReadInIndividualChat = async (
    userId: number,
    partnerId: number): Promise<void> => {

    try {
        const tokenXSRF = await fetchCsrfToken();

        const response =  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/message/mark-all-read?userId1=${userId}&userId2=${partnerId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            'X-XSRF-TOKEN': tokenXSRF,
          },
          credentials: 'include',
        });
        if (!response.ok) {
          console.error('Failed to mark messages as read:', response.statusText);
          throw new Error('Failed to mark messages as read');
        }
    } catch (error) {
        console.error(`Error marking messages as read`, error);
    }
};

export const patchAddUserToGroup = async (
    selectedChatId: number,
    userId: number): Promise<void> => {

    try {
        const tokenXSRF = await fetchCsrfToken();

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/group/${selectedChatId}/user/${userId}/add`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                'X-XSRF-TOKEN': tokenXSRF,
            },
            credentials: 'include',
        });
    } catch (error) {
        console.error(`Error sending message`, error);
    }
};

export const patchRemoveUserFromGroup = async (
    selectedChatId: number,
    userId: number): Promise<void> => {

    try {
        const tokenXSRF = await fetchCsrfToken();

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/group/${selectedChatId}/user/${userId}/remove`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                'X-XSRF-TOKEN': tokenXSRF,
            },
            credentials: 'include',
        });
    } catch (error) {
        console.error(`Error sending message`, error);
    }
};

export const deleteGroup = async (
    id: number,
    setLoading: (loading: boolean) => void): Promise<void> => {
    setLoading(true);

    try {
        const tokenXSRF = await fetchCsrfToken();

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/group/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                'X-XSRF-TOKEN': tokenXSRF,
            },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(`Failed to delete group"`);
        }

        window.location.reload();
    } catch (error) {
        console.error("Error deleting group:", error);
    } finally {
        setLoading(false);
    }
};

