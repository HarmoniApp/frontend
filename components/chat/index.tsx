"use client";
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faPaperPlane, faImage, faPlus, faSearch, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
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
  name: string;
  photo?: string;
  lastMessage?: string;
  type?: 'user' | 'group';
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
  const [chatType, setChatType] = useState<'user' | 'group'>('user');
  const [groupId, setGroupId] = useState<number | null>(null);


  const handleNewIndividualChat = () => {
    setNewChat(true);
    setSelectedChat(null);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleNewGroupChat = () => {
    setNewChat(true);
    setChatType('group');
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
        name: user.firstname + " " + user.surname,
        photo: user.photo,
        type: 'user'
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

  const handleCreateGroup = async (values: { groupName: string }) => {
    const groupData = {
      name: values.groupName,
      membersIds: [userId],
    };

    try {
      const response = await fetch('http://localhost:8080/api/v1/group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(groupData),
      });

      if (response.ok) {
        const newGroup = await response.json();
        setGroupId(newGroup.id);
        setChatType('group');
        loadChatPartnersGroups();
        setNewChat(false);
        setChatPartners((prevPartners) => [...prevPartners, newGroup]);
        setSelectedChat(newGroup);
        fetchChatHistory(newGroup);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Błąd podczas tworzenia grupy');
      }
    } catch (error) {
      console.error('Błąd podczas tworzenia grupy:', error);
    }
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

        // stompClient.subscribe(`/client/messages/${userId}`, (message) => {
        //   const newMessage: Message = JSON.parse(message.body);

        //   setMessages((prevMessages) =>
        //     selectedChat &&
        //       (newMessage.sender_id === selectedChat.id || newMessage.receiver_id === selectedChat.id)
        //       ? [...prevMessages, newMessage]
        //       : prevMessages
        //   );
        //   loadChatPartners();
        // });

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
            loadChatPartnersIndividual();
          });
        } else if (chatType === 'group') {
          stompClient.subscribe(`/client/group-messages/${userId}`, (message) => {
            const newMessage: Message = JSON.parse(message.body);

            setMessages((prevMessages) =>
              selectedChat &&
                selectedChat.type === 'group' &&
                newMessage.group_id === selectedChat.id
                ? [...prevMessages, newMessage]
                : prevMessages
            );
            loadChatPartnersGroups();
          });
        }

        stompClient.subscribe(`/client/messages/read-status/${userId}`, (message) => {
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

    return () => {
      stompClient.deactivate();
    };
  }, [userId, selectedChat]);

  const loadChatPartnersIndividual = async (selectFirstPartner = false) => {
    const chatPartnersIndividual = await fetch(`http://localhost:8080/api/v1/message/chat-partners?userId=${userId}`);
    if (!chatPartnersIndividual.ok) throw new Error('Błąd podczas pobierania partnerów czatu');
    const dataIndividual = await chatPartnersIndividual.json();

    const partnersWithDetails = await Promise.all(
      dataIndividual.map(async (partnerId: number) => await fetchUserDetails(partnerId))
    );

    setChatPartners(partnersWithDetails);

    if (selectFirstPartner && partnersWithDetails.length > 0) {
      const newestChatPartner = partnersWithDetails[0];
      setSelectedChat(newestChatPartner);
      await fetchChatHistory(newestChatPartner);
    }

    // if (selectedChat) {
    //   const activeChatPartner = partnersWithDetails.find(partner => partner.id === selectedChat.id);
    //   if (activeChatPartner) {
    //     setSelectedChat(activeChatPartner);
    //   }
    // }
  }

  const loadChatPartnersGroups = async (selectFirstPartner = false) => {
    const chatPartnersGroups = await fetch(`http://localhost:8080/api/v1/group/chat-partners?userId=${userId}`);
    if (!chatPartnersGroups.ok) throw new Error('Błąd podczas pobierania partnerów czatu');
    const dataGroups = await chatPartnersGroups.json();

    const groupsWithDetails = await Promise.all(
      dataGroups.map(async (partnerId: number) => await fetchGroupDetails(partnerId))
    );

    setChatPartners(groupsWithDetails);

    if (selectFirstPartner && groupsWithDetails.length > 0) {
      const newestChatPartner = groupsWithDetails[0];
      setSelectedChat(newestChatPartner);
      await fetchChatHistory(newestChatPartner);
    }

    if (selectedChat) {
      const activeChatPartner = groupsWithDetails.find(partner => partner.id === selectedChat.id);
      if (activeChatPartner) {
        setSelectedChat(activeChatPartner);
      }
    }
  }

  useEffect(() => {
    if (!newChat) {
    if (chatType === 'user') {
      loadChatPartnersIndividual(true);
    } else {
      loadChatPartnersGroups(true);
    }
  }
  }, [chatType, userId]);

  // useEffect(() => {
  //   if (selectedChat) {
  //     fetchChatHistory(selectedChat);
  //   }
  // }, [chatType, selectedChat]);

  const fetchUserDetails = async (partnerId: number): Promise<ChatPartner> => {
    const userDetailsResponse = await fetch(`http://localhost:8080/api/v1/user/simple/empId/${partnerId}`);
    if (!userDetailsResponse.ok) throw new Error(`Błąd podczas pobierania danych użytkownika o ID ${partnerId}`);
    const userDetails = await userDetailsResponse.json();

    const lastMessageResponse = await fetch(`http://localhost:8080/api/v1/message/last?userId1=${userId}&userId2=${partnerId}`);
    const lastMessageData = lastMessageResponse.ok ? await lastMessageResponse.text() : 'Brak wiadomości';

    return {
      id: partnerId,
      name: userDetails.firstname + " " + userDetails.surname,
      photo: userDetails.photo,
      lastMessage: lastMessageData,
      type: 'user'
    };
  };

  const fetchGroupDetails = async (partnerId: number): Promise<ChatPartner> => {
    const groupDetailsResponse = await fetch(`http://localhost:8080/api/v1/group/details/${partnerId}`);
    if (!groupDetailsResponse.ok) throw new Error(`Błąd podczas pobierania danych grupy o ID ${partnerId}`);
    const groupDetails = await groupDetailsResponse.json();

    const lastMessageResponse = await fetch(`http://localhost:8080/api/v1/message/last?groupId=${partnerId}`);
    const lastMessageData = lastMessageResponse.ok ? await lastMessageResponse.text() : 'Brak wiadomości';

    return {
      id: partnerId,
      name: groupDetails.name,
      lastMessage: lastMessageData,
      type: 'group'
    };
  };

  const fetchChatHistory = async (partner: ChatPartner, language: string = '') => {
    setNewChat(false);
    const translate = language !== '';
    const targetLanguageParam = translate ? `&targetLanguage=${language}` : '';

    if (partner.type == 'user') {
      const response = await fetch(`http://localhost:8080/api/v1/message/history?userId1=${userId}&userId2=${partner.id}&translate=${translate}${targetLanguageParam}`);
      if (!response.ok) throw new Error('Błąd podczas pobierania historii czatu');
      const data = await response.json();
      setMessages(data);
    } else {
      const response = await fetch(`http://localhost:8080/api/v1/message/history?userId1=${userId}&groupId=${partner.id}&translate=${translate}${targetLanguageParam}`);
      if (!response.ok) throw new Error('Błąd podczas pobierania historii czatu');
      const data = await response.json();
      setMessages(data);
    }

    await fetch(`http://localhost:8080/api/v1/message/mark-all-read?userId1=${userId}&userId2=${partner.id}`, {
      method: 'PATCH',
    });

    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.receiver_id === userId ? { ...msg, is_read: true } : msg
      )
    );

    setSelectedChat(partner);
  };

  const handleSendMessage = async (content: string, language: string = '') => {
    if (content.trim() && selectedChat !== null) {
      var messageData;

      if (selectedChat.type == 'user') {
        messageData = {
          sender_id: userId,
          receiver_id: selectedChat.id,
          content,
          is_read: false,
        }
      } else {
        messageData = {
          sender_id: userId,
          group_id: selectedChat.id,
          content,
          is_read: false,
        }
      }

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
      if (selectedChat.type === 'user') {
        await loadChatPartnersIndividual();
      } else if (selectedChat.type === 'group') {
        await loadChatPartnersGroups();
      }
      await fetchChatHistory(selectedChat, language);
      setSelectedChat(selectedChat);
      console.log(selectedChat)
    }
  };

  const validationSchema = Yup.object({
    message: Yup.string().required('Wiadomość nie może być pusta'),
  });

  return (
    <div className={styles.chatContainer}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.headerTop}>
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
          <div className={styles.headerBottom}>
            <div className={styles.sectionSelector}>
              <div
                onClick={() => setChatType('user')}
                className={`${styles.sectionBlock} ${chatType === 'user' ? styles.activeSection : ''}`}
              >
                <FontAwesomeIcon icon={faUser} /> Indywidualne
              </div>

              <div
                onClick={() => setChatType('group')}
                className={`${styles.sectionBlock} ${chatType === 'group' ? styles.activeSection : ''}`}
              >
                <FontAwesomeIcon icon={faUsers} /> Grupowe
              </div>
            </div>

          </div>
          <div>
          <FontAwesomeIcon icon={faPlus} className={styles.icon} onClick={handleNewIndividualChat} />New individual
          </div>
          <div>
          <FontAwesomeIcon icon={faPlus} className={styles.icon} onClick={handleNewGroupChat} />New group
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
                <p className={styles.chatName}>{partner.name}</p>
                <p className={styles.chatMessage}>{partner.lastMessage || 'Brak wiadomości'}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.chatWindow}>
        {newChat ? (
           chatType === 'group' ? (
          <div className={styles.newChat}>
            <Formik
              initialValues={{ groupName: '' }}
              validationSchema={Yup.object({
                groupName: Yup.string().required('Nazwa grupy jest wymagana'),
              })}
              onSubmit={handleCreateGroup}
            >
              {({ errors, touched }) => (
                <Form className={styles.newGroupForm}>
                  <div>
                    <Field
                      name="groupName"
                      type="text"
                      placeholder="Nazwa grupy"
                      className={`${styles.groupNameInput} ${errors.groupName && touched.groupName ? styles.errorInput : ''}`}
                    />
                    {errors.groupName && touched.groupName && <div className={styles.errorMessage}>{errors.groupName}</div>}
                  </div>
                  <button type="submit" className={styles.createGroupButton}>Utwórz grupę</button>
                </Form>
              )}
            </Formik>
          </div>
        ) : (
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
                  {user.photo !== 'undefined' ? (
                    <img
                      src={`http://localhost:8080/api/v1/userPhoto/${user.photo}`}
                      className={styles.chatAvatar}
                      alt="User Avatar"
                    />
                  ) : (
                    <FontAwesomeIcon icon={faUsers} className={styles.defaultAvatarIcon} />
                  )}
                  <p>{user.name}</p>
                </li>
              ))}
            </ul>
          </div>)
        ) : selectedChat ? (
          <>
            <div className={styles.chatHeader}>
              <img
                className={styles.chatAvatar}
                src={`http://localhost:8080/api/v1/userPhoto/${selectedChat.photo}`}
                alt="User Photo"
              />
              <h2>{selectedChat.name}</h2>
            </div>
            <div className={styles.chatMessages}>
              {messages.map((message) => (
                <div
                  key={message.id}
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
              validateOnChange={false}
              validateOnSubmit={true}
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

