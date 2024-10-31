"use client";
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faPaperPlane, faImage, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import styles from './main.module.scss';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Message from '@/components/types/message';

type ChatProps = {
  userId: number;
};

type ChatPartner = {
  id: number;
  firstName: string;
  lastName: string;
  photo: string;
};

const Chat: React.FC<ChatProps> = ({ userId }) => {
  const [chatPartners, setChatPartners] = useState<ChatPartner[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatPartner | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  useEffect(() => {
    const fetchChatPartners = async () => {
        const response = await fetch(`http://localhost:8080/api/v1/message/chat-partners?userId=${userId}`);
        if (!response.ok) throw new Error('Błąd podczas pobierania partnerów czatu');
        const data = await response.json();

        const partnersWithDetails = await Promise.all(
          data.map(async (partnerId: number) => await fetchUserDetails(partnerId))
        );

        setChatPartners(partnersWithDetails);
    };

    fetchChatPartners();
  }, [userId]);

  const fetchUserDetails = async (id: number): Promise<ChatPartner> => {
    const response = await fetch(`http://localhost:8080/api/v1/user/simple/empId/${id}`);
    if (!response.ok) throw new Error(`Błąd podczas pobierania danych użytkownika o ID ${id}`);
    const data = await response.json();
    return {
      id: id,
      firstName: data.firstname,
      lastName: data.surname,
      photo: data.photo,
    };
  };

  const fetchChatHistory = async (partner: ChatPartner) => {
    const response = await fetch(`http://localhost:8080/api/v1/message/history?userId1=${userId}&userId2=${partner.id}`);
    if (!response.ok) throw new Error('Błąd podczas pobierania historii czatu');
    const data = await response.json();
    setMessages(data);
    setSelectedChat(partner);
  };

  const handleSendMessage = async (content: string) => {
    if (content.trim() && selectedChat !== null) {
      console.log("senderId:", userId);
      console.log("receiverId:", selectedChat.id);
      console.log("content:", content);
      const messageData = {
        sender_id: userId,
        receiver_id: selectedChat.id, 
        content,
      };
      console.log("Sending message with:", messageData);

  
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
    }
  };
  

  const validationSchema = Yup.object({
    message: Yup.string().required('Wiadomość nie może być pusta'),
  });


  return (
    <div className={styles.chatContainer}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <FontAwesomeIcon icon={faCommentDots} className={styles.icon} />
          <h2>CZATY</h2>
          <FontAwesomeIcon icon={faPlus} className={styles.icon} />
        </div>
        <div className={styles.searchBar}>
          <FontAwesomeIcon icon={faSearch} className={styles.icon} />
          <input type="text" placeholder="Wyszukaj pracownika lub grupę" disabled />
        </div>
        <ul className={styles.chatList}>
          {chatPartners.map((partner) => (
            <li
              key={partner.id}
              className={`${styles.chatItem} ${selectedChat === partner ? styles.activeChat : ''}`}
              onClick={() => fetchChatHistory(partner)}
            >
              <img className={styles.chatAvatar} src={`http://localhost:8080/api/v1/userPhoto/${partner.photo}`} alt="User Photo" />
              <div>
                <p className={styles.chatName}>{partner.firstName} {partner.lastName}</p>
                <p className={styles.chatMessage}>Ostatnia wiadomość...</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.chatWindow}>
        {selectedChat ? (
          <>
            <div className={styles.chatHeader}>
              <img className={styles.chatAvatar} src={`http://localhost:8080/api/v1/userPhoto/${selectedChat.photo}`} alt="User Photo" />
              <h2>{selectedChat.firstName} {selectedChat.lastName}</h2>
            </div>
            <div className={styles.chatMessages}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`${styles.message} ${message.sender_id === userId ? styles.selfMessage : styles.otherMessage}`}
                >
                  {message.sender_id !== userId && <div className={styles.messageAvatar}>
                  <img className={styles.chatAvatar} src={`http://localhost:8080/api/v1/userPhoto/${selectedChat.photo}`} alt="User Photo" />
                    </div>}
                  <p>{message.content}</p>
                  <span className={styles.timestamp}>{message.sent_at}</span>
                </div>
              ))}
            </div>
            <Formik
              initialValues={{ message: '' }}
              validationSchema={validationSchema}
              onSubmit={(values, { resetForm }) => {
                handleSendMessage(values.message);
                resetForm();
              }}
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
