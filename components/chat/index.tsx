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
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message as PrimeMessage } from 'primereact/message';
import { fetchLanguages } from "@/services/languageService";
import { fetchCsrfToken } from '@/services/csrfService';
import { group } from 'console';

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
  const [error, setError] = useState<string | null>(null);

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
  };;

  useEffect(() => {
    const loadData = async () => {
      await fetchLanguages(setLanguages, setError, setLoading);
    };

    loadData();
  }, []);

  useEffect(() => {
    // setLoading(true);
    const tokenJWT = sessionStorage.getItem('tokenJWT');
    const socket = new SockJS(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ws`);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${tokenJWT}`,
      },
      debug: (str) => console.log(str),
      onConnect: () => {
        console.log('Connected to STOMP WebSocket');

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
    // setLoading(false);

    return () => {
      stompClient.deactivate();
    };
  }, [userId, selectedChat]);

  const loadChatPartners = async (selectFirstPartner = false) => {
  setLoading(true);

  try {
    const tokenJWT = sessionStorage.getItem('tokenJWT');

    const chatPartnersResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/message/all-chat-partners?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenJWT}`,
      }
    });
    if (!chatPartnersResponse.ok) throw new Error('Błąd podczas pobierania partnerów chatu');
    const data = await chatPartnersResponse.json();
    const partners = await Promise.all(
      data.map((partner: { partnerId: number; partnerType: string }) => {
        if (partner.partnerType === "USER") {
          return fetchUserDetails(partner.partnerId);
        } else {
          return fetchGroupDetails(partner.partnerId);
        }
      })
    );

    setChatPartners(partners);

    if (selectFirstPartner && partners.length > 0) {
      const newestChatPartner = partners[0];
      if(newestChatPartner.type == 'group'){
        setChatType('group')
      }
      setSelectedChat(newestChatPartner);
      await fetchChatHistory(newestChatPartner, selectedLanguage);
    }
  } catch (error) {
    console.error('Error loading chat partners:', error);
    setError('Error loading chat partners');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    setLoading(true);

    setIsEditGroupModalOpen(false);
    setNewChat(false);
    const loadPartners = async () => {
      await loadChatPartners(true);
    };

    loadPartners();
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    setIsEditGroupModalOpen(false);
  }, [selectedChat]);

  const fetchUserDetails = async (partnerId: number): Promise<ChatPartner> => {
    setLoading(true);

    try {
      const tokenJWT = sessionStorage.getItem('tokenJWT');
      const userDetailsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/simple/empId/${partnerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenJWT}`,
        }
      });
      if (!userDetailsResponse.ok) throw new Error(`Błąd podczas pobierania danych użytkownika o ID ${partnerId}`);
      const userDetails = await userDetailsResponse.json();

      const lastMessageResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/message/last?userId1=${userId}&userId2=${partnerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenJWT}`,
        }
      });
      if (!lastMessageResponse.ok) throw new Error(`Błąd podczas pobierania ostatnich wiadomości`);
      const lastMessageData = lastMessageResponse.ok ? await lastMessageResponse.text() : 'Brak wiadomości';

      // setLoading(false);

      return {
        id: partnerId,
        name: userDetails.firstname + " " + userDetails.surname,
        photo: userDetails.photo,
        lastMessage: lastMessageData,
        type: 'user'
      };
    } catch (error) {
      console.error('Error fetching user details:', error);
      setError('Error fetching user details');
      return {
        id: partnerId,
        name: '',
        photo: '',
        lastMessage: '',
        type: 'user'
      };
    }
  };

  const fetchGroupDetails = async (partnerId: number): Promise<ChatPartner> => {
    setLoading(true);

    try {
      const tokenJWT = sessionStorage.getItem('tokenJWT');
      const groupDetailsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/group/details/${partnerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenJWT}`,
        }
      });
      if (!groupDetailsResponse.ok) throw new Error(`Błąd podczas pobierania danych grupy o ID ${partnerId}`);
      const groupDetails = await groupDetailsResponse.json();

      const lastMessageResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/message/last?groupId=${partnerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenJWT}`,
        }
      });
      if (!lastMessageResponse.ok) throw new Error(`Błąd podczas pobierania ostatnich wiadomości`);
      const lastMessageData = lastMessageResponse.ok ? await lastMessageResponse.text() : 'Brak wiadomości';

      return {
        id: partnerId,
        name: groupDetails.name,
        lastMessage: lastMessageData,
        type: 'group'
      };
    } catch (error) {
      console.error('Error fetching group details:', error);
      setError('Error fetching group details');
      return {
        id: partnerId,
        name: '',
        lastMessage: '',
        type: 'group'
      };
    }
    //setLoading(false);
  };

  const fetchChatHistory = async (partner: ChatPartner, language: string = '') => {
    setLoading(true);
    setNewChat(false);
    const translate = language !== '';
    const targetLanguageParam = translate ? `&targetLanguage=${language}` : '';

    try {
      if (partner.type == 'user') {
        const tokenJWT = sessionStorage.getItem('tokenJWT');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/message/history?userId1=${userId}&userId2=${partner.id}&translate=${translate}${targetLanguageParam}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenJWT}`,
          }
        });
        if (!response.ok) throw new Error('Błąd podczas pobierania historii czatu');
        const data = await response.json();
        setMessages(data);

        try {
          const tokenXSRF = await fetchCsrfToken(setError);

          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/message/mark-all-read?userId1=${userId}&userId2=${partner.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
              'X-XSRF-TOKEN': tokenXSRF,
            },
            credentials: 'include',
          });
          if (!response.ok) {
            console.error('Failed to fetch chat history:', response.statusText);
            throw new Error('Failed to fetch chat history');
          }
        } catch (error) {
          console.error("Error:", error);
          setError('Błąd podczas pobierania histori czatu');
        }
      } else {
        const tokenJWT = sessionStorage.getItem('tokenJWT');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/message/history?userId1=${userId}&groupId=${partner.id}&translate=${translate}${targetLanguageParam}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenJWT}`,
          }
        });
        if (!response.ok) throw new Error('Błąd podczas pobierania historii czatu');
        const data = await response.json();

        const groupChatDetails = await Promise.all(
          data.map(async (message: Message) => {
            const senderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/simple/empId/${message.sender_id}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenJWT}`,
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
        setMessages(groupChatDetails);
      }
    } catch (error) {
      console.error("Error:", error);
      setError('Error fetching chat hisotry');
    }

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
              loading={setLoading}
              fetchChatHistory={fetchChatHistory}
              setError={setError} 
              userId={userId}
              setChatPartners={setChatPartners}
              fetchChatHistoryForm = {fetchChatHistory}
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
                  setError={setError}
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
                  setError={setError}
                />
              </>
            )}
          </div>
        </>
      ) : (
        <div className={styles.spinnerContainer}>
          <ProgressSpinner />
        </div>
      )}
      {isEditGroupModalOpen && (
        <EditGroup
          editGroupModal={setIsEditGroupModalOpen}
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
          selectedChat={selectedChat}
          loading={setLoading}
          setError={setError} />
      )}
      {error && <PrimeMessage severity="error" text={`Error: ${error}`} className={styles.errorMessageComponent} />}
      {loading && (
        <div className={styles.loadingModalOverlay}>
          <div className={styles.loadingModalContent}>
            <div className={styles.spinnerContainer}><ProgressSpinner /></div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Chat;