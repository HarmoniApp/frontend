import ChatPartner from "@/components/types/chatPartner";
import Message from "@/components/types/message";
import { Client } from "@stomp/stompjs";
import { useEffect } from "react";
import SockJS from "sockjs-client";

const useChatWebSocket = (
    selectedChat: ChatPartner | null,
    chatType: 'user' | 'group',
    loadChatPartners: () => Promise<void>,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
    useEffect(() => {
        const tokenJWT = sessionStorage.getItem('tokenJWT');
        const userId = Number(sessionStorage.getItem('userId'));
        const socket = new SockJS(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ws`);
        const stompClient = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                Authorization: `Bearer ${tokenJWT}`,
            },
            // debug: (str) => console.log(str),
            onConnect: () => {
                // console.log('Connected to STOMP WebSocket');

                if (chatType === 'user') {
                    stompClient.subscribe(`/client/messages/${userId}`, (message) => {
                        const newMessage: Message = JSON.parse(message.body);

                        setMessages((prevMessages) =>
                            selectedChat &&
                                selectedChat.type === 'user' &&
                                (newMessage.sender_id === selectedChat.id || newMessage.receiver_id === selectedChat.id)
                                ? [...prevMessages, newMessage]
                                : prevMessages
                        );
                        loadChatPartners();
                    });

                    stompClient.subscribe(`/client/messages/readStatus/${userId}`, (message) => {
                        const updatedMessages: Message[] = JSON.parse(message.body);

                        setMessages((prevMessages) =>
                            prevMessages.map((msg) => {
                                const updated = updatedMessages.find((um) => um.id === msg.id);
                                return updated ? { ...msg, is_read: true } : msg;
                            })
                        );
                    });
                } else if (chatType === 'group') {
                    stompClient.subscribe(`/client/groupMessages/${userId}`, async (message) => {
                        const newMessage: Message = JSON.parse(message.body);

                        if (!newMessage.groupSenderPhoto || !newMessage.groupSenderName) {
                            const tokenJWT = sessionStorage.getItem('tokenJWT');
                            const senderDetails = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/simple/empId/${newMessage.sender_id}`, {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${tokenJWT}`,
                                }
                            });
                            const senderData = await senderDetails.json();

                            newMessage.groupSenderPhoto = senderData.photo;
                            newMessage.groupSenderName = `${senderData.firstname} ${senderData.surname}`;
                        }

                        setMessages((prevMessages) =>
                            selectedChat &&
                                selectedChat.type === 'group' &&
                                newMessage.group_id === selectedChat.id
                                ? [...prevMessages, newMessage]
                                : prevMessages
                        );
                        loadChatPartners();
                    });

                    stompClient.subscribe(`/client/groupMessages/readStatus/${userId}`, (message) => {
                        const updatedMessages: Message[] = JSON.parse(message.body);

                        setMessages((prevMessages) =>
                            prevMessages.map((msg) =>
                                updatedMessages.find((um) => um.id === msg.id) ? { ...msg, is_read: true } : msg
                            )
                        );
                    });
                }
            },
            onStompError: (error) => {
                console.error('STOMP WebSocket error:', error);
            }
        });

        stompClient.activate();

        return () => {
            stompClient.deactivate();
        };
    }, [selectedChat]);
}
export default useChatWebSocket;