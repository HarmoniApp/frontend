"use client";
import React, { useEffect, useRef, useState } from 'react';
import styles from './main.module.scss';
import Message from '@/components/types/message';
import Language from '@/components/types/language';
import ChatPartner from '@/components/types/chatPartner';
import EditGroup from '@/components/chat/editGroup';
import SendMessageForm from '@/components/chat/sendMessageForm';
import Conversation from '@/components/chat/conversation';
import Sidebar from '@/components/chat/sidebar';
import { fetchLanguages } from "@/services/languageService";
import LoadingSpinner from '../loadingSpinner';
import { fetchAllChatPartners, fetchMessagesChatHistory } from '@/services/chatService';
import { useChatWebSocket } from '@/hooks/useChatWebSocket';

const Chat = () => {
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

  useChatWebSocket(selectedChat, loadChatPartners, setMessages);

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

  return (
    <div className={styles.chatContainer}>
      <>
        <div className={styles.sidebar}>
          <Sidebar selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            languages={languages}
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
            newChat={newChat}
            setNewChat={setNewChat}
            setChatType={setChatType}
            chatPartners={chatPartners}
            setLoading={setLoading}
            fetchChatHistory={fetchChatHistory}
            setChatPartners={setChatPartners}
            loadChatPartners={loadChatPartners}
            handleSelectUser={handleSelectUser}
          />
        </div>
        <div className={styles.chatWindow}>
          {selectedChat && (
            <>
              <Conversation
                messages={messages}
                chatType={chatType}
                selectedChat={selectedChat}
                setIsEditGroupModalOpen={setIsEditGroupModalOpen}
              />
              <SendMessageForm
                selectedChat={selectedChat}
                setSelectedChat={setSelectedChat}
                messages={messages}
                setMessages={setMessages}
                loadChatPartners={loadChatPartners}
                selectedLanguage={selectedLanguage}
                loading={setLoading}
              />
            </>
          )}
        </div>
      </>
      {isEditGroupModalOpen && (
        <EditGroup
          editGroupModal={setIsEditGroupModalOpen}
          selectedChat={selectedChat}
          setLoading={setLoading}
          setIsEditGroupModalOpen={setIsEditGroupModalOpen}
        />
      )}
      {loading && <LoadingSpinner />}
    </div>
  );
};
export default Chat;