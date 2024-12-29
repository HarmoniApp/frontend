import { ChatPartner } from "@/components/types/chatPartner";
import { Language } from "@/components/types/language";
import { Message } from "@/components/types/message";
import { fetchAllChatPartners, fetchMessagesChatHistory } from "@/services/chatService";
import { fetchLanguages } from "@/services/languageService";
import { useState, useEffect } from "react";
import { useChatWebSocket } from "./useChatWebSocket";

export const useChatManagement = () => {
    const [chatPartners, setChatPartners] = useState<ChatPartner[]>([]);
    const [selectedChat, setSelectedChat] = useState<ChatPartner | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState<string>('');
    const [newChat, setNewChat] = useState<boolean>(false);
    const [chatType, setChatType] = useState<'user' | 'group'>('user');
    const [isEditGroupModalOpen, setIsEditGroupModalOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);

    const handleSelectUser = (chatPartner: ChatPartner) => {
        setLoading(true);
        setNewChat(false);
        setSelectedChat(chatPartner);
        if (chatPartner.type && chatPartner.type === 'user') {
            setChatType('user');
        } else {
            setChatType('group');
        }
        fetchChatHistory(chatPartner);
        setLoading(false);
    };

    useEffect(() => {
        const loadData = async () => {
            await fetchLanguages(setLanguages);
        };

        loadData();
    }, []);

    const loadChatPartners = async (selectFirstPartner = false, selectedChat?: ChatPartner) => {
        setLoading(true);
        try {
            const newestChatPartner = await fetchAllChatPartners(setChatType, setChatPartners)

            if (selectFirstPartner && newestChatPartner != undefined) {
                setSelectedChat(newestChatPartner);
                await fetchChatHistory(newestChatPartner, selectedLanguage);
            }
        } catch (error) {
            console.error('Error loading chat partners:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setIsEditGroupModalOpen(false);
        setNewChat(false);
        const loadPartners = async () => {
            await loadChatPartners(true);
        };

        loadPartners();
    }, []);

    useEffect(() => {
        setIsEditGroupModalOpen(false);
    }, [selectedChat]);

    const fetchChatHistory = async (partner: ChatPartner, language: string = '') => {
        const userId = Number(sessionStorage.getItem('userId'));
        setLoading(true);
        setNewChat(false);

        await fetchMessagesChatHistory(userId, partner, language, setMessages)

        // setMessages((prevMessages) =>
        //   prevMessages.map((msg) =>
        //     msg.receiver_id === Number(userId) ? { ...msg, is_read: true } : msg
        //   )
        // );

        // setSelectedChat(partner);
        setLoading(false);
    };

    useChatWebSocket(selectedChat, setSelectedChat, loadChatPartners, setMessages);

    return {
        chatPartners,
        setChatPartners,
        selectedChat,
        setSelectedChat,
        messages,
        languages,
        selectedLanguage,
        setSelectedLanguage,
        newChat,
        setNewChat,
        chatType,
        setChatType,
        isEditGroupModalOpen,
        setIsEditGroupModalOpen,
        loading,
        setLoading,
        handleSelectUser,
        loadChatPartners,
        fetchChatHistory,
    };
}