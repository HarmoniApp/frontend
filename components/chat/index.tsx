"use client";
import React, { useEffect, useState } from 'react';
import styles from './main.module.scss';
import Message from '@/components/types/message';
import Language from '@/components/types/language';
import ChatPartner from '@/components/types/chatPartner';
import EditGroup from '@/components/chat/editGroup';
import SendMessageForm from '@/components/chat/sendMessageForm';
import Conversation from '@/components/chat/conversation';
import Sidebar from '@/components/chat/sidebar';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { fetchLanguages } from "@/services/languageService";
import LoadingSpinner from '../loadingSpinner';
import { fetchAllChatPartners, fetchMessagesChatHistory } from '@/services/chatService';

const Chat = () => {
  const [chatPartners, setChatPartners] = useState<ChatPartner[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatPartner | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [newChat, setNewChat] = useState<boolean>(false);
  const [chatType, setChatType] = useState<'user' | 'group'>('user');
  const [isEditGroupModalOpen, setIsEditGroupModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<ChatPartner[]>([]);
  const [userId, setUserId] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem('userId');
    if (storedUserId !== null) {
      setUserId(Number(storedUserId));
    }
  }, []);

  const handleSelectUser = (user: ChatPartner) => {
    setLoading(true);
    setNewChat(false);
    setSelectedChat(user);
    if (user.type && user.type === 'user') {
      setChatType('user');
    } else {
      setChatType('group');
    }
    fetchChatHistory(user);
    setLoading(false);
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchLanguages(setLanguages);
    };

    loadData();
  }, []);

  useEffect(() => {
    const tokenJWT = sessionStorage.getItem('tokenJWT');
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
              prevMessages.map((msg) =>
                updatedMessages.find((um) => um.id === msg.id) ? { ...msg, is_read: true } : msg
              )
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
  }, [userId, selectedChat]);

  const loadChatPartners = async (selectFirstPartner = false) => {
    setLoading(true);

    try {
      const newestChatPartner = await fetchAllChatPartners(setChatType, setChatPartners)

      if (selectFirstPartner) {
        if (newestChatPartner != undefined) {
          setSelectedChat(newestChatPartner);
          await fetchChatHistory(newestChatPartner, selectedLanguage);
        }
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
  }, [userId]);

  useEffect(() => {
    setIsEditGroupModalOpen(false);
  }, [selectedChat]);

  const fetchChatHistory = async (partner: ChatPartner, language: string = '') => {
    setLoading(true);
    setNewChat(false);

    await fetchMessagesChatHistory(userId, partner, language, setMessages)

    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.receiver_id === userId ? { ...msg, is_read: true } : msg
      )
    );

    setSelectedChat(partner);
    setLoading(false);
  };

  return (
    <div className={styles.chatContainer}>
      {userId !== 0 ? (
        <>
          <div className={styles.sidebar}>
            <Sidebar selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              languages={languages}
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
              newChat={newChat}
              setNewChat={setNewChat}
              chatType={chatType}
              setChatType={setChatType}
              chatPartners={chatPartners}
              setLoading={setLoading}
              fetchChatHistory={fetchChatHistory}
              userId={userId}
              setChatPartners={setChatPartners}
              fetchChatHistoryForm={fetchChatHistory}
              loadChatPartners={loadChatPartners}
              handleSelectUser={handleSelectUser}
            />
          </div>
          <div className={styles.chatWindow}>
            {selectedChat && (
              <>
                <Conversation
                  userId={userId}
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
                  userId={userId}
                  loadChatPartners={loadChatPartners}
                  selectedLanguage={selectedLanguage}
                  loading={setLoading}
                />
              </>
            )}
          </div>
        </>
      ) : (
        <LoadingSpinner wholeModal={false}/>
      )}
      {isEditGroupModalOpen && (
        <EditGroup
          editGroupModal={setIsEditGroupModalOpen}
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
          selectedChat={selectedChat}
          setLoading={setLoading}
          setIsEditGroupModalOpen={setIsEditGroupModalOpen}
         />
      )}
      {loading &&  <LoadingSpinner />}
    </div>
  );
};
export default Chat;