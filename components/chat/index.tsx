"use client";
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faPaperPlane, faImage, faPlus, faSearch, faEye, faUser, faUsers, faEdit, faUserMinus, faXmark, faTrash } from '@fortawesome/free-solid-svg-icons';
import styles from './main.module.scss';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Message from '@/components/types/message';
import Language from '@/components/types/language';
import ChatPartner from '@/components/types/chatPartner';
import AuthorizedImage from '@/components/chat/authorizedImage';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ProgressSpinner } from 'primereact/progressspinner';

const Chat = () => {
  const [chatPartners, setChatPartners] = useState<ChatPartner[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatPartner | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [newChat, setNewChat] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ChatPartner[]>([]);
  const [chatType, setChatType] = useState<'user' | 'group'>('user');
  const [isEditGroupModalOpen, setIsEditGroupModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<ChatPartner[]>([]);
  const [modalIsOpenLoadning, setModalIsOpenLoadning] = useState(false);
  const [userId, setUserId] = useState<number>(0);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem('userId');
    if (storedUserId !== null) {
      setUserId(Number(storedUserId));
    }
  }, []);

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
      const tokenJWT = sessionStorage.getItem('tokenJWT');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/simple/empId/search?q=${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenJWT}`,
        }
      });
      const data = await response.json();

      const filteredResults = chatType === 'group'
        ? data.filter(
          (user: ChatPartner) => !selectedUsers.some((member) => member.id === user.id)
        )
        : data;

      setSearchResults(filteredResults.map((user: any) => ({
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

    setModalIsOpenLoadning(true);
    try {
      const tokenJWT = sessionStorage.getItem('tokenJWT');
      const resquestXsrfToken = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/csrf`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenJWT}`,
        },
        credentials: 'include',
      });

      if (resquestXsrfToken.ok) {
        const data = await resquestXsrfToken.json();
        const tokenXSRF = data.token;

        const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}/api/v1/group', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            'X-XSRF-TOKEN': tokenXSRF,
          },
          credentials: 'include',
          body: JSON.stringify(groupData),
        });

        if (response.ok) {
          const newGroup = await response.json();
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
        setModalIsOpenLoadning(false);
      } else {
        console.error('Failed to fetch XSRF token, response not OK');
      }
    } catch (error) {
      console.error('Błąd podczas tworzenia grupy:', error);
    }
  };

  const handleEditGroup = () => {
    setIsEditGroupModalOpen(!isEditGroupModalOpen);
    loadGroupMembers();
  };

  const loadGroupMembers = async () => {
    try {
      if (!selectedChat) {
        console.error("Error: No group to edit.");
        return;
      }
      const tokenJWT = sessionStorage.getItem('tokenJWT');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/group/${selectedChat.id}/members`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenJWT}`,
        }
      });
      const members = await response.json();
      const membersWithNames = members.map((user: any) => ({
        ...user,
        name: `${user.firstname} ${user.surname}`
      }));
      setSelectedUsers(membersWithNames);
    } catch (error) {
      console.error('Błąd podczas pobierania członków grupy:', error);
    }
  };

  const handleAddUserToGroup = async (user: ChatPartner): Promise<void> => {
    setModalIsOpenLoadning(true);
    try {
      if (!selectedChat) {
        console.error("Error: No group to edit.");
        return;
      }
      const tokenJWT = sessionStorage.getItem('tokenJWT');
      const resquestXsrfToken = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/csrf`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenJWT}`,
        },
        credentials: 'include',
      });

      if (resquestXsrfToken.ok) {
        const data = await resquestXsrfToken.json();
        const tokenXSRF = data.token;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/group/${selectedChat.id}/user/${user.id}/add`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            'X-XSRF-TOKEN': tokenXSRF,
          },
          credentials: 'include',
        });

        if (response.ok) {
          setSelectedUsers((prevUsers) => [...prevUsers, user]);
          setSearchResults((prevResults) =>
            prevResults.filter((result) => result.id !== user.id)
          );
        } else {
          console.error('Błąd podczas dodawania użytkownika do grupy');
        }
        setModalIsOpenLoadning(false);
      } else {
        console.error('Failed to fetch XSRF token, response not OK');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleRemoveUserFromGroup = async (userId: number): Promise<void> => {
    if (!window.confirm("Are you sure to remove this user?")) {
      return;
    }

    setModalIsOpenLoadning(true);
    try {
      if (!selectedChat) {
        console.error("Error: No group to edit.");
        return;
      }
      const tokenJWT = sessionStorage.getItem('tokenJWT');
      const resquestXsrfToken = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/csrf`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenJWT}`,
        },
        credentials: 'include',
      });
      if (resquestXsrfToken.ok) {
        const data = await resquestXsrfToken.json();
        const tokenXSRF = data.token;
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/group/${selectedChat.id}/user/${userId}/remove`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            'X-XSRF-TOKEN': tokenXSRF,
          },
          credentials: 'include',
        });

        if (response.ok) {
          if (userId === userId) {
            await loadChatPartnersGroups(true);
            return;
          }
          setSelectedUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        } else {
          console.error('Błąd podczas usuwania użytkownika z grupy');
        }
        setModalIsOpenLoadning(false);
      } else {
        console.error('Failed to fetch XSRF token, response not OK');
      }
    } catch (error) {
      console.error('Błąd:', error);
    }
  };

  const handleDeleteGroup = async (): Promise<void> => {
    if (!selectedChat || selectedChat.type !== 'group') {
      console.error("Error: No group selected or trying to delete a non-group chat.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete the group "${selectedChat.name}"? This cant be undone!`)) {
      return;
    }

    setModalIsOpenLoadning(true);
    try {
      const tokenJWT = sessionStorage.getItem('tokenJWT');
      const resquestXsrfToken = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/csrf`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenJWT}`,
        },
        credentials: 'include',
      });
      if (resquestXsrfToken.ok) {
        const data = await resquestXsrfToken.json();
        const tokenXSRF = data.token;
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/group/${selectedChat.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
            'X-XSRF-TOKEN': tokenXSRF,
          },
          credentials: 'include',
        });

        if (response.ok) {
          console.log("deleted successfuly")
          await loadChatPartnersGroups(true);
        } else {
          console.error(`Failed to delete group "${selectedChat.name}".`);
        }
        setModalIsOpenLoadning(false);
      } else {
        console.error('Failed to fetch XSRF token, response not OK');
      }
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const tokenJWT = sessionStorage.getItem('tokenJWT');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/language`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenJWT}`,
          }
        });
        if (!response.ok) throw new Error('Failed to fetch languages');
        const data = await response.json();
        setLanguages(data);
      } catch (error) {
        console.error('Error while fetching languages:', error);
      }
    };
    fetchLanguages();
  }, []);

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const language = event.target.value;
    setSelectedLanguage(language);

    if (selectedChat) {
      fetchChatHistory(selectedChat, language);
    }
  };

  useEffect(() => {
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
            loadChatPartnersIndividual();
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
            loadChatPartnersGroups();
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

  const loadChatPartnersIndividual = async (selectFirstPartner = false) => {
    const tokenJWT = sessionStorage.getItem('tokenJWT');
    const chatPartnersIndividual = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/message/chat-partners?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenJWT}`,
      }
    });
    if (!chatPartnersIndividual.ok) throw new Error('Błąd podczas pobierania partnerów czatu');
    const dataIndividual = await chatPartnersIndividual.json();

    const partnersWithDetails = await Promise.all(
      dataIndividual.map(async (partnerId: number) => await fetchUserDetails(partnerId))
    );

    setChatPartners(partnersWithDetails);

    if (selectFirstPartner && partnersWithDetails.length > 0) {
      const newestChatPartner = partnersWithDetails[0];
      setSelectedChat(newestChatPartner);
      await fetchChatHistory(newestChatPartner, selectedLanguage);
    }
  }

  const loadChatPartnersGroups = async (selectFirstPartner = false) => {
    const tokenJWT = sessionStorage.getItem('tokenJWT');
    const chatPartnersGroups = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/group/chat-partners?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenJWT}`,
      }
    });
    if (!chatPartnersGroups.ok) throw new Error('Błąd podczas pobierania partnerów czatu');
    const dataGroups = await chatPartnersGroups.json();

    const groupsWithDetails = await Promise.all(
      dataGroups.map(async (partnerId: number) => await fetchGroupDetails(partnerId))
    );

    setChatPartners(groupsWithDetails);

    if (selectFirstPartner && groupsWithDetails.length > 0) {
      const newestChatPartner = groupsWithDetails[0];
      setSelectedChat(newestChatPartner);
      await fetchChatHistory(newestChatPartner, selectedLanguage);
    }
  }

  useEffect(() => {
    setIsEditGroupModalOpen(false);
    setNewChat(false);
    const loadPartners = async () => {
      if (chatType === 'user') {
        await loadChatPartnersIndividual(true);
      } else {
        await loadChatPartnersGroups(true);
      }
    };

    loadPartners();
  }, [chatType, userId]);

  useEffect(() => {
    setIsEditGroupModalOpen(false);
  }, [selectedChat]);

  useEffect(() => {
    const chatMessagesContainer = document.querySelector(`.${styles.chatMessages}`);
    if (chatMessagesContainer) {
      chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }
  }, [messages]);

  const fetchUserDetails = async (partnerId: number): Promise<ChatPartner> => {
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

      setModalIsOpenLoadning(true);
      try {
        const tokenJWT = sessionStorage.getItem('tokenJWT');
        const resquestXsrfToken = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/csrf`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenJWT}`,
          },
          credentials: 'include',
        });
        if (resquestXsrfToken.ok) {
          const data = await resquestXsrfToken.json();
          const tokenXSRF = data.token;
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/message/mark-all-read?userId1=${userId}&userId2=${partner.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${sessionStorage.getItem('tokenJWT')}`,
              'X-XSRF-TOKEN': tokenXSRF,
            },
            credentials: 'include',
          });

          setModalIsOpenLoadning(false);
        } else {
          console.error('Failed to fetch XSRF token, response not OK');
        }
      } catch (error) {
        console.error("Error:", error);
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

      setModalIsOpenLoadning(true);
      try {
        const tokenJWT = sessionStorage.getItem('tokenJWT');
        const resquestXsrfToken = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/csrf`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenJWT}`,
          },
          credentials: 'include',
        });
        if (resquestXsrfToken.ok) {
          const dataToken = await resquestXsrfToken.json();
          const tokenXSRF = dataToken.token;
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
          setModalIsOpenLoadning(false);
        } else {
          console.error('Failed to fetch XSRF token, response not OK');
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const validationSchema = Yup.object({
    message: Yup.string().required('Wiadomość nie może być pusta'),
  });

  return (
    <div className={styles.chatContainer}>
      {userId !== 0 ? (
        <>
          <div className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <div className={styles.headerTop}>
                <span>Translate: </span>
                <select
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                  className={styles.languageSelect}
                >
                  <option value="">None</option>
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
                    <FontAwesomeIcon icon={faUser} /> Individual
                  </div>

                  <div
                    onClick={() => setChatType('group')}
                    className={`${styles.sectionBlock} ${chatType === 'group' ? styles.activeSection : ''}`}
                  >
                    <FontAwesomeIcon icon={faUsers} /> Groups
                  </div>
                </div>

              </div>
              {chatType === 'user' && (
                <div>
                  <FontAwesomeIcon icon={faPlus} className={styles.icon} onClick={handleNewIndividualChat} />
                  New individual
                </div>
              )}

              {chatType === 'group' && (
                <div>
                  <FontAwesomeIcon icon={faPlus} className={styles.icon} onClick={handleNewGroupChat} />
                  New group
                </div>
              )}
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
                  {partner.photo ? (
                    // <img
                    //   className={styles.chatAvatar}
                    //   src={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/userPhoto/${partner.photo}`}
                    //   alt="User Photo"
                    // />
                    <AuthorizedImage
                      src={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/userPhoto/${partner.photo}`}
                      alt="User Photo"
                      className={styles.chatAvatar}
                    />
                  ) : (
                    <FontAwesomeIcon icon={faUsers} className={styles.defaultAvatarIcon} />
                  )}
                  <div>
                    <p className={styles.chatName}>{partner.name}</p>
                    <p className={styles.lastMessage}>{partner.lastMessage || 'Brak wiadomości'}</p>
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
                        {user.photo ? (
                          // <img
                          //   src={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/userPhoto/${user.photo}`}
                          //   className={styles.chatAvatar}
                          //   alt="User Avatar"
                          // />
                          <AuthorizedImage
                            src={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/userPhoto/${user.photo}`}
                            alt="User Photo"
                            className={styles.chatAvatar}
                          />
                        ) : (
                          <FontAwesomeIcon icon={faUser} className={styles.defaultAvatarIcon} />
                        )}
                        <p>{user.name}</p>
                      </li>
                    ))}
                  </ul>
                </div>)
            ) : selectedChat ? (
              <>
                <div className={styles.chatHeader}>
                  {selectedChat.photo ? (
                    // <img
                    //   className={styles.chatAvatar}
                    //   src={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/userPhoto/${selectedChat.photo}`}
                    //   alt="User Photo"
                    // />
                    <AuthorizedImage
                      src={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/userPhoto/${selectedChat.photo}`}
                      alt="User Photo"
                      className={styles.chatAvatar}
                    />
                  ) : (
                    <FontAwesomeIcon icon={faUsers} className={styles.defaultAvatarIcon} />
                  )}
                  <h2>{selectedChat.name}</h2>
                  {chatType === 'group' && (
                    <div onClick={handleEditGroup} className={styles.editIcon}>
                      <FontAwesomeIcon icon={faEdit} />
                    </div>
                  )}
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
                          {message.groupSenderPhoto || selectedChat.photo ? (
                            // <img
                            //   className={styles.chatAvatar}
                            //   src={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/userPhoto/${message.groupSenderPhoto || selectedChat.photo}`}
                            //   alt="User Avatar"
                            // />
                            <AuthorizedImage
                              src={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/userPhoto/${message.groupSenderPhoto || selectedChat.photo}`}
                              alt="User Photo"
                              className={styles.chatAvatar}
                            />
                          ) : (
                            <FontAwesomeIcon icon={faUsers} className={styles.defaultAvatarIcon} />
                          )}
                        </div>
                      )}
                      {message.sender_id !== userId && selectedChat?.type === 'group' && (
                        <span>{message.groupSenderName}</span>
                      )}
                      <p>{message.content}</p>
                      <span className={styles.timestamp}>{message.sent_at}</span>
                      {message.sender_id === userId && message.is_read && (
                        <FontAwesomeIcon icon={faEye} className={styles.readIcon} />
                      )}
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
              <p>Select chat</p>
            )}
          </div>
        </>
      ) : (<div className={styles.spinnerContainer}><ProgressSpinner /></div>)}
      {isEditGroupModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Edit group</h3>
            <input
              type="text"
              placeholder="Search user..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className={styles.searchInput}
            />
            <ul className={styles.searchResults}>
              {searchResults.map((user) => (
                <li
                  key={user.id}
                  onClick={() => handleAddUserToGroup(user)}
                  className={styles.searchResultItem}
                >
                  {user.photo ? (
                    <AuthorizedImage
                      src={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/userPhoto/${user.photo}`}
                      alt="User Photo"
                      className={styles.chatAvatar}
                    />
                    // <img
                    //   className={styles.chatAvatar}
                    //   src={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/userPhoto/${user.photo}`}
                    //   alt="User Photo"
                    // />
                  ) : (
                    <FontAwesomeIcon icon={faUsers} className={styles.defaultAvatarIcon} />
                  )}
                  <p>{user.name}</p>
                  <FontAwesomeIcon icon={faPlus} className={styles.addIcon} />
                </li>
              ))}
            </ul>

            <div className={styles.selectedUsers}>
              {selectedUsers.map((user) => (
                <div key={user.id} className={styles.selectedUser}>
                  {user.photo ? (
                    // <img
                    //   className={styles.chatAvatar}
                    //   src={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/userPhoto/${user.photo}`}
                    //   alt="User Photo"
                    // />
                    <AuthorizedImage
                      src={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/userPhoto/${user.photo}`}
                      alt="User Photo"
                      className={styles.chatAvatar}
                    />
                  ) : (
                    <FontAwesomeIcon icon={faUsers} className={styles.defaultAvatarIcon} />
                  )}
                  <p>{user.name}</p>
                  <FontAwesomeIcon icon={faUserMinus} onClick={() => handleRemoveUserFromGroup(user.id)} className={styles.removeIcon} />
                </div>
              ))}
            </div>
            <div className={styles.groupActions}>
              <FontAwesomeIcon
                icon={faTrash}
                className={styles.deleteIcon}
                onClick={handleDeleteGroup}
              />
            </div>
            <FontAwesomeIcon icon={faXmark} onClick={handleEditGroup} className={styles.closeIcon} />
          </div>
        </div>
      )}
      {modalIsOpenLoadning && (
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