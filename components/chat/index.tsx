// import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCommentDots, faPaperPlane, faImage, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
// import styles from './main.module.scss';

// const Chat = () => {
//   return (
//     <div className={styles.chatContainer}>
//       <div className={styles.sidebar}>
//         <div className={styles.sidebarHeader}>
//           <FontAwesomeIcon icon={faCommentDots} className={styles.icon} />
//           <h2>CZATY</h2>
//           <FontAwesomeIcon icon={faPlus} className={styles.icon} />
//         </div>
//         <div className={styles.searchBar}>
//           <FontAwesomeIcon icon={faSearch} className={styles.icon} />
//           <input type="text" placeholder="Wyszukaj pracownika lub grupę" disabled />
//         </div>
//         <ul className={styles.chatList}>
//           <li className={`${styles.chatItem} ${styles.activeChat}`}>
//             <div className={styles.chatAvatar}></div>
//             <div>
//               <p className={styles.chatName}>Michał Szybki</p>
//               <p className={styles.chatMessage}>Witam. Załatwię to jak najsz...</p>
//             </div>
//           </li>
//           <li className={styles.chatItem}>
//             <div className={styles.chatAvatar}></div>
//             <div>
//               <p className={styles.chatName}>Mariola Nowak</p>
//               <p className={styles.chatMessage}>Za tydzień mam urlop. Nie...</p>
//             </div>
//           </li>
//           <li className={styles.chatItem}>
//             <div className={styles.chatAvatar}></div>
//             <div>
//               <p className={styles.chatName}>Wszyscy</p>
//               <p className={styles.chatMessage}>Karol: Uwaga dziś owocowy...</p>
//             </div>
//           </li>
//         </ul>
//       </div>
//       <div className={styles.chatWindow}>
//         <div className={styles.chatHeader}>
//           <div className={styles.chatAvatar}></div>
//           <h2>Michał Szybki</h2>
//         </div>
//         <div className={styles.chatMessages}>
//           <div className={`${styles.message} ${styles.otherMessage}`}>
//             <div className={styles.messageAvatar}></div>
//             <p>Hej, nie będzie mnie w piątek. Dałbyś radę zanieść dokumenty Marioli?</p>
//           </div>
//           <div className={`${styles.message} ${styles.highlightedMessage} ${styles.selfMessage}`}>
//             <p>Której Marioli? Nowak czy Żak?</p>
//           </div>
//           <div className={`${styles.message} ${styles.otherMessage}`}>
//             <div className={styles.messageAvatar}></div>
//             <p>Marioli Nowak.</p>
//           </div>
//           <div className={`${styles.message} ${styles.highlightedMessage} ${styles.selfMessage}`}>
//             <p>Jasne dostarczę.</p>
//           </div>
//         </div>
//         <div className={styles.messageInputContainer}>
//           <FontAwesomeIcon icon={faImage} className={styles.icon} />
//           <input type="text" placeholder="Wpisz wiadomość" disabled />
//           <FontAwesomeIcon icon={faPaperPlane} className={styles.icon} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chat;

"use client";
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faPaperPlane, faImage, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import styles from './main.module.scss';
import Message from '@/components/types/message';


type ChatProps = {
  userId: number;
};

const Chat: React.FC<ChatProps> = ({ userId }) => {
  const [chatPartners, setChatPartners] = useState<number[]>([]);
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  useEffect(() => {
    const fetchChatPartners = async () => {
        const response = await fetch(`http://localhost:8080/api/v1/message/chat-partners?userId=${userId}`);
        if (!response.ok) throw new Error('Błąd podczas pobierania partnerów czatu');
        const data = await response.json();
        setChatPartners(data);
    };

    fetchChatPartners();
  }, [userId]);

  const fetchChatHistory = async (partnerId: number) => {
      const response = await fetch(`http://localhost:8080/api/v1/message/history?userId1=${userId}&userId2=${partnerId}`);
      if (!response.ok) throw new Error('Błąd podczas pobierania historii czatu');
      const data = await response.json();
      console.log(data);
      setMessages(data);
      setSelectedChat(partnerId);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedChat !== null) {
        const response = await fetch(`http://localhost:8080/api/v1/message/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            senderId: userId,
            receiverId: selectedChat,
            content: newMessage,
          }),
        });
        if (!response.ok) throw new Error('Błąd podczas wysyłania wiadomości');
        const data = await response.json();
        setMessages((prevMessages) => [...prevMessages, data]);
        setNewMessage('');
    }
  };

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
          {chatPartners.map((partnerId) => (
            <li
              key={partnerId}
              className={`${styles.chatItem} ${selectedChat === partnerId ? styles.activeChat : ''}`}
              onClick={() => fetchChatHistory(partnerId)}
            >
              <div className={styles.chatAvatar}></div>
              <div>
                <p className={styles.chatName}>Użytkownik ID: {partnerId}</p>
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
              <div className={styles.chatAvatar}></div>
              <h2>Użytkownik ID: {selectedChat}</h2>
            </div>
            <div className={styles.chatMessages}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`${styles.message} ${message.sender_id === userId ? styles.selfMessage : styles.otherMessage}`}
                >
                  {message.sender_id !== userId && <div className={styles.messageAvatar}></div>}
                  <p>{message.content}</p>
                  <span className={styles.timestamp}>{message.sent_at}</span>
                </div>
              ))}
            </div>
            <div className={styles.messageInputContainer}>
              <FontAwesomeIcon icon={faImage} className={styles.icon} />
              <input
                type="text"
                placeholder="Wpisz wiadomość"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <FontAwesomeIcon icon={faPaperPlane} className={styles.icon} onClick={handleSendMessage} />
            </div>
          </>
        ) : (
          <p>Wybierz czat, aby wyświetlić wiadomości</p>
        )}
      </div>
    </div>
  );
};

export default Chat;
