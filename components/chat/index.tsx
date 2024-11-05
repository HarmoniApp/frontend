"use client";
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faPaperPlane, faImage, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import styles from './main.module.scss';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Message from '@/components/types/message';
import Language from '@/components/types/language';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

type ChatProps = {
  userId: number;
};

type ChatPartner = {
  id: number;
  firstName: string;
  surname: string;
  photo: string;
  lastMessage?: string;
};

const Chat: React.FC<ChatProps> = ({ userId }) => {
  const [chatPartners, setChatPartners] = useState<ChatPartner[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatPartner | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [newChat, setNewChat] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ChatPartner[]>([]);

  const handleNewChat = () => {
    setNewChat(true);
    setSelectedChat(null);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 2) {
      const response = await fetch(`http://localhost:8080/api/v1/user/simple/empId/search?q=${query}`);
      const data = await response.json();
      setSearchResults(data.map((user: any) => ({
        id: user.id,
        firstName: user.firstname,
        lastName: user.surname,
        photo: user.photo,
      })));
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectUser = (user: ChatPartner) => {
    setNewChat(false);
    setSelectedChat(user);
    setSearchQuery('');
    setSearchResults([]);
    fetchChatHistory(user);
  };

  const fetchLastMessage = async (userId1: number, userId2: number) => {
    const response = await fetch(`http://localhost:8080/api/v1/message/last?userId1=${userId1}&userId2=${userId2}`);
    
    if (!response.ok) {
      throw new Error("Błąd podczas pobierania ostatniej wiadomości");
    }
  
    const data = await response.text();
    return data || 'Brak wiadomości';
  };

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/language')
      .then((response) => response.json())
      .then((data) => setLanguages(data))
      .catch((error) => console.error('Error fetching languages:', error));
  }, []);

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const language = event.target.value;
    setSelectedLanguage(language);

    if (selectedChat) {
      fetchChatHistory(selectedChat, language);
    }
  };

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/api/v1/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      onConnect: () => {
        console.log('Connected to STOMP WebSocket');

        stompClient.subscribe(`/client/messages/${userId}`, (message) => {
          const newMessage: Message = JSON.parse(message.body);

          setMessages((prevMessages) =>
            selectedChat &&
              (newMessage.sender_id === selectedChat.id || newMessage.receiver_id === selectedChat.id)
              ? [...prevMessages, newMessage]
              : prevMessages
          );
          loadChatPartners();
        });

        stompClient.subscribe(`/client/messages/read-status/${userId}`, (message) => {
          const updatedMessage: Message = JSON.parse(message.body);

          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === updatedMessage.id ? updatedMessage : msg
            )
          );
        });
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
    const response = await fetch(`http://localhost:8080/api/v1/message/chat-partners?userId=${userId}`);
    if (!response.ok) throw new Error('Błąd podczas pobierania partnerów czatu');
    const data = await response.json();

    const partnersWithDetails = await Promise.all(
      data.map(async (partnerId: number) => await fetchUserDetails(partnerId))
    );

    setChatPartners(partnersWithDetails);

    if (selectFirstPartner && partnersWithDetails.length > 0) {
      const newestChatPartner = partnersWithDetails[0];
      setSelectedChat(newestChatPartner);
      await fetchChatHistory(newestChatPartner);
    }

    if (selectedChat) {
      const activeChatPartner = partnersWithDetails.find(partner => partner.id === selectedChat.id);
      if (activeChatPartner) {
        setSelectedChat(activeChatPartner);
      }
    }
  };

  useEffect(() => {
    loadChatPartners(true);
  }, [userId]);


  const fetchUserDetails = async (partnerId: number): Promise<ChatPartner> => {
    const userDetailsResponse = await fetch(`http://localhost:8080/api/v1/user/simple/empId/${partnerId}`);
    if (!userDetailsResponse.ok) throw new Error(`Błąd podczas pobierania danych użytkownika o ID ${partnerId}`);
    const userDetails = await userDetailsResponse.json();
  
    const lastMessageResponse = await fetch(`http://localhost:8080/api/v1/message/last?userId1=${userId}&userId2=${partnerId}`);
    const lastMessageData = lastMessageResponse.ok ? await lastMessageResponse.text() : 'Brak wiadomości';
  
    return {
      id: partnerId,
      firstName: userDetails.firstname,
      surname: userDetails.surname,
      photo: userDetails.photo,
      lastMessage: lastMessageData
    };
  };

  const fetchChatHistory = async (partner: ChatPartner, language: string = '') => {
    setNewChat(false);
    const translate = language !== '';
    const targetLanguageParam = translate ? `&targetLanguage=${language}` : '';

    const response = await fetch(`http://localhost:8080/api/v1/message/history?userId1=${userId}&userId2=${partner.id}&translate=${translate}${targetLanguageParam}`);
    if (!response.ok) throw new Error('Błąd podczas pobierania historii czatu');
    const data = await response.json();
    setMessages(data);
    setSelectedChat(partner);
  };

  const handleSendMessage = async (content: string, language: string = '') => {
    if (content.trim() && selectedChat !== null) {
      const messageData = {
        sender_id: userId,
        receiver_id: selectedChat.id,
        content,
        is_read: false,
      };

      const response = await fetch(`http://localhost:8080/api/v1/message/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Błąd podczas wysyłania wiadomości: ${errorData.message || 'Nieznany błąd'}`);
      }

      const data = await response.json();
      setMessages((prevMessages) => [...prevMessages, data]);
      loadChatPartners();
      await fetchChatHistory(selectedChat, language);
    }
  };

  const markMessageAsRead = async (id: number) => {
    const updatedMessages = messages.map(message =>
      message.id === id ? { ...message, is_read: true } : message
    );
    setMessages(updatedMessages);

    await fetch(`http://localhost:8080/api/v1/message/${id}/read`, { method: 'PATCH' });
  };


  const validationSchema = Yup.object({
    message: Yup.string().required('Wiadomość nie może być pusta'),
  });

  return (
    <div className={styles.chatContainer}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.headerTop}>
            <FontAwesomeIcon icon={faCommentDots} className={styles.icon} />
            <h2>CZATY</h2>
            <FontAwesomeIcon icon={faPlus} className={styles.icon} onClick={handleNewChat} />
          </div>
          <div className={styles.headerBottom}>
          <span>Przetłumacz: </span>
            <select
              value={selectedLanguage}
              onChange={handleLanguageChange}
              className={styles.languageSelect}
            >
              <option value="">Brak tłumaczenia</option>
              {languages.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* <div className={styles.searchBar}>
          <FontAwesomeIcon icon={faSearch} className={styles.icon} />
          <input
            type="text"
            placeholder="Wyszukaj pracownika lub grupę"
            disabled={!newChat}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div> */}
        <ul className={styles.chatList}>
          {chatPartners.map((partner) => (
            <li
              key={partner.id}
              className={`${styles.chatItem} ${selectedChat === partner ? styles.activeChat : ''}`}
              onClick={() => fetchChatHistory(partner, selectedLanguage)}
            >
              <img
                className={styles.chatAvatar}
                src={`http://localhost:8080/api/v1/userPhoto/${partner.photo}`}
                alt="User Photo"
              />
              <div>
                <p className={styles.chatName}>{partner.firstName} {partner.surname}</p>
                <p className={styles.chatMessage}>{partner.lastMessage || 'Brak wiadomości'}</p>
                </div>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.chatWindow}>
        {newChat ? (
          <div className={styles.newChat}>
            <input
              type="text"
              placeholder="Wyszukaj użytkownika..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className={styles.searchInput}
            />
            <ul className={styles.searchResults}>
              {searchResults.map((user) => (
                <li
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className={styles.searchResultItem}
                >
                  <img
                    src={`http://localhost:8080/api/v1/userPhoto/${user.photo}`}
                    className={styles.chatAvatar}
                    alt="User Avatar"
                  />
                  <p>{user.firstName} {user.surname}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : selectedChat ? (
          <>
            <div className={styles.chatHeader}>
              <img
                className={styles.chatAvatar}
                src={`http://localhost:8080/api/v1/userPhoto/${selectedChat.photo}`}
                alt="User Photo"
              />
              <h2>{selectedChat.firstName} {selectedChat.surname}</h2>
            </div>
            <div className={styles.chatMessages}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  onClick={() =>
                    message.receiver_id === userId && !message.is_read && markMessageAsRead(message.id)
                  }
                  className={`${styles.message} ${message.sender_id === userId ? styles.selfMessage : styles.otherMessage
                    } ${message.is_read ? styles.readMessage : styles.unreadMessage}`}
                >
                  {message.sender_id !== userId && (
                    <div className={styles.messageAvatar}>
                      <img
                        className={styles.chatAvatar}
                        src={`http://localhost:8080/api/v1/userPhoto/${selectedChat?.photo}`}
                        alt="User Avatar"
                      />
                    </div>
                  )}
                  <p>{message.content}</p>
                  <span className={styles.timestamp}>{message.sent_at}</span>
                </div>
              ))}
            </div>
            <Formik
              initialValues={{ message: '' }}
              validationSchema={validationSchema}
              onSubmit={(values, { resetForm }) => {
                handleSendMessage(values.message, selectedLanguage);
                resetForm();
              }}
              validateOnBlur={false}
            >
              {({ errors, touched }) => (
                <Form className={styles.messageInputContainer}>
                  <FontAwesomeIcon icon={faImage} className={styles.icon} />
                  <Field
                    name="message"
                    type="text"
                    placeholder="Wpisz wiadomość"
                    className={`${styles.messageInput} ${errors.message && touched.message ? styles.errorInput : ''}`}
                  />
                  <button type="submit" className={styles.sendButton}>
                    <FontAwesomeIcon icon={faPaperPlane} className={styles.icon} />
                  </button>
                  {errors.message && touched.message && <div className={styles.errorMessage}>{errors.message}</div>}
                </Form>
              )}
            </Formik>
          </>
        ) : (
          <p>Wybierz czat, aby wyświetlić wiadomości</p>
        )}
      </div>
    </div>
  );

};

export default Chat;
