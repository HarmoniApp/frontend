import Message from "@/components/types/message";
import { fetchCsrfToken } from "./csrfService";
import ChatPartner from "@/components/types/chatPartner";

export const fetchGroupMembers = async (
    id: number,
    setSelectedUsers: (selectedUsers: ChatPartner[]) => void): Promise<void> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/group/${id}/members`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            }
        });
        const members = await response.json();
        const membersWithNames = members.map((user: any) => ({
            ...user,
            name: `${user.firstname} ${user.surname}`
        }));
        setSelectedUsers(membersWithNames);
    } catch (error) {
        console.error('Error fetching group members:', error);
    }
};

export const fetchUserSearch = async (
    query: string,
    setSearchResults: (users: ChatPartner[]) => void): Promise<void> => {
    if (query.trim().length > 2) {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/simple/empId/search?q=${query}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                }
            });
            const data = await response.json();
            const results = data.map((user: any) => ({
                id: user.id,
                name: user.firstname + " " + user.surname,
                photo: user.photo,
                type: 'user'
            }));
            setSearchResults(results);
        } catch (error) {
            console.error('Error handle search:', error);
        }
    } else {
        setSearchResults([]);
    }
};

export const fetchMessagesChatHistory = async (
    userId: number,
    partner: ChatPartner,
    language: string = '',
    setMessages: (messages: Message[]) => void): Promise<void> => {

    const translate = language !== '';
    const targetLanguageParam = translate ? `&targetLanguage=${language}` : '';

    try {
        if (partner.type == 'user') {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/message/history?userId1=${userId}&userId2=${partner.id}&translate=${translate}${targetLanguageParam}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                }
            });
            if (!response.ok) {
                console.error('Failed to fetch individual chat history: ', response.statusText);
                throw new Error(`Failed to fetch individual chat history`);
            }
            const messages = await response.json();
            setMessages(messages);

            await patchMarkMessagesAsReadInIndividualChat(userId, partner.id);
        } else {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/message/history?userId1=${userId}&groupId=${partner.id}&translate=${translate}${targetLanguageParam}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                }
            });
            if (!response.ok) {
                console.error('Failed to fetch group chat history: ', response.statusText);
                throw new Error(`Failed to fetch group chat history`);
            }
            const data = await response.json();

            const messagesWithGroupDetails = await Promise.all(
                data.map(async (message: Message) => {
                    const senderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/simple/empId/${message.sender_id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
                        }
                    });
                    const senderData = await senderResponse.json();
                    return {
                        ...message,
                        groupSenderName: `${senderData.firstname} ${senderData.surname}`,
                        groupSenderPhoto: senderData.photo,
                    };
                })
            );
            setMessages(messagesWithGroupDetails);
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

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

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/message/mark-all-read?userId1=${userId}&userId2=${partnerId}`, {
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
        console.error(`Error while removing user from group`, error);
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

