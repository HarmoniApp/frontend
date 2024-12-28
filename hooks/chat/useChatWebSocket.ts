import ChatPartner from "@/components/types/chatPartner";
import Message from "@/components/types/message";
import { patchMarkMessagesAsReadInIndividualChat } from "@/services/chatService";
import { Client } from "@stomp/stompjs";
import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";

export const useChatWebSocket = (
    selectedChat: ChatPartner | null,
    setSelectedChat: (partner: ChatPartner | null) => void,
    loadChatPartners: () => Promise<void>,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
    const stompClientRef = useRef<Client | null>(null);
    const selectedChatRef = useRef<ChatPartner | null>(null);

    useEffect(() => {
        selectedChatRef.current = selectedChat;
    }, [selectedChat]);

    useEffect(() => {
        const tokenJWT = sessionStorage.getItem('tokenJWT');
        const userId = Number(sessionStorage.getItem('userId'));
        const socket = new SockJS(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ws`);
        const stompClient = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                Authorization: `Bearer ${tokenJWT}`,
            },
            onConnect: () => {
                stompClient.subscribe(`/client/messages/${userId}`, async (message) => {
                    const newMessage: Message = JSON.parse(message.body);
                    setMessages((prevMessages) => {
                        const currentChat = selectedChatRef.current;

                        if (
                            currentChat &&
                            (newMessage.sender_id === currentChat.id || newMessage.receiver_id === currentChat.id)
                        ) {
                            patchMarkMessagesAsReadInIndividualChat(newMessage.receiver_id, newMessage.sender_id);
                            return [...prevMessages, { ...newMessage, is_read: true }];
                        }
                        return prevMessages;
                    });
                    setSelectedChat(selectedChatRef.current)
                    await loadChatPartners();
                });

                stompClient.subscribe(`/client/messages/readStatus/${userId}`, async (message) => {
                    const updatedMessages: Message[] = JSON.parse(message.body);
                    setMessages((prevMessages) => {
                        const updated = prevMessages.map((msg) =>
                            updatedMessages.find((um) => um.id === msg.id) ? { ...msg, is_read: true } : msg
                        );
                        return [...updated];
                    });
                });

                stompClient.subscribe(`/client/groupMessages/${userId}`, async (message) => {
                    const newMessage: Message = JSON.parse(message.body);

                    if (!newMessage.groupSenderPhoto || !newMessage.groupSenderName) {
                        const tokenJWT = sessionStorage.getItem('tokenJWT');
                        const senderDetails = await fetch(
                            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/simple/empId/${newMessage.sender_id}`,
                            {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${tokenJWT}`,
                                },
                            }
                        );
                        const senderData = await senderDetails.json();

                        newMessage.groupSenderPhoto = senderData.photo;
                        newMessage.groupSenderName = `${senderData.firstname} ${senderData.surname}`;
                    }

                    setMessages((prevMessages) => {
                        const currentChat = selectedChatRef.current;
                        if (
                            currentChat &&
                            newMessage.group_id === currentChat.id
                        ) {
                            return [...prevMessages, newMessage];
                        }
                        return prevMessages;
                    });
                    await loadChatPartners();
                });

                stompClient.subscribe(`/client/groupMessages/readStatus/${userId}`, async (message) => {
                    const updatedMessages: Message[] = JSON.parse(message.body);
                    setMessages((prevMessages) =>
                        prevMessages.map((msg) =>
                            updatedMessages.find((um) => um.id === msg.id) ? { ...msg, is_read: true } : msg
                        )
                    );
                });
            },
            onStompError: (error) => {
                console.error('STOMP WebSocket error:', error);
            }
        });

        stompClient.activate();
        stompClientRef.current = stompClient;

        return () => {
            stompClient.deactivate();
        };
    }, []);
};